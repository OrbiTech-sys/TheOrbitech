"use client";

import { useState } from "react";
import { AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { contactOptions, site } from "@/content/site";
import { enquiryEmail, mailtoHref } from "@/lib/enquiry-email";
import { ENQUIRY_FIELDS, MAX, parseEnquiry, type EnquiryErrors, type EnquiryField } from "@/lib/enquiry-schema";

export interface ContactPrefill {
  /** Changes whenever a new prefill is applied, so the form knows to take it */
  key: string;
  projectType?: string;
  estimate?: string;
  message?: string;
}

const blank = { name: "", email: "", company: "", projectType: "", budget: "", timeline: "", message: "" };
type Values = typeof blank;

export default function ContactForm({ prefill }: { prefill?: ContactPrefill }) {
  const [values, setValues] = useState<Values>(blank);
  const [clientErrors, setClientErrors] = useState<EnquiryErrors>({});
  // Fields edited since the last submit no longer show their old error.
  const [edited, setEdited] = useState<Partial<Record<EnquiryField, true>>>({});
  const [appliedKey, setAppliedKey] = useState("");
  const [estimate, setEstimate] = useState("");
  // The drafted email, shown only when no email app opened for it.
  const [noMailApp, setNoMailApp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const errorFor = (field: EnquiryField) => (edited[field] ? undefined : clientErrors[field]);

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
    if (!site.email) return;
    // Open the visitor's own email app with the message written and addressed.
    const email = enquiryEmail(result.data, site.name);
    setNoMailApp(null);
    setCopied(false);

    // Browsers can't say whether an email app is installed. When one opens, this
    // page loses focus; if nothing takes focus shortly after, assume there is none.
    let opened = false;
    const markOpened = () => {
      opened = true;
    };
    window.addEventListener("blur", markOpened, { once: true });
    document.addEventListener("visibilitychange", markOpened, { once: true });
    window.location.href = mailtoHref(site.email, email);
    window.setTimeout(() => {
      window.removeEventListener("blur", markOpened);
      document.removeEventListener("visibilitychange", markOpened);
      if (!opened) setNoMailApp(`Subject: ${email.subject}

${email.body}`);
    }, 1500);
  };

  const copyMessage = async () => {
    if (!noMailApp) return;
    try {
      await navigator.clipboard.writeText(noMailApp);
      setCopied(true);
    } catch {
      setCopied(false);
    }
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

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
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

      {!site.email && (
        <div className="notice notice--error" role="alert">
          <AlertCircle size={18} strokeWidth={2} aria-hidden="true" className="notice__icon" />
          <p className="notice__title">Our email address isn’t set up yet, so this form can’t prepare your message.</p>
        </div>
      )}

      {noMailApp && site.email && (
        <div className="notice notice--ready" role="alert">
          <Mail size={18} strokeWidth={2} aria-hidden="true" className="notice__icon" />
          <div>
            <p className="notice__title">No email app was found on this device.</p>
            <p>
              Please email your enquiry to <a href={`mailto:${site.email}`}>{site.email}</a> from any email account, such as
              Gmail or Outlook on the web. Your message is already written:{" "}
              <button type="button" className="notice__action" onClick={copyMessage}>
                {copied ? "Copied" : "Copy your message"}
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="form__submit">
        <button type="submit" className="btn btn-primary">
          Send message
        </button>
        <p className="form__privacy">
          Opens your email app with your message written and ready to send. <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </form>
  );
}
