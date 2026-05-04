import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverSchema>;

/** Thrown message prefix — used to map configuration failures to safe API responses. */
export const SERVER_ENV_ERROR_PREFIX = "NULL_DIVISION_ENV_INVALID:";

export type ServerEnvParseFailure = {
  success: false;
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
};

export type ServerEnvParseSuccess = {
  success: true;
  data: ServerEnv;
};

export type ServerEnvParseResult = ServerEnvParseSuccess | ServerEnvParseFailure;

export function tryParseServerEnv(): ServerEnvParseResult {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      success: false,
      message: "Missing or invalid server environment variables.",
      fieldErrors: flat.fieldErrors,
    };
  }
  return { success: true, data: parsed.data };
}

export function getServerEnv(): ServerEnv {
  const result = tryParseServerEnv();
  if (!result.success) {
    throw new Error(
      `${SERVER_ENV_ERROR_PREFIX} ${result.message} ${JSON.stringify(result.fieldErrors ?? {})}`,
    );
  }
  return result.data;
}

export function isServerEnvConfigurationError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith(SERVER_ENV_ERROR_PREFIX);
}

/** Absolute site origin for Stripe redirects and metadata. Falls back safely for local dev. */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "http://localhost:3000";
    const path = u.pathname.replace(/\/$/, "");
    return `${u.origin}${path === "/" ? "" : path}`;
  } catch {
    return "http://localhost:3000";
  }
}

export function isValidCountdownTarget(iso: string | null | undefined): boolean {
  if (!iso || typeof iso !== "string") return false;
  const t = Date.parse(iso);
  return Number.isFinite(t);
}
