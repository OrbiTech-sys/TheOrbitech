"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { sendEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { site } from "@/content/site";
import { Pending } from "@/components/Pending";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState: EnquiryState = { status: "idle", message: "" };
const days = ["First available", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["Morning", "Midday", "Afternoon"];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timeZoneRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(sendEnquiry, initialState);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      // Start in the first field rather than on the close button.
      dialog.querySelector<HTMLInputElement>("#call-name")?.focus();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (timeZoneRef.current && !timeZoneRef.current.value) {
      timeZoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    }
  }, []);

  const close = () => dialogRef.current?.close();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setDismissed(false);
    startTransition(() => formAction(data));
  };

  const errors = state.fieldErrors ?? {};
  const done = state.status === "sent" && !dismissed;

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="call-title"
      onClose={() => {
        if (state.status === "sent") setDismissed(true);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog__body">
        <div className="dialog__head">
          <h2 id="call-title" className="dialog__title">Book a call</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close">
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {done ? (
          <div className="notice notice--success" role="status">
            <Check size={18} strokeWidth={2} aria-hidden="true" className="notice__icon" />
            <div>
              <p className="notice__title">{state.message}</p>
              <button type="button" className="btn btn--secondary notice__action" onClick={close}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="dialog__lede">
              Thirty minutes about your project. Tell us when suits you and we’ll reply by email to
              confirm a time.
            </p>

            <form className="form" action={formAction} onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="kind" value="call" />
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="call-website">Website</label>
                <input id="call-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="form__row form__row--2">
                <div className="field">
                  <label htmlFor="call-name" className="field__label">Your name</label>
                  <input
                    id="call-name"
                    name="name"
                    className="input"
                    autoComplete="name"
                    required
                    maxLength={120}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby="call-name-msg"
                  />
                  <p id="call-name-msg" className={errors.name ? "field__msg field__msg--error" : "field__msg"}>
                    {errors.name && <AlertCircle size={14} aria-hidden="true" />}
                    {errors.name}
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="call-email" className="field__label">Work email</label>
                  <input
                    id="call-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    className="input"
                    autoComplete="email"
                    required
                    maxLength={254}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby="call-email-msg"
                  />
                  <p id="call-email-msg" className={errors.email ? "field__msg field__msg--error" : "field__msg"}>
                    {errors.email && <AlertCircle size={14} aria-hidden="true" />}
                    {errors.email}
                  </p>
                </div>
              </div>

              <div className="form__row form__row--2">
                <div className="field">
                  <label htmlFor="call-day" className="field__label">Preferred day</label>
                  <div className="select">
                    <select
                      id="call-day"
                      name="preferredDay"
                      className="input"
                      defaultValue="First available"
                      aria-invalid={errors.preferredDay ? true : undefined}
                      aria-describedby="call-day-msg"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <p id="call-day-msg" className={errors.preferredDay ? "field__msg field__msg--error" : "field__msg"}>
                    {errors.preferredDay}
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="call-time" className="field__label">Time of day</label>
                  <div className="select">
                    <select id="call-time" name="preferredTime" className="input" defaultValue="Morning">
                      {times.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <p className="field__msg" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="call-tz" className="field__label">
                  Your time zone <span className="field__optional">(optional)</span>
                </label>
                <input id="call-tz" ref={timeZoneRef} name="timeZone" className="input" maxLength={80} />
                <p className="field__msg">Filled in from your browser. Change it if it’s wrong.</p>
              </div>

              <div className="field">
                <label htmlFor="call-note" className="field__label">
                  Anything we should know first? <span className="field__optional">(optional)</span>
                </label>
                <textarea id="call-note" name="message" className="input" rows={3} maxLength={4000} />
                <p className="field__msg" />
              </div>

              {state.status !== "idle" && state.status !== "sent" && state.status !== "invalid" && (
                <div className="notice notice--error" role="alert">
                  <AlertCircle size={18} strokeWidth={2} aria-hidden="true" className="notice__icon" />
                  <div>
                    <p className="notice__title">{state.message}</p>
                    {state.status === "unconfigured" && (
                      <p>
                        {site.contact.email ? (
                          <>
                            Email us at{" "}
                            <a href={`mailto:${site.contact.email}`} className="link">{site.contact.email}</a>{" "}
                            to arrange a call.
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
                <button type="submit" className="btn btn--primary" disabled={pending} aria-busy={pending}>
                  {pending ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    "Request a call"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
