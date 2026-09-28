import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Search,
} from "lucide-react"
import type {
  BrandSystem,
  PreviewMode,
} from "../types"

export function Preview({
  system,
  mode,
}: {
  system: BrandSystem
  mode: PreviewMode
}) {
  if (mode === "product") {
    return <ProductPreview system={system} />
  }

  if (mode === "dashboard") {
    return <DashboardPreview system={system} />
  }

  if (mode === "mobile") {
    return <MobilePreview system={system} />
  }

  return <LandingPreview system={system} />
}

function Wordmark({
  system,
}: {
  system: BrandSystem
}) {
  const transform =
    system.wordmark.case === "uppercase"
      ? system.name.toUpperCase()
      : system.wordmark.case === "lowercase"
        ? system.name.toLowerCase()
        : system.name

  return (
    <div
      style={{
        fontFamily: "var(--brand-heading)",
        letterSpacing:
          `${system.wordmark.tracking}em`,
        fontWeight: system.wordmark.weight,
      }}
    >
      {transform}
    </div>
  )
}

function LandingPreview({
  system,
}: {
  system: BrandSystem
}) {
  return (
    <div className="brand-surface min-h-full">
      <header className="flex items-center justify-between border-b border-[var(--brand-border)] px-6 py-5 md:px-10">
        <Wordmark system={system} />

        <nav className="hidden items-center gap-6 text-xs md:flex">
          <span>Product</span>
          <span>Company</span>
          <span>Resources</span>
        </nav>

        <button className="brand-primary-button">
          Get started
          <ArrowUpRight size={14} />
        </button>
      </header>

      <section className="grid min-h-[500px] items-center gap-10 px-6 py-14 md:grid-cols-[1.08fr_0.92fr] md:px-10 md:py-24">
        <div>
          <div className="brand-eyebrow">
            BUILT FOR MODERN WORK
          </div>

          <h1
            className="mt-5 max-w-4xl"
            style={{
              fontFamily:
                "var(--brand-heading)",
              fontSize:
                `clamp(3.4rem,8vw,${system.typography.scale.display.size}px)`,
              lineHeight:
                system.typography.scale.display.lineHeight,
              letterSpacing:
                `${system.typography.scale.display.tracking}em`,
              fontWeight:
                system.typography.scale.display.weight,
            }}
          >
            Build the business.
            <br />
            Lose the busywork.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[var(--brand-muted)]">
            One workspace designed around clarity,
            momentum and the work that actually
            matters.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="brand-primary-button brand-large-button">
              Start building
              <ChevronRight size={15} />
            </button>

            <button className="brand-secondary-button brand-large-button">
              See how it works
            </button>
          </div>
        </div>

        <div className="brand-feature-panel">
          <div className="flex items-center justify-between">
            <div className="brand-eyebrow">
              THIS WEEK
            </div>

            <div className="brand-status">
              <Check size={11} />
              ON TRACK
            </div>
          </div>

          <div
            className="mt-16"
            style={{
              fontFamily:
                "var(--brand-heading)",
              fontSize: "2.6rem",
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            72%
          </div>

          <div className="mt-3 text-sm text-[var(--brand-muted)]">
            toward September target
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--brand-secondary)]">
            <div className="h-full w-[72%] rounded-full bg-[var(--brand-primary)]" />
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3 border-t border-[var(--brand-border)] pt-5 text-xs">
            <Metric
              label="ACTIVE"
              value="1,284"
            />
            <Metric
              label="GROWTH"
              value="+18%"
            />
            <Metric
              label="RETAIN"
              value="94%"
            />
          </div>
        </div>
      </section>

      <section className="grid border-t border-[var(--brand-border)] md:grid-cols-3">
        {[
          [
            "01",
            "Stay focused",
            "One clear system for the work ahead.",
          ],
          [
            "02",
            "Move faster",
            "Less friction from idea to outcome.",
          ],
          [
            "03",
            "Stay in control",
            "Every important decision stays visible.",
          ],
        ].map(([number, title, body]) => (
          <div
            key={number}
            className="border-b border-[var(--brand-border)] p-6 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="brand-eyebrow">
              {number}
            </div>

            <div
              className="mt-8 text-xl font-semibold"
              style={{
                fontFamily:
                  "var(--brand-heading)",
              }}
            >
              {title}
            </div>

            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              {body}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}

function ProductPreview({
  system,
}: {
  system: BrandSystem
}) {
  return (
    <div className="brand-surface flex min-h-[640px]">
      <aside className="hidden w-52 shrink-0 border-r border-[var(--brand-border)] p-5 md:block">
        <Wordmark system={system} />

        <div className="mt-10 space-y-1 text-sm">
          {[
            "Overview",
            "Projects",
            "Payments",
            "Customers",
          ].map((item, index) => (
            <div
              key={item}
              className={
                index === 0
                  ? "rounded-[var(--radius-md)] bg-[var(--brand-secondary)] px-3 py-2.5 font-medium"
                  : "px-3 py-2.5 text-[var(--brand-muted)]"
              }
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[var(--brand-border)] px-5">
          <div className="text-sm font-semibold">
            Overview
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-[var(--radius-md)] border border-[var(--brand-border)] px-3 py-2 text-xs text-[var(--brand-muted)] sm:flex">
              <Search size={13} />
              Search
            </div>

            <button className="brand-primary-button">
              New project
            </button>
          </div>
        </header>

        <div className="p-5 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <ProductStat
              label="REVENUE"
              value="$48,240"
              detail="+12.4%"
            />

            <ProductStat
              label="CUSTOMERS"
              value="1,284"
              detail="+6.2%"
            />

            <ProductStat
              label="PAYOUT"
              value="$31,810"
              detail="Friday"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="brand-card">
              <div className="flex items-center justify-between">
                <strong>Recent activity</strong>

                <span className="text-xs text-[var(--brand-muted)]">
                  View all
                </span>
              </div>

              <div className="mt-5 divide-y divide-[var(--brand-border)]">
                {[
                  "Website redesign",
                  "Invoice #1028",
                  "Customer onboarding",
                  "Brand refresh",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between py-4 text-sm"
                  >
                    <div>
                      <div>{item}</div>

                      <div className="mt-1 text-xs text-[var(--brand-muted)]">
                        Updated {index + 1}h ago
                      </div>
                    </div>

                    <span className="brand-status">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-card">
              <div className="brand-eyebrow">
                QUICK ACTION
              </div>

              <h3
                className="mt-6 text-2xl font-semibold"
                style={{
                  fontFamily:
                    "var(--brand-heading)",
                }}
              >
                Send a payment request.
              </h3>

              <label className="mt-8 block text-xs">
                Customer
              </label>

              <input
                className="brand-input mt-2"
                value="Ama Mensah"
                readOnly
              />

              <label className="mt-5 block text-xs">
                Amount
              </label>

              <input
                className="brand-input mt-2"
                value="$2,400"
                readOnly
              />

              <button className="brand-primary-button brand-large-button mt-5 w-full justify-center">
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function DashboardPreview({
  system,
}: {
  system: BrandSystem
}) {
  const heights = [
    34,
    48,
    42,
    66,
    52,
    77,
    68,
    88,
    72,
    92,
  ]

  return (
    <div className="brand-surface min-h-[650px] p-5 md:p-8">
      <div className="flex items-end justify-between">
        <div>
          <Wordmark system={system} />

          <h2
            className="mt-6 text-3xl font-semibold"
            style={{
              fontFamily:
                "var(--brand-heading)",
            }}
          >
            Business overview
          </h2>

          <div className="mt-1 text-sm text-[var(--brand-muted)]">
            September 2026
          </div>
        </div>

        <button className="brand-secondary-button hidden sm:flex">
          Export
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["REVENUE", "$84.2K"],
          ["MRR", "$21.4K"],
          ["ACTIVE", "3,829"],
          ["CHURN", "2.4%"],
        ].map(([label, value]) => (
          <ProductStat
            key={label}
            label={label}
            value={value}
            detail="+8.4%"
          />
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="brand-card">
          <div className="flex justify-between">
            <strong>Revenue</strong>
            <span className="text-xs text-[var(--brand-muted)]">
              Last 10 weeks
            </span>
          </div>

          <div className="mt-10 flex h-52 items-end gap-2">
            {heights.map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-[calc(var(--radius-sm)/2)] bg-[var(--brand-primary)] opacity-90"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="brand-card">
          <strong>Top categories</strong>

          <div className="mt-6 space-y-5">
            {[
              ["Subscriptions", 78],
              ["Services", 61],
              ["Digital goods", 46],
              ["Other", 28],
            ].map(([label, width]) => (
              <div key={label}>
                <div className="flex justify-between text-xs">
                  <span>{label}</span>
                  <span>{width}%</span>
                </div>

                <div className="mt-2 h-1.5 rounded-full bg-[var(--brand-secondary)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="brand-card mt-5 overflow-hidden">
        <div className="mb-5 flex items-center justify-between">
          <strong>Transactions</strong>

          <div className="brand-eyebrow">
            128 RESULTS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="text-[var(--brand-muted)]">
              <tr>
                <th className="py-3">Customer</th>
                <th>Status</th>
                <th>Method</th>
                <th>Date</th>
                <th className="text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                "Amina Okafor",
                "Tobi Ade",
                "Fola James",
                "Zainab Bello",
                "Chidi Eze",
              ].map((name, index) => (
                <tr
                  key={name}
                  className="border-t border-[var(--brand-border)]"
                >
                  <td className="py-4 font-medium">
                    {name}
                  </td>
                  <td>
                    <span className="brand-status">
                      PAID
                    </span>
                  </td>
                  <td className="text-[var(--brand-muted)]">
                    Transfer
                  </td>
                  <td className="text-[var(--brand-muted)]">
                    Sep {18 - index}
                  </td>
                  <td className="text-right">
                    ${(index + 2) * 480}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MobilePreview({
  system,
}: {
  system: BrandSystem
}) {
  return (
    <div className="flex min-h-[650px] items-center justify-center bg-black/[0.025] p-4">
      <div className="brand-surface relative h-[690px] w-full max-w-[360px] overflow-hidden border-[8px] border-[#1a1a18] shadow-2xl">
        <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-[var(--brand-foreground)] opacity-15" />

        <header className="flex items-center justify-between px-5 py-5">
          <Wordmark system={system} />

          <div className="h-8 w-8 rounded-full bg-[var(--brand-secondary)]" />
        </header>

        <div className="px-5 pt-5">
          <div className="brand-eyebrow">
            GOOD MORNING
          </div>

          <h2
            className="mt-3 text-4xl font-semibold leading-[0.96]"
            style={{
              fontFamily:
                "var(--brand-heading)",
            }}
          >
            Your money,
            <br />
            made clearer.
          </h2>

          <p className="mt-4 text-sm leading-6 text-[var(--brand-muted)]">
            Everything important, without the noise.
          </p>

          <button className="brand-primary-button brand-large-button mt-6 w-full justify-center">
            Add money
          </button>

          <div className="brand-card mt-5">
            <div className="brand-eyebrow">
              AVAILABLE
            </div>

            <div
              className="mt-4 text-4xl font-semibold"
              style={{
                fontFamily:
                  "var(--brand-heading)",
              }}
            >
              $12,840
            </div>

            <div className="mt-6 flex justify-between text-xs text-[var(--brand-muted)]">
              <span>USD account</span>
              <span>•• 8204</span>
            </div>
          </div>

          <div className="mt-7 text-xs font-semibold">
            Recent
          </div>

          <div className="mt-3 space-y-1">
            {[
              ["Adobe", "-$24.00"],
              ["Transfer received", "+$820"],
              ["Notion", "-$10.00"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-[var(--brand-border)] py-3 text-sm"
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <div className="brand-eyebrow">
        {label}
      </div>

      <div className="mt-2 font-semibold">
        {value}
      </div>
    </div>
  )
}

function ProductStat({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="brand-card">
      <div className="brand-eyebrow">
        {label}
      </div>

      <div
        className="mt-5 text-2xl font-semibold"
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