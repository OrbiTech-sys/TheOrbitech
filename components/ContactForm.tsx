"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { sendEnquiry, type EnquiryState } from "@/app/actions/enquiry";
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

type Values = Record<EnquiryField, string>;

const blank: Values = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  estimate: "",
  website: "",
};

/** The shared zod schema holds the rules, so the browser and the server can never disagree. */
function validate(values: Values): EnquiryErrors {
  const result = parseEnquiry(values);
  return result.ok ? {} : result.errors;
}

/**
 * Formik holds the values, checks them as they change and runs the submit. The Server Action
 * is still what receives the message (and checks it again), so nothing about delivery changes.
 */
export default function ContactForm({ prefill }: { prefill?: ContactPrefill }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(sendEnquiry, initialState);
  // What was last sent, so a server-side error clears as soon as that field is changed.
  const [sent, setSent] = useState<Values | null>(null);

  const formik = useFormik<Values>({
    initialValues: blank,
    validate,
    validateOnBlur: false,
    onSubmit: (submitted, helpers) => {
      const data = new FormData();
      for (const field of ENQUIRY_FIELDS) data.set(field, submitted[field]);
      // The hidden trap field is read from the page itself, not from Formik, so a bot that fills it
      // without typing is still caught.
      if (formRef.current) data.set("website", String(new FormData(formRef.current).get("website") ?? ""));
      setSent(submitted);
      startTransition(() => formAction(data));
      helpers.setSubmitting(false);
    },
  });
  const { values, setValues, validateForm, submitForm } = formik;

  // Take new pre-fill (from the estimator or the home page box) when it arrives.
  const appliedKey = useRef("");
  useEffect(() => {
    if (!prefill || prefill.key === appliedKey.current) return;
    appliedKey.current = prefill.key;
    setValues((prev) => ({
      ...prev,
      estimate: prefill.estimate ?? "",
      projectType: prefill.projectType ?? prev.projectType,
      message: prefill.message ?? prev.message,
    }));
  }, [prefill, setValues]);

  // Browser-side problems show after the first send attempt and update as the visitor types.
  // Server-side problems show until that field is changed.
  const errorFor = (field: EnquiryField): string | undefined => {
    if (formik.submitCount > 0 && formik.errors[field]) return formik.errors[field];
    const fromServer = state.fieldErrors?.[field];
    return fromServer && sent && sent[field] === values[field] ? fromServer : undefined;
  };

  // After the server reports problems, move focus to the first one.
  useEffect(() => {
    if (state.status === "invalid" && state.fieldErrors) {
      const first = ENQUIRY_FIELDS.find((f) => state.fieldErrors?.[f]);
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    }
  }, [state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = await validateForm();
    const first = ENQUIRY_FIELDS.find((f) => errors[f]);
    await submitForm();
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
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
    <form ref={formRef} className="form" action={formAction} onSubmit={handleSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="estimate" value={values.estimate} />

      {values.estimate && (
        <p className="form__attached">
          Attached estimate: <strong>{values.estimate}</strong>
        </p>
      )}

      <div className="form__row">
        <div className="field">
          <label htmlFor="contact-name" className="field__label">
            Full name
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
            onChange={formik.handleChange}
            aria-invalid={invalid("name")}
            aria-describedby="contact-name-msg"
          />
          {message("name")}
        </div>
        <div className="field">
          <label htmlFor="contact-email" className="field__label">
            Business email
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
            onChange={formik.handleChange}
            aria-invalid={invalid("email")}
            aria-describedby="contact-email-msg"
          />
          {message("email")}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="contact-company" className="field__label">
            Company name <span className="field__optional">(optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            className="input"
            autoComplete="organization"
            maxLength={MAX.company}
            value={values.company}
            onChange={formik.handleChange}
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
              onChange={formik.handleChange}
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
            Estimated budget <span className="field__optional">(optional)</span>
          </label>
          <div className="select">
            <select
              id="contact-budget"
              name="budget"
              className="input"
              value={values.budget}
              onChange={formik.handleChange}
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
            Project timeline <span className="field__optional">(optional)</span>
          </label>
          <div className="select">
            <select
              id="contact-timeline"
              name="timeline"
              className="input"
              value={values.timeline}
              onChange={formik.handleChange}
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
          Project description
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
          onChange={formik.handleChange}
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
            {state.status === "unconfigured" && site.email && (
              <p>
                Please email{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a> instead.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="form__submit">
        <button type="submit" className="btn btn--primary btn--lg" disabled={pending} aria-busy={pending}>
          {pending ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Sending
            </>
          ) : (
            "Send Project Inquiry"
          )}
        </button>
        <p className="form__privacy">
          We use these details only to reply to you. <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </form>
  );
}
