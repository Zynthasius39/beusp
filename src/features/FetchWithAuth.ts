import { UnauthorizedApiError } from "../utils/Api";

export function createFetchWithAuth(logout: () => void) {
    return async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
      const res = await fetch(input, {
        ...init,
        headers: init?.headers || {},
      });
  
      if ([400, 401].includes(res.status)) {
        logout();
        throw new UnauthorizedApiError("Session expired!");
      }
  
      return res;
    };
  }
  