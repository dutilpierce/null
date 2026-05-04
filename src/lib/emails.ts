import { Resend } from "resend";
import { SERVER_ENV_ERROR_PREFIX, tryParseServerEnv } from "@/lib/env";
import { formatUsd } from "@/lib/format";

function requireServerEnvForEmail() {
  const result = tryParseServerEnv();
  if (!result.success) {
    throw new Error(`${SERVER_ENV_ERROR_PREFIX} ${result.message}`);
  }
  return result.data;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  productName: string;
  size: string;
  amountCents: number;
}) {
  const env = requireServerEnvForEmail();
  const resend = new Resend(env.RESEND_API_KEY);
  const subject = `ORDER CONFIRMED // ${params.productName.replace(/:/g, "—")}`;

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: params.to,
    subject,
    html: `
      <div style="background:#050505;color:#F5F5F5;padding:32px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.6;">
        <p style="color:#00FF9C;letter-spacing:0.12em;font-size:11px;margin:0 0 16px;">NULL//DIVISION</p>
        <h1 style="font-size:18px;font-weight:500;margin:0 0 12px;color:#F5F5F5;">ORDER CONFIRMED</h1>
        <p style="color:#9CA3AF;margin:0 0 20px;">Release authorized. Inventory locked.</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;color:#F5F5F5;">
          <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);color:#9CA3AF;">ITEM</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);text-align:right;">${escapeHtml(params.productName)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);color:#9CA3AF;">SIZE</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);text-align:right;">${escapeHtml(params.size)}</td></tr>
          <tr><td style="padding:8px 0;color:#9CA3AF;">TOTAL</td><td style="padding:8px 0;text-align:right;">${escapeHtml(formatUsd(params.amountCents))}</td></tr>
        </table>
        <p style="color:#9CA3AF;margin:0;">Replenishment disabled. This version will not repeat.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message ?? "Resend email failed");
  }
}

export async function sendWaitlistConfirmationEmail(params: { to: string }) {
  const env = requireServerEnvForEmail();
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: params.to,
    subject: "TRANSMISSION RECEIVED",
    html: `
      <div style="background:#050505;color:#F5F5F5;padding:32px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.6;">
        <p style="color:#00FF9C;letter-spacing:0.12em;font-size:11px;margin:0 0 16px;">NULL//DIVISION</p>
        <h1 style="font-size:18px;font-weight:500;margin:0 0 12px;color:#F5F5F5;">TRANSMISSION RECEIVED</h1>
        <p style="color:#9CA3AF;margin:0;">Signup recorded. Successor version pending. Human involvement restricted to fulfillment and system maintenance.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message ?? "Resend email failed");
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
