type OtpRecord = {
  code: string;
  expiresAt: number;
};

const STORE_SYMBOL = Symbol.for('probo.qa.mailpit.otpStore');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny = globalThis as any;

if (!globalAny[STORE_SYMBOL]) {
  globalAny[STORE_SYMBOL] = new Map<string, OtpRecord>();
}

const store: Map<string, OtpRecord> = globalAny[STORE_SYMBOL];

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export function saveOtp(email: string, code: string, ttlMs: number) {
  if (!email) return;
  store.set(normalize(email), {
    code,
    expiresAt: Date.now() + ttlMs,
  });
}

export function getOtp(email: string) {
  if (!email) return null;
  const key = normalize(email);
  const record = store.get(key);

  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return null;
  }

  return record;
}

export function consumeOtp(email: string, code: string) {
  if (!email) return 'missing';

  const key = normalize(email);
  const record = store.get(key);

  if (!record) return 'missing';

  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return 'expired';
  }

  if (record.code !== code.trim()) {
    return 'invalid';
  }

  store.delete(key);
  return 'ok';
}

