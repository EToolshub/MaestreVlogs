"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { intlLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { WhatsappIcon } from "@/components/icons/SocialIcons";
import { buildWhatsAppLink, cn, fill } from "@/lib/utils";

type Method = "paypal" | "binance";

export function SupportForm({
  lang,
  t,
  creatorName,
  paypalMe,
  binanceUid,
  amounts,
  whatsapp,
}: {
  lang: Locale;
  t: Dictionary["support"];
  creatorName: string;
  paypalMe: string;
  binanceUid: string;
  amounts: number[];
  whatsapp: string;
}) {
  const [preset, setPreset] = useState<number | "custom">(amounts[1] ?? amounts[0]);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method>("paypal");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const amount = preset === "custom" ? Math.round(Number(custom.replace(",", ".")) * 100) / 100 : preset;
  const valid = Number.isFinite(amount) && amount >= 1 && amount <= 10_000;
  const money = (n: number) =>
    new Intl.NumberFormat(intlLocale[lang], {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
    }).format(n);
  const amountText = valid ? money(amount) : "—";
  const methodName = method === "paypal" ? "PayPal" : "Binance Pay";

  const whatsappText = [
    fill(t.whatsappGreeting, { name: creatorName, amount: method === "binance" ? `${amountText} (USDT)` : amountText, method: methodName }),
    name.trim() ? fill(t.whatsappFrom, { name: name.trim() }) : "",
    message.trim() ? fill(t.whatsappMessage, { message: message.trim() }) : "",
    "",
    t.whatsappFooter,
  ]
    .filter((line, i) => line !== "" || i === 3)
    .join("\n");

  async function copyUid() {
    try {
      await navigator.clipboard.writeText(binanceUid);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin portapapeles: el UID sigue visible para copiarlo a mano.
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8">
      {/* Monto */}
      <p className="text-sm font-semibold text-body-strong">{t.amountLabel}</p>
      <div role="radiogroup" aria-label={t.amountLabel} className="mt-3 flex flex-wrap gap-2">
        {amounts.map((a) => (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={preset === a}
            onClick={() => setPreset(a)}
            className={cn(
              "h-11 min-w-16 rounded-full border px-4 font-bold transition-colors",
              preset === a ? "border-brand-400 bg-brand-400 text-ink-950" : "border-ink-600 text-body-strong hover:border-brand-400/60"
            )}
          >
            {money(a)}
          </button>
        ))}
        <label
          className={cn(
            "flex h-11 items-center gap-1.5 rounded-full border px-4 transition-colors",
            preset === "custom" ? "border-brand-400 bg-brand-400/10" : "border-ink-600"
          )}
        >
          <span className="text-sm font-semibold text-body">{t.custom}</span>
          <span className="text-body">$</span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step="1"
            value={custom}
            placeholder={t.customPlaceholder}
            onFocus={() => setPreset("custom")}
            onChange={(e) => {
              setPreset("custom");
              setCustom(e.target.value);
            }}
            className="w-20 bg-transparent font-bold text-heading outline-none placeholder:font-normal placeholder:text-subtle"
          />
        </label>
      </div>

      {/* Forma de pago */}
      <p className="mt-7 text-sm font-semibold text-body-strong">{t.methodLabel}</p>
      <div role="radiogroup" aria-label={t.methodLabel} className="mt-3 grid grid-cols-2 gap-2">
        {(
          [
            { id: "paypal", name: "PayPal", color: "bg-[#0070e0]" },
            { id: "binance", name: "Binance Pay", color: "bg-[#f0b90b]" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={method === m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-2xl border font-bold transition-colors",
              method === m.id ? "border-brand-400 bg-brand-400/10 text-heading" : "border-ink-600 text-body hover:border-ink-500"
            )}
          >
            <span className={cn("h-3 w-3 rounded-full", m.color)} aria-hidden />
            {m.name}
          </button>
        ))}
      </div>

      {/* Nombre y mensaje */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-body-strong">{t.nameLabel}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            autoComplete="name"
            className="h-12 w-full rounded-xl border border-input bg-ink-800 px-4 text-heading outline-none focus:border-brand-400"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold text-body-strong">{t.messageLabel}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={t.messagePlaceholder}
            className="w-full resize-y rounded-xl border border-input bg-ink-800 px-4 py-3 text-heading outline-none placeholder:text-subtle focus:border-brand-400"
          />
        </label>
      </div>

      {/* Paso 1 */}
      <div className="mt-8 border-t border-white/[0.08] pt-6">
        <p className="flex items-center gap-2 font-bold text-heading">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-400 text-xs text-ink-950">1</span>
          {t.step1}
        </p>
        {method === "paypal" ? (
          <div className="mt-4">
            <a
              href={valid ? `${paypalMe}/${Number.isInteger(amount) ? amount : amount.toFixed(2)}USD` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!valid}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0070e0] px-6 font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto",
                !valid && "pointer-events-none opacity-45"
              )}
            >
              {fill(t.payPaypal, { amount: amountText })}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <p className="mt-2 text-xs text-muted">{t.paypalHint}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <ol className="space-y-1.5 text-sm text-body">
              {t.binanceSteps.map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="font-mono text-xs text-brand-300">{i + 1}.</span>
                  {fill(step, { amount: amountText })}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f0b90b]/40 bg-[#f0b90b]/[0.07] px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">{t.uidLabel}</p>
                <p className="font-mono text-2xl font-bold tracking-wider text-heading">{binanceUid}</p>
              </div>
              <button
                type="button"
                onClick={copyUid}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f0b90b] px-4 py-2 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Paso 2 */}
      <div className="mt-7">
        <p className="flex items-center gap-2 font-bold text-heading">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-400 text-xs text-ink-950">2</span>
          {t.step2}
        </p>
        <a
          href={valid ? buildWhatsAppLink(whatsapp, whatsappText) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!valid}
          className={cn(
            "mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-bold text-ink-950 transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto",
            !valid && "pointer-events-none opacity-45"
          )}
        >
          <WhatsappIcon className="h-5 w-5" />
          {t.notify}
        </a>
        <p className="mt-2 text-xs text-muted">{t.notifyHint}</p>
      </div>
    </div>
  );
}
