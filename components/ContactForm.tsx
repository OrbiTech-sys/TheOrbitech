"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { sendEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { Pending } from "@/components/Pending";
import { contactOptions, site } from "@/content/site";
import { ENQUIRY_FIELDS, MAX, parseEnquiry, type EnquiryErrors, type EnquiryField } from "@/lib/enquiry-schema";

export interface ContactPrefill {
  /** Changes whenever a new prefill is applied, so the form knows to take it */
  key: string;
  projectType?: string;
  estimate?: string;
  message?: string;
}

const initialState: EnquiryState = { status: "idle", message: "" };

const blank = { name: "", email: "", company: "", projectType: "", budget: "", timeline: "", message: "" };
type Values = typeof blank;

export default function ContactForm({ prefill }: { prefill?: ContactPrefill }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(sendEnquiry, initialState);
  const [values, setValues] = useState<Values>(blank);
  const [clientErrors, setClientErrors] = useState<EnquiryErrors>({});
  // Fields edited since the last submit no longer show their old error.
  const [edited, setEdited] = useState<Partial<Record<EnquiryField, true>>>({});
  const [appliedKey, setAppliedKey] = useState("");
  const [estimate, setEstimate] = useState("");

  // Take new pre-fill (from the estimator) while rendering, not in an effect.
  if (prefill && prefill.key !== appliedKey) {
    setAppliedKey(prefill.key);
    setEstimate(prefill.estimate ?? "");
    setValues((prev) => ({
      ...prev,
      projectType: prefill.projectType ?? prev.projectType,
      message: prefill.message ?? prev.message,
    }));
  }

  const errors: EnquiryErrors = { ...state.fieldErrors, ...clientErrors };
  const errorFor = (field: EnquiryField) => (edited[field] ? undefined : errors[field]);

  // After the server reports problems, move focus to the first one.
  useEffect(() => {
    if (state.status === "invalid" && state.fieldErrors) {
      const first = ENQUIRY_FIELDS.find((f) => state.fieldErrors?.[f]);
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    }
  }, [state]);

  const onChange =
    (field: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setEdited((prev) => ({ ...prev, [field]: true }));
    };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = parseEnquiry(data);
    setEdited({});
    if (!result.ok) {
      setClientErrors(result.errors);
      const first = ENQUIRY_FIELDS.find((f) => result.errors[f]);
      if (first) (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setClientErrors({});
    startTransition(() => formAction(data));
  };

  const message = (field: EnquiryField, hint?: string) => {
    const text = errorFor(field);
    return (
      <p id={`contact-${field}-msg`} className={text ? "field__msg field__msg--error" : "field__msg"}>
        {text && <AlertCircle size={14} aria-hidden="true" />}
        {text ?? hint}
      </p>
    );
  };
  const invalid = (field: EnquiryField) => (errorFor(field) ? true : undefined);

  const showNotice = state.status !== "idle" && state.status !== "invalid";

  return (
    <form ref={formRef} className="form" action={formAction} onSubmit={onSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="estimate" value={estimate} />

      {estimate && (
        <p className="form__attached">
          Attached estimate: <strong>{estimate}</strong>
        </p>
      )}

      <div className="form__row">
        <div className="field">
          <label htmlFor="contact-name" className="field__label">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            className="input"
            autoComplete="name"
            required
            aria-required="true"
            maxLength={MAX.name}
            value={values.name}
            onChange={onChange("name")}
            aria-invalid={invalid("name")}
            aria-describedby="contact-name-msg"
          />
          {message("name")}
        </div>
        <div className="field">
          <label htmlFor="contact-email" className="field__label">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            className="input"
            autoComplete="email"
            required
            aria-required="true"
            maxLength={MAX.email}
            value={values.email}
            onChange={onChange("email")}
            aria-invalid={invalid("email")}
            aria-describedby="contact-email-msg"
          />
          {message("email")}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="contact-company" className="field__label">
            Company <span className="field__optional">(optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            className="input"
            autoComplete="organization"
            maxLength={MAX.company}
            value={values.company}
            onChange={onChange("company")}
            aria-describedby="contact-company-msg"
          />
          {message("company")}
        </div>
        <div className="field">
          <label htmlFor="contact-projectType" className="field__label">
            Project type <span className="field__optional">(optional)</span>
          </label>
          <div className="select">
            <select
              id="contact-projectType"
              name="projectType"
              className="input"
              value={values.projectType}
              onChange={onChange("projectType")}
              aria-invalid={invalid("projectType")}
              aria-describedby="contact-projectType-msg"
            >
              <option value="">Choose one</option>
              {contactOptions.projectTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {message("projectType")}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="contact-budget" className="field__label">
            Budget <span className="field__optional">(optional)</span>
          </label>
          <div className="select">
            <select
              id="contact-budget"
              name="budget"
              className="input"
              value={values.budget}
              onChange={onChange("budget")}
              aria-describedby="contact-budget-msg"
            >
              <option value="">Choose a range</option>
              {contactOptions.budgets.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {message("budget")}
        </div>
        <div className="field">
          <label htmlFor="contact-timeline" className="field__label">
            Timing <span className="field__optional">(optional)</span>
          </label>
          <div className="select">
            <select
              id="contact-timeline"
              name="timeline"
              className="input"
              value={values.timeline}
              onChange={onChange("timeline")}
              aria-describedby="contact-timeline-msg"
            >
              <option value="">Choose one</option>
              {contactOptions.timelines.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {message("timeline")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-message" className="field__label">
          About the project
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="input"
          rows={6}
          required
          aria-required="true"
          maxLength={MAX.message}
          value={values.message}
          onChange={onChange("message")}
          aria-invalid={invalid("message")}
          aria-describedby="contact-message-msg"
        />
        {message("message", "What it does, who it’s for, and anything already in place.")}
      </div>

      {showNotice && (
        <div className="notice notice--error" role="alert">
          <AlertCircle size={18} strokeWidth={2} aria-hidden="true" className="notice__icon" />
          <div>
            <p className="notice__title">{state.message}</p>
            {state.status === "unconfigured" && (
              <p>
                {site.email ? (
                  <>
                    Please email{" "}
                    <a href={`mailto:${site.email}`} className="ulink">
                      {site.email}
                    </a>{" "}
                    instead.
                  </>
                ) : (
                  <Pending>Fallback email address</Pending>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="form__submit">
        <button type="submit" className="btn btn--kiln" disabled={pending} aria-busy={pending}>
          {pending ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Sending
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p className="form__privacy">
          We use these details only to reply to you. <Link href="/privacy" className="ulink">Privacy</Link>
        </p>
      </div>
    </form>
  );
}
