"use client";

import { useId, useState } from "react";
import { CheckCircle2, Loader2, Mail, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const EVENT_TYPES = [
  "Rehearsal dinner",
  "Corporate event or team dinner",
  "Full venue buyout",
  "Private party room",
  "Birthday or celebration",
  "Holiday party",
  "Something else",
] as const;

type Fields = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  message: string;
};

const EMPTY: Fields = { name: "", email: "", phone: "", eventType: "", date: "", guests: "", message: "" };

export function validate(f: Fields, today = new Date().toISOString().slice(0, 10)): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Add the name we should ask for.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Add an email we can reply to.";
  if (f.phone && f.phone.replace(/\D/g, "").length < 10) e.phone = "Use a 10-digit phone number, or leave it blank.";
  if (!f.eventType) e.eventType = "Pick the kind of event.";
  if (!f.date) e.date = "Pick a date, even a rough one.";
  else if (f.date < today) e.date = "That date has passed. Pick an upcoming one.";
  const g = Number(f.guests);
  if (!f.guests || !Number.isInteger(g) || g < 1) e.guests = "Roughly how many guests?";
  else if (g > 500) e.guests = "For more than 500 guests, call us directly.";
  return e;
}

function mailtoFor(f: Fields) {
  const body = [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    f.phone ? `Phone: ${f.phone}` : null,
    `Event: ${f.eventType}`,
    `Date: ${f.date}`,
    `Guests: ${f.guests}`,
    "",
    f.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(`Private event inquiry: ${f.eventType}, ${f.date}`)}&body=${encodeURIComponent(body)}`;
}

export function EventInquiryForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [k]: ev.target.value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    // Demo mode: no network request. The live build would POST here.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
  };

  const field = (k: keyof Fields) => ({
    id: `${id}-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-sm text-destructive">
        {errors[k]}
      </p>
    ) : null;

  const inputCls = "h-12 rounded-md bg-st-black/60 px-4 text-base md:text-base";

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-st-gold/40 bg-st-char p-6 sm:p-10" role="status" aria-live="polite">
        <CheckCircle2 className="size-10 text-st-gold" aria-hidden />
        <h3 className="h-display mt-5 text-3xl text-st-cream">Inquiry ready, {fields.name.split(" ")[0]}.</h3>
        <p className="mt-3 text-st-cream/80">
          {fields.eventType} for {fields.guests} guests on {fields.date}.
        </p>
        <p className="mt-6 rounded-md border border-dashed border-st-gold/50 bg-st-gold/5 px-4 py-3 text-sm text-st-mute">
          <strong className="text-st-gold-light">Demo mode:</strong> nothing was sent. In the live build this inquiry goes straight to
          the Sterling events inbox with an instant confirmation to the guest.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={mailtoFor(fields)} className="inline-flex h-11 items-center gap-2 rounded-full bg-st-gold px-6 font-display text-sm tracking-[0.18em] text-st-black uppercase hover:bg-st-gold-light">
            <Mail className="size-4" aria-hidden /> Send it by email
          </a>
          <button
            type="button"
            onClick={() => {
              setFields(EMPTY);
              setStatus("idle");
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-st-cream/30 px-6 font-display text-sm tracking-[0.18em] text-st-cream uppercase hover:border-st-gold"
          >
            <RotateCcw className="size-4" aria-hidden /> Start another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-st-cream/10 bg-st-char p-6 sm:p-10" aria-describedby={`${id}-demo`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-name`} className="text-st-cream">Your name</Label>
          <Input {...field("name")} autoComplete="name" className={cn(inputCls, "mt-2")} />
          {err("name")}
        </div>
        <div>
          <Label htmlFor={`${id}-email`} className="text-st-cream">Email</Label>
          <Input {...field("email")} type="email" autoComplete="email" inputMode="email" className={cn(inputCls, "mt-2")} />
          {err("email")}
        </div>
        <div>
          <Label htmlFor={`${id}-phone`} className="text-st-cream">
            Phone <span className="font-normal text-st-mute">(optional)</span>
          </Label>
          <Input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" className={cn(inputCls, "mt-2")} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-eventType`} className="text-st-cream">What are you planning?</Label>
          <select
            {...field("eventType")}
            className={cn(
              inputCls,
              "mt-2 w-full appearance-none rounded-md border border-input bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23c9ac85' stroke-width='1.5'><path d='M1 1l5 5 5-5'/></svg>\")] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10 text-st-cream outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
            )}
          >
            <option value="">Choose one</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {err("eventType")}
        </div>
        <div>
          <Label htmlFor={`${id}-date`} className="text-st-cream">Date</Label>
          <Input {...field("date")} type="date" className={cn(inputCls, "mt-2 [color-scheme:dark]")} />
          {err("date")}
        </div>
        <div>
          <Label htmlFor={`${id}-guests`} className="text-st-cream">Guests</Label>
          <Input {...field("guests")} type="number" min={1} max={500} inputMode="numeric" className={cn(inputCls, "mt-2")} />
          {err("guests")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-message`} className="text-st-cream">
            Anything we should know? <span className="font-normal text-st-mute">(optional)</span>
          </Label>
          <Textarea
            {...field("message")}
            rows={4}
            placeholder="Time of night, budget, live music requests, dietary needs"
            className="mt-2 min-h-28 rounded-md bg-st-black/60 px-4 py-3 text-base md:text-base"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-demo`} className="text-xs text-st-mute">
          Demo mode: this form validates and confirms, but sends nothing.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-st-gold px-8 font-display text-sm tracking-[0.18em] text-st-black uppercase transition-colors hover:bg-st-gold-light disabled:opacity-70"
        >
          {status === "sending" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Sending</> : "Send inquiry"}
        </button>
      </div>
    </form>
  );
}
