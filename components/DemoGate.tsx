"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { AlertCircle, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  requestDemoCode,
  verifyDemoCode,
  type CodeCheckState,
  type CodeRequestState,
} from "@/app/actions/demo-access";
import ProjectFrame from "@/components/ProjectFrame";
import type { Demo } from "@/content/site";

const idleRequest: CodeRequestState = { status: "idle", message: "" };
const idleCheck: CodeCheckState = { status: "idle", message: "" };

// The same rules the server applies, so a visitor hears about a typo before anything is sent.
// (The server checks everything again; these only save a round trip.)
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const EMAIL_MESSAGE = "Enter an email address like name@company.com.";
const CODE_MESSAGE = "Enter the 6-digit code from the email.";

/**
 * Two steps: give an email address, then type the 6-digit code that was sent to it.
 * Once the code is right the visitor is sent on to the demo.
 */
export default function DemoGate({ demo, openHref }: { demo: Demo; openHref: string }) {
  const [request, requestAction, requesting] = useActionState(requestDemoCode, idleRequest);
  const [check, checkAction, checking] = useActionState(verifyDemoCode, idleCheck);
  const codeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const requestFormRef = useRef<HTMLFormElement>(null);

  // Formik holds each step's fields and their checks; the Server Actions still do the real work.
  const requestForm = useFormik({
    initialValues: { email: "", website: "" },
    validate: (values) => {
      const email = values.email.trim();
      return email.length <= 254 && EMAIL_RE.test(email) ? {} : { email: EMAIL_MESSAGE };
    },
    validateOnBlur: false,
    onSubmit: (values, helpers) => {
      const data = new FormData();
      data.set("demo", demo.id);
      // The hidden trap field is read from the page itself, so a bot that fills it without typing is caught.
      data.set("website", String(new FormData(requestFormRef.current ?? undefined).get("website") ?? values.website));
      data.set("email", values.email);
      startTransition(() => requestAction(data));
      helpers.setSubmitting(false);
    },
  });
  const codeForm = useFormik({
    initialValues: { code: "" },
    validate: (values) => (/^\d{6}$/.test(values.code.replace(/[\s-]/g, "")) ? {} : { code: CODE_MESSAGE }),
    validateOnBlur: false,
    onSubmit: (values, helpers) => {
      const data = new FormData();
      data.set("demo", demo.id);
      data.set("code", values.code);
      startTransition(() => checkAction(data));
      helpers.setSubmitting(false);
    },
  });

  // Remember where the code went, taking each new result while rendering rather than in an effect.
  const [seen, setSeen] = useState<CodeRequestState | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  if (request !== seen) {
    setSeen(request);
    if (request.status === "sent" && request.email) setSentTo(request.email);
  }

  const verified = check.status === "verified";
  const codeStep = sentTo !== null && !verified;

  useEffect(() => {
    if (codeStep) codeRef.current?.focus();
  }, [codeStep]);

  useEffect(() => {
    if (verified) window.location.replace(openHref);
  }, [verified, openHref]);

  // A typo shows first (and clears as it is fixed); otherwise whatever the server answered.
  const requestError =
    (requestForm.submitCount > 0 && requestForm.errors.email) ||
    (request.status !== "idle" && request.status !== "sent" ? request.message : "");
  const checkError =
    (codeForm.submitCount > 0 && codeForm.errors.code) ||
    (check.status !== "idle" && check.status !== "verified" ? check.message : "");

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = await requestForm.validateForm();
    await requestForm.submitForm();
    if (errors.email) emailRef.current?.focus();
  };
  const submitCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = await codeForm.validateForm();
    await codeForm.submitForm();
    if (errors.code) codeRef.current?.focus();
  };

  return (
    <div className="gate">
      <section className="gate__card" aria-labelledby="gate-title">
        <p className="gate__badge">
          <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
          Quick human check
        </p>

        {verified ? (
          <div role="status" className="gate__done">
            <CheckCircle2 size={28} strokeWidth={1.75} aria-hidden="true" />
            <h2 id="gate-title" className="gate__title">
              Confirmed. Opening the demo.
            </h2>
            <p className="gate__text">
              If nothing happens,{" "}
              <a href={openHref} className="gate__anchor">
                open the demo here
              </a>
              .
            </p>
          </div>
        ) : codeStep ? (
          <form action={checkAction} className="form" onSubmit={submitCode} noValidate>
            <h2 id="gate-title" className="gate__title">
              Enter your 6-digit code
            </h2>
            <p className="gate__text">
              We sent a code to <strong>{sentTo}</strong>. It works for 10 minutes. Check your spam folder if it
              doesn’t arrive within a minute.
            </p>
            <input type="hidden" name="demo" value={demo.id} />
            <div className="field">
              <label htmlFor="gate-code" className="field__label">
                Verification code
              </label>
              <input
                ref={codeRef}
                id="gate-code"
                name="code"
                value={codeForm.values.code}
                onChange={codeForm.handleChange}
                className="input input--code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]*"
                maxLength={7}
                required
                aria-required="true"
                aria-invalid={checkError ? true : undefined}
                aria-describedby="gate-code-msg"
                placeholder="123456"
              />
              <p id="gate-code-msg" className={checkError ? "field__msg field__msg--error" : "field__msg"} aria-live="polite">
                {checkError && <AlertCircle size={14} aria-hidden="true" />}
                {checkError}
              </p>
            </div>
            <div className="form__submit">
              <button type="submit" className="btn btn--primary" disabled={checking} aria-busy={checking}>
                {checking ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Checking
                  </>
                ) : (
                  "Open the demo"
                )}
              </button>
            </div>
          </form>
        ) : (
          <form ref={requestFormRef} action={requestAction} className="form" onSubmit={submitRequest} noValidate>
            <h2 id="gate-title" className="gate__title">
              Confirm your email to open the demo
            </h2>
            <p className="gate__text">
              Enter your email address. We send a 6-digit code, you type it here, and the demo opens. It takes about
              20 seconds.
            </p>
            <input type="hidden" name="demo" value={demo.id} />
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="gate-website">Leave this field empty</label>
              <input
                id="gate-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label htmlFor="gate-email" className="field__label">
                Email address
              </label>
              <input
                id="gate-email"
                name="email"
                ref={emailRef}
                value={requestForm.values.email}
                onChange={requestForm.handleChange}
                type="email"
                inputMode="email"
                className="input"
                autoComplete="email"
                maxLength={254}
                required
                aria-required="true"
                aria-invalid={requestError ? true : undefined}
                aria-describedby="gate-email-msg"
                placeholder="name@company.com"
              />
              <p id="gate-email-msg" className={requestError ? "field__msg field__msg--error" : "field__msg"} aria-live="polite">
                {requestError && <AlertCircle size={14} aria-hidden="true" />}
                {requestError}
              </p>
            </div>
            <div className="form__submit">
              <button type="submit" className="btn btn--primary" disabled={requesting} aria-busy={requesting}>
                {requesting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    <Mail size={16} strokeWidth={2} aria-hidden="true" />
                    Send my code
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {codeStep && (
          <form action={requestAction} className="gate__again">
            <input type="hidden" name="demo" value={demo.id} />
            <input type="hidden" name="email" value={sentTo ?? ""} />
            <button type="submit" className="gate__link" disabled={requesting}>
              {requesting ? "Sending a new code" : "Send a new code"}
            </button>
            <button type="button" className="gate__link" onClick={() => setSentTo(null)}>
              Use a different email
            </button>
            {requestError && <span className="field__msg field__msg--error">{requestError}</span>}
          </form>
        )}

        <p className="gate__privacy">
          We use your email to send the code, and to let the OrbiTech team know who opened this demo. We don’t sell
          it or add it to a mailing list.{" "}
          <Link href="/privacy" className="gate__anchor">
            Privacy
          </Link>
        </p>
      </section>

      <aside className="gate__preview" aria-label="About this demo">
        <ProjectFrame image={demo.cover} sizes="(min-width: 60rem) 40vw, 100vw" priority />
        <h2 className="gate__demo-name">{demo.name}</h2>
        <p className="gate__demo-place">{demo.place}</p>
        <p className="gate__text">{demo.summary}</p>
        <ul className="gate__list">
          {demo.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
