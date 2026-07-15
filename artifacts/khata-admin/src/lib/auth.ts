import { setAuthTokenGetter } from "@workspace/api-client-react";

const TOKEN_KEY = "khatapro_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Wire up the generated client to use this token
setAuthTokenGetter(getToken);
