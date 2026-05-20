import Razorpay from "razorpay";

function getEnv() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env.local",
    );
  }

  return { keyId, keySecret };
}

export function getRazorpayClient() {
  const { keyId, keySecret } = getEnv();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function getRazorpayKeyId() {
  return getEnv().keyId;
}
