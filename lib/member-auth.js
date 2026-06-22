import crypto from "crypto";

export const MEMBER_COOKIE_NAME = "member_auth";

function getSecret() {
  return (
    process.env.MEMBER_AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "change-this-member-secret"
  );
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  if (!storedPassword?.startsWith("scrypt:")) {
    return password === storedPassword;
  }

  const [, salt, storedHash] = storedPassword.split(":");
  const hash = crypto.scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (hash.length !== storedHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hash, storedHashBuffer);
}

export function createMemberToken(member) {
  const payload = base64Url(
    JSON.stringify({
      id: member.id,
      username: member.username,
    })
  );

  return `${payload}.${sign(payload)}`;
}

export function verifyMemberToken(token) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    const member = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!member.id || !member.username) {
      return null;
    }

    return member;
  } catch {
    return null;
  }
}

export function getMemberFromCookieStore(cookieStore) {
  return verifyMemberToken(cookieStore.get(MEMBER_COOKIE_NAME)?.value);
}

export function getSafeRedirect(value, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
