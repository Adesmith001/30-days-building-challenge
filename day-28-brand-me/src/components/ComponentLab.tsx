import {
  AlertCircle,
  Check,
  LoaderCircle,
} from "lucide-react"
import type {
  BrandSystem,
} from "../types"

export function ComponentLab({
  system,
}: {
  system: BrandSystem
}) {
  return (
    <div className="brand-surface min-h-full p-5 md:p-8">
      <div className="brand-eyebrow">
        COMPONENT LAB
      </div>

      <h2
        className="mt-3 text-5xl font-semibold tracking-[-0.05em]"
        style={{
          fontFamily:
            "var(--brand-heading)",
        }}
      >
        Components.
        <br />
        Every state.
      </h2>

      <Section title="BUTTONS">
        <div className="flex flex-wrap gap-3">
          <button className="brand-primary-button brand-large-button">
            Primary
          </button>

          <button className="brand-secondary-button brand-large-button">
            Secondary
          </button>

          <button className="brand-outline-button">
            Outline
          </button>

          <button className="brand-ghost-button">
            Ghost
          </button>

          <button className="brand-danger-button">
            Destructive
          </button>

          <button
            disabled
            className="brand-primary-button opacity-35"
          >
            Disabled
          </button>

          <button className="brand-primary-button">
            <LoaderCircle
              size={14}
              className="animate-spin"
            />
            Loading
          </button>
        </div>
      </Section>

      <Section title="INPUTS">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="DEFAULT"
            value="hello@example.com"
          />

          <Field
            label="FOCUS"
            value="Focused field"
            focused
          />

          <Field
            label="ERROR"
            value="Invalid value"
            error
          />

          <Field
            label="DISABLED"
            value="Unavailable"
            disabled
          />
        </div>
      </Section>

      <Section title="BADGES + STATUS">
        <div className="flex flex-wrap gap-2">
          <Badge>ACTIVE</Badge>
          <Badge>NEW</Badge>
          <Badge>PROCESSING</Badge>

          <span className="brand-success-badge">
            <Check size={11} />
            COMPLETE
          </span>

          <span className="brand-danger-badge">
            <AlertCircle size={11} />
            FAILED
          </span>
        </div>
      </Section>

      <Section title="CARDS">
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Daily revenue"
            value="$8,420"
            detail="+14.8% this week"
          />

          <Card
            title="Customers"
            value="1,284"
            detail="82 active today"
          />

          <Card
            title="Conversion"
            value="6.82%"
            detail="+0.9 pts"
          />
        </div>
      </Section>

      <Section title="ALERTS">
        <div className="space-y-3">
          <div className="brand-alert">
            Your workspace has been updated.
          </div>

          <div className="brand-danger-alert">
            <AlertCircle size={16} />
            Payment could not be processed.
          </div>
        </div>
      </Section>

      <Section title="TOKENS IN USE">
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <Token
            label="RADIUS MD"
            value={`${system.radii.md}px`}
          />

          <Token
            label="MOTION NORMAL"
            value={`${system.motion.normal}ms`}
          />

          <Token
            label="HEADING"
            value={
              system.typography.heading.family
            }
          />
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12 border-t border-[var(--brand-border)] pt-6">
      <div className="brand-eyebrow">
        {title}
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  focused,
  error,
  disabled,
}: {
  label: string
  value: string
  focused?: boolean
  error?: boolean
  disabled?: boolean
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-medium">
        {label}
      </div>

      <input
        value={value}
        readOnly
        disabled={disabled}
        className="brand-input"
        style={{
          borderColor: error
            ? "var(--brand-danger)"
            : focused
              ? "var(--brand-focus)"
              : undefined,
          boxShadow: focused
            ? "0 0 0 3px color-mix(in srgb, var(--brand-focus) 20%, transparent)"
            : undefined,
        }}
      />

      {error && (
        <div className="mt-2 text-xs text-[var(--brand-danger)]">
          This value needs attention.
        </div>
      )}
    </label>
  )
}

function Badge({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="brand-status">
      {children}
    </span>
  )
}

function Card({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="brand-card">
      <div className="text-sm">
        {title}
      </div>

      <div
        className="mt-8 text-3xl font-semibold"
        style={{
          fontFamily:
            "var(--brand-heading)",
        }}
      >
        {value}
      </div>

      <div className="mt-2 text-xs text-[var(--brand-muted)]">
        {detail}
      </div>
    </div>
  )
}

function Token({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border border-[var(--brand-border)] p-4">
      <div className="brand-eyebrow">
        {label}
      </div>

      <div className="mt-3 font-mono text-xs">
        {value}
      </div>
    </div>
  )
}