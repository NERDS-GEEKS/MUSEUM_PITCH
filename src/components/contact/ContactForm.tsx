import { Button } from "@/components/ui/Button";
import { INDUSTRIES } from "@/constants/industries";
import { submitLead, type LeadPayload } from "@/utils/submitLead";
import { validateContact } from "@/utils/validateContact";
import { cn } from "@/utils/cn";
import { useState, type FormEvent } from "react";

const EMPTY_FORM: LeadPayload = {
  name: "",
  email: "",
  organization: "",
  industry: "",
  message: "",
};

const fieldClass =
  "w-full rounded-xl border border-nm-border bg-nm-bg/60 px-4 py-3 text-base text-nm-text placeholder:text-nm-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<LeadPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadPayload, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [banner, setBanner] = useState<string | null>(null);

  const updateField = <K extends keyof LeadPayload>(
    key: K,
    value: LeadPayload[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setBanner(null);

    const result = validateContact(form);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await submitLead({
        ...form,
        industry: form.industry?.trim() ? form.industry : undefined,
      });
      if (response.ok) {
        setStatus("success");
        setBanner("Thanks. We'll be in touch shortly.");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setBanner(response.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setBanner("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const gap = compact
    ? "gap-1.5 sm:gap-3 [@media(max-height:720px)]:gap-1"
    : "gap-5";
  const stack = compact
    ? "space-y-1.5 sm:space-y-3 [@media(max-height:720px)]:space-y-1"
    : "space-y-5";
  const labelStack = compact
    ? "space-y-0.5 sm:space-y-1.5 [@media(max-height:720px)]:space-y-0.5"
    : "space-y-2";
  const inputClass = cn(
    fieldClass,
    compact &&
      "px-2 py-1.5 text-xs sm:px-3 sm:py-2.5 sm:text-sm [@media(max-height:720px)]:px-2 [@media(max-height:720px)]:py-1 [@media(max-height:720px)]:text-[11px]",
  );
  const labelClass = cn(
    "font-medium text-nm-text",
    compact
      ? "text-xs sm:text-sm [@media(max-height:720px)]:text-[10px]"
      : "text-sm",
  );

  return (
    <form className={stack} onSubmit={onSubmit} noValidate>
      {banner ? (
        <div
          role={status === "error" ? "alert" : "status"}
          className={cn(
            "rounded-xl border px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm [@media(max-height:720px)]:px-2 [@media(max-height:720px)]:py-1.5 [@media(max-height:720px)]:text-[10px]",
            status === "success" &&
              "border-nm-primary/40 bg-nm-primary/10 text-nm-text",
            status === "error" &&
              "border-red-400/40 bg-red-500/10 text-red-100",
          )}
        >
          {banner}
        </div>
      ) : null}

      <div className={cn("grid md:grid-cols-2", gap)}>
        <label className={cn("block", labelStack)}>
          <span className={labelClass}>Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            value={form.name}
            disabled={submitting}
            onChange={(event) => updateField("name", event.target.value)}
          />
          {errors.name ? (
            <span className="block text-xs text-red-300 sm:text-sm">{errors.name}</span>
          ) : null}
        </label>

        <label className={cn("block", labelStack)}>
          <span className={labelClass}>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={form.email}
            disabled={submitting}
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email ? (
            <span className="block text-xs text-red-300 sm:text-sm">{errors.email}</span>
          ) : null}
        </label>
      </div>

      <div className={cn("grid md:grid-cols-2", gap)}>
        <label className={cn("block", labelStack)}>
          <span className={labelClass}>Organization</span>
          <input
            name="organization"
            type="text"
            autoComplete="organization"
            className={inputClass}
            value={form.organization}
            disabled={submitting}
            onChange={(event) =>
              updateField("organization", event.target.value)
            }
          />
          {errors.organization ? (
            <span className="block text-xs text-red-300 sm:text-sm">
              {errors.organization}
            </span>
          ) : null}
        </label>

        <label className={cn("block", labelStack)}>
          <span className={labelClass}>
            Museum type{" "}
            <span className="font-normal text-nm-muted">(optional)</span>
          </span>
          <select
            name="industry"
            className={inputClass}
            value={form.industry ?? ""}
            disabled={submitting}
            onChange={(event) => updateField("industry", event.target.value)}
          >
            <option value="">Select a museum type</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry.id} value={industry.label}>
                {industry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={cn("block", labelStack)}>
        <span className={labelClass}>Message</span>
        <textarea
          name="message"
          rows={compact ? 2 : 5}
          className={cn(
            inputClass,
            "resize-y",
            compact
              ? "min-h-14 sm:min-h-20 [@media(max-height:720px)]:min-h-12"
              : "min-h-32",
          )}
          value={form.message}
          disabled={submitting}
          onChange={(event) => updateField("message", event.target.value)}
        />
        {errors.message ? (
          <span className="block text-xs text-red-300 sm:text-sm">{errors.message}</span>
        ) : null}
      </label>

      <Button
        type="submit"
        variant="primary"
        size={compact ? "md" : "lg"}
        disabled={submitting}
        className={
          compact
            ? "h-9 px-4 text-xs sm:h-11 sm:px-5 sm:text-sm [@media(max-height:720px)]:h-8 [@media(max-height:720px)]:px-3 [@media(max-height:720px)]:text-[11px]"
            : undefined
        }
      >
        {submitting ? "Sending…" : "Schedule a Demo"}
      </Button>
    </form>
  );
}
