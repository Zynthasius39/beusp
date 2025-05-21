export const url = `http://localhost:8080/api`;

export async function auth(student_id: string, password: string) {
  const response = await fetch(url + "/auth?" + new URLSearchParams({
    studentId: student_id,
    password: password,
  }).toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (isUnauthorized(response.status)) {
    throw new UnauthorizedApiError(String(response.status));
  }
}

export async function unauth() {
  const response = await fetch(url + "/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (isUnauthorized(response.status)) {
    throw new UnauthorizedApiError(String(response.status));
  }
}

export async function verify() {
  const response = await fetch(url + "/verify", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (isUnauthorized(response.status)) {
    return false;
  }
  return true;
}

export async function fetchCached(url: string, init = {}, refreshCache = true) {
  const request = new Request(url, init);
  return caches.match(request).then((response) => {
    if (response !== undefined && response.status === 200 && refreshCache) {
      return response;
    } else {
      return fetch(request)
        .then((response) => {
          let responseClone = response.clone();
          caches.open("v1").then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
    }
  });
}

const isUnauthorized = (status: number) => {
  return [400, 401].includes(status);
}

const isServerFault = (status: number) => {
  return [500, 501, 502].includes(status);
}

export const checkResponseStatus = (response: Response) => {
  if (response.status === 404)
    throw new NotFoundApiError(String(response.status));
  else if (isUnauthorized(response.status))
    throw new UnauthorizedApiError(String(response.status));
  else if (isServerFault(response.status))
    throw new ServerFaultApiError(String(response.status));
  else if (!response.ok)
    throw new UnknownApiError(String(response.status));
}

export class UnauthorizedApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedApiError';
  }
}

export class NotFoundApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundApiError';
  }
}

export class ServerFaultApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerFaultError';
  }
}

export class UnknownApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerFaultError';
  }
}