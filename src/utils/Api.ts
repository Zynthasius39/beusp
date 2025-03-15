const ip = "10.0.10.75";
const port = "5000";
const url = `http://${ip}:${port}/api`;

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
  if (!response.ok) {
    throw new Error(String(response.status));
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
  if (!response.ok) {
    throw new Error(String(response.status));
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
  if (!response.ok) {
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
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.blob();
}

export async function fetchStudRes(res: string) {
  const response = await fetch(`${url}/resource/${res}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.json();
}

export async function fetchStudGrades(year: string, semester: string) {
  const response = await fetch(year === "ALL" ? `${url}/resource/grades/all` : `${url}/resource/grades/${year}/${semester}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.json();
}

export async function fetchStudStatus() {
  const response = await fetch(`${url}/resource/status`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.json();
}
