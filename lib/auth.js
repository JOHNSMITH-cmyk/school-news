export const AUTH_COOKIE_NAME = "admin_auth";
export const AUTH_COOKIE_VALUE = "logged-in";

export function isValidAdminLogin(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  return username === adminUsername && password === adminPassword;
}
