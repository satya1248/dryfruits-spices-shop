import twilio from "twilio";

function formatPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.startsWith("+")) return phone;
  return `+${digits}`;
}

function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
}

export async function sendSms(params: {
  to: string;
  body: string;
}): Promise<boolean> {
  const to = formatPhoneE164(params.to);

  if (!isSmsConfigured()) {
    console.info("[sms:mock]", to, params.body);
    return false;
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  );

  await client.messages.create({
    body: params.body,
    from: process.env.TWILIO_FROM_NUMBER!,
    to,
  });

  return true;
}
