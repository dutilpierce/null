import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getStripe } from "@/lib/stripe";
import { isServerEnvConfigurationError } from "@/lib/env";

export const dynamic = "force-dynamic";

function firstSessionId(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) return value[0];
  return undefined;
}

type SuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sp = searchParams === undefined ? {} : await Promise.resolve(searchParams);
  const sessionId = firstSessionId(sp.session_id);

  let summary: { amount: string; email?: string | null } | null = null;
  let stripeUnavailable = false;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.amount_total != null) {
        summary = {
          amount: formatUsd(session.amount_total),
          email: session.customer_details?.email ?? session.customer_email,
        };
      }
    } catch (e) {
      if (isServerEnvConfigurationError(e)) {
        stripeUnavailable = true;
      }
      summary = null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#00FF9C]">Payment captured</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">ORDER CONFIRMED</h1>
        <p className="text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
          You now own part of iteration ND_01. A confirmation email has been dispatched. This version will not be repeated.
        </p>
      </header>

      {stripeUnavailable ? (
        <p className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
          Receipt details are unavailable because Stripe environment variables are not configured on this deployment.
        </p>
      ) : null}

      {summary ? (
        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">
          <div className="flex justify-between gap-4">
            <span>Total</span>
            <span className="text-[#F5F5F5]">{summary.amount}</span>
          </div>
          {summary.email ? (
            <div className="mt-3 flex justify-between gap-4">
              <span>Receipt</span>
              <span className="text-right text-[#F5F5F5]">{summary.email}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/iterations"
          className="inline-flex flex-1 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#F5F5F5] px-4 py-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#050505] transition hover:bg-[#00FF9C]"
        >
          View iterations
        </Link>
        <Link
          href="/waitlist"
          className="inline-flex flex-1 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C]"
        >
          Join next transmission
        </Link>
      </div>
    </div>
  );
}
