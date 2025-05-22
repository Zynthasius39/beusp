export const url = `http://localhost:8080/api`;

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