"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buildMailto, cn, fill } from "@/lib/utils";

type Field = "name" | "brand" | "email" | "message";

/**
 * Formulario sin servidor: valida y abre el correo del visitante con el
 * mensaje ya redactado, dirigido al correo comercial del canal.
 */
export function ContactForm({
  t,
  email,
  interests,
}: {
  t: Dictionary["contact"];
  email: string;
  interests: string[];
}) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = Object.fromEntries(
      ["name", "brand", "email", "interest", "message"].map((k) => [k, String(data.get(k) ?? "").trim()])
    ) as Record<Field | "interest", string>;

    const next: Partial<Record<Field, string>> = {};
    (["name", "brand", "email", "message"] as Field[]).forEach((k) => {
      if (!values[k]) next[k] = t.required;
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.invalidEmail;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    const body = [
      `${t.name}: ${values.name}`,
      `${t.brand}: ${values.brand}`,
      `${t.email}: ${values.email}`,
      `${t.interest}: ${values.interest}`,
      "",
      values.message,
    ].join("\n");

    window.location.href = buildMailto(email, fill(t.subject, { brand: values.brand }), body);
    setSent(true);
  }

  if (sent) {
    const [before, after = ""] = t.sentText.split("{email}");
    return (
      <div role="status" className="rounded-3xl border border-brand-400/30 bg-brand-400/[0.07] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-400" aria-hidden />
        <p className="mt-4 text-xl font-bold text-heading">{t.sentTitle}</p>
        <p className="mt-2 text-body">
          {before}
          <a href={`mailto:${email}`} className="font-semibold text-brand-300 underline-offset-4 hover:underline">
            {email}
          </a>
          {after}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-default bg-card p-6 sm:grid-cols-2 sm:p-8">
      <Input name="name" label={t.name} error={errors.name} autoComplete="name" />
      <Input name="brand" label={t.brand} error={errors.brand} autoComplete="organization" />
      <Input name="email" label={t.email} error={errors.email} type="email" autoComplete="email" className="sm:col-span-2" />
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-body-strong">{t.interest}</span>
        <select
          name="interest"
          defaultValue={interests[0]}
          className="h-12 w-full rounded-xl border border-input bg-ink-800 px-4 text-heading outline-none transition-colors focus:border-brand-400"
        >
          {interests.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-body-strong">{t.message}</span>
        <textarea
          name="message"
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full resize-y rounded-xl border bg-ink-800 px-4 py-3 text-heading outline-none transition-colors placeholder:text-subtle focus:border-brand-400",
            errors.message ? "border-rec-400" : "border-input"
          )}
        />
        {errors.message && (
          <span id="message-error" className="mt-1.5 block text-sm text-rec-300">
            {errors.message}
          </span>
        )}
      </label>
      <button
        type="submit"
        className="group/btn relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-400 px-8 font-bold text-ink-950 shadow-[0_8px_30px_-8px_rgb(255_194_26/0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-300 sm:col-span-2"
      >
        <Send className="h-5 w-5" aria-hidden />
        {t.send}
      </button>
    </form>
  );
}

function Input({
  name,
  label,
  error,
  type = "text",
  autoComplete,
  className,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-semibold text-body-strong">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "h-12 w-full rounded-xl border bg-ink-800 px-4 text-heading outline-none transition-colors focus:border-brand-400",
          error ? "border-rec-400" : "border-input"
        )}
      />
      {error && (
        <span id={`${name}-error`} className="mt-1.5 block text-sm text-rec-300">
          {error}
        </span>
      )}
    </label>
  );
}
