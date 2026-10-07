import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requestHeaders: new Headers() }));

vi.mock("next/headers", () => ({ headers: async () => mocks.requestHeaders }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

import { sendEnquiry, type EnquiryState } from "@/app/actions/enquiry";

const idle: EnquiryState = { status: "idle", message: "" };
let ipCounter = 0;

function setRequest(overrides: Record<string, string> = {}) {
  ipCounter += 1;
  mocks.requestHeaders = new Headers({
    host: "orbitech.test",
    origin: "https://orbitech.test",
    "x-forwarded-for": `203.0.113.${ipCounter}`,
    ...overrides,
  });
}

function form(values: Record<string, string> = {}) {
  const data = new FormData();
  const base = { name: "Sam Tan", email: "sam@example.com", message: "We need a new marketing site." };
  for (const [key, value] of Object.entries({ ...base, ...values })) data.set(key, value);
  return data;
}

const configure = () => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@orbitech.test");
  vi.stubEnv("CONTACT_FROM_EMAIL", "OrbiTech <enquiries@orbitech.test>");
  vi.stubEnv("RESEND_API_URL", "http://mail.test/emails");
};

type Outcome = EnquiryState | { redirected: string };

/** Server Actions finish a successful submit by redirecting, which throws. */
async function run(data: FormData): Promise<Outcome> {
  try {
    return await sendEnquiry(idle, data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("NEXT_REDIRECT:")) {
      return { redirected: error.message.replace("NEXT_REDIRECT:", "") };
    }
    throw error;
  }
}

describe("sendEnquiry", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    setRequest();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("refuses requests from another origin", async () => {
    configure();
    setRequest({ origin: "https://evil.example" });
    expect(await run(form())).toMatchObject({ status: "forbidden" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses cross-site requests that carry no Origin header", async () => {
    configure();
    mocks.requestHeaders = new Headers({
      host: "orbitech.test",
      "sec-fetch-site": "cross-site",
      "x-forwarded-for": "198.51.100.9",
    });
    expect(await run(form())).toMatchObject({ status: "forbidden" });
  });

  it("returns field errors and sends nothing when input is invalid", async () => {
    configure();
    const result = (await run(form({ email: "nope", name: "" }))) as EnquiryState;
    expect(result.status).toBe("invalid");
    expect(result.fieldErrors).toHaveProperty("email");
    expect(result.fieldErrors).toHaveProperty("name");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends success to bots that fill the honeypot, and sends nothing", async () => {
    configure();
    expect(await run(form({ website: "http://spam.example" }))).toEqual({ redirected: "/contact/thanks" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says plainly when email delivery isn't configured, and doesn't fake success", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const result = (await run(form())) as EnquiryState;
    expect(result.status).toBe("unconfigured");
    expect(result.message).toMatch(/wasn.t sent/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("emails the enquiry and redirects to the thank-you page", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const result = await run(form({ company: "Tan & Co", projectType: "Website" }));

    expect(result).toEqual({ redirected: "/contact/thanks" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://mail.test/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test_key");
    const payload = JSON.parse(init.body as string);
    expect(payload).toMatchObject({
      to: ["inbox@orbitech.test"],
      from: "OrbiTech <enquiries@orbitech.test>",
      reply_to: "sam@example.com",
    });
    expect(payload.subject).toContain("Sam Tan");
    expect(payload.text).toContain("Project type: Website");
    expect(payload.text).toContain("We need a new marketing site.");
  });

  it("reports a mail-service error instead of pretending it worked", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("nope", { status: 500 }));
    const result = (await run(form())) as EnquiryState;
    expect(result.status).toBe("error");
    expect(result.message).toMatch(/wasn.t sent/);
  });

  it("reports a network failure", async () => {
    configure();
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await run(form())).toMatchObject({ status: "error" });
  });

  it("never puts the API key in what it returns", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("nope", { status: 401 }));
    expect(JSON.stringify(await run(form()))).not.toContain("re_test_key");
  });

  it("rate-limits repeated submissions from one address", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const outcomes: Outcome[] = [];
    for (let i = 0; i < 6; i += 1) {
      mocks.requestHeaders = new Headers({
        host: "orbitech.test",
        origin: "https://orbitech.test",
        "x-forwarded-for": "192.0.2.77",
      });
      outcomes.push(await run(form()));
    }
    expect(outcomes.slice(0, 5).every((o) => "redirected" in o)).toBe(true);
    expect(outcomes[5]).toMatchObject({ status: "rate_limited" });
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
