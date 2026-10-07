import http from "node:http";

export interface MockMail {
  /** JSON bodies the site sent, with the Authorization header it used */
  requests: { authorization: string | undefined; body: Record<string, unknown> }[];
  /** Status code to answer with: 200 for success, 500 to simulate an outage */
  status: number;
  close(): Promise<void>;
}

/** A stand-in for the email provider, so tests never send real mail. */
export function startMockMail(port: number): Promise<MockMail> {
  const mock: MockMail = { requests: [], status: 200, close: () => Promise.resolve() };

  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        mock.requests.push({
          authorization: req.headers.authorization,
          body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
        });
      } catch {
        /* ignore malformed bodies */
      }
      res.writeHead(mock.status, { "content-type": "application/json" });
      res.end(JSON.stringify({ id: "mock" }));
    });
  });

  mock.close = () => new Promise((resolve) => server.close(() => resolve()));
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(mock));
  });
}
