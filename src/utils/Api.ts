import { ApiMode } from "./Interfaces";

const live_url = `http://localhost:8080/api`;
const offline_url = `http://localhost:8081/api`;
export let api = localStorage.getItem("offline_mode") === "1" ? offline_url : live_url;

export const setApiMode = (mode: ApiMode) => {
  const isLive = mode === "live";
  localStorage.setItem("offline_mode", isLive ? "0" : "1");
  api = isLive ? live_url : offline_url;
}

export const isUnauthorized = (status: number) => {
  return [400, 401].includes(status);
}

export const isServerFault = (status: number) => {
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