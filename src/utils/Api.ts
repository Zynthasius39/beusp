const ip = "localhost";
const port = "5000";
const url = `http://${ip}:${port}`;

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

export async function fetchPhoto() {
  const response = await fetch(url + "/resource/studphoto", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
  if (isUnauthorized(response.status)) {
    throw new UnauthorizedApiError(String(response.status));
  }
  return await response.blob();
}

export async function fetchStudRes(res: string) {
  const response = await fetch(`${url}/resource/${res}`, {
    method: "GET",
    credentials: "include",
  });
  checkResponseStatus(response);
  return await response.json();
}

export async function fetchStudGrades(year: string, semester: string) {
  const response = await fetch(year === "ALL" ? `${url}/resource/grades/all` : `${url}/resource/grades/${year}/${semester}`, {
    method: "GET",
    credentials: "include",
  });
  if (isUnauthorized(response.status)) {
    throw new UnauthorizedApiError(String(response.status));
  }
  return await response.json();
}

export async function fetchStudStatus() {
  const response = await fetch(`${url}/status`, {
    method: "GET",
    credentials: "include",
  });
  if (isUnauthorized(response.status)) {
    throw new UnauthorizedApiError(String(response.status));
  }
  return await response.json();
}

const isUnauthorized = (status: number) => {
  return [400, 401].includes(status);
}

const isServerFault = (status: number) => {
  return [500, 501, 502].includes(status);
}

const checkResponseStatus = (response: Response) => {
  if (isUnauthorized(response.status))
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