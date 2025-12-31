import { BotRestrictedApiError, isUnauthorized, UnauthorizedApiError } from "../utils/Api";

export function createFetchWithAuth(logout: () => void) {
    return async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
      const res = await fetch(input, {
        ...init,
        headers: init?.headers || {},
      });
  
      if (isUnauthorized(res.status)) {
        if (res.status === 401 && (await res.json())["help"] === "errorApiBotRestricted")
          throw new BotRestrictedApiError("errorApiBotRestricted");
        logout();
        throw new UnauthorizedApiError("errorApiUnauthorized");
      }
  
      return res;
    };
  }
  