const url = "http://127.0.0.1:5000/api";

export async function auth(student_id: string, password: string) {
  const response = await fetch(url + "/auth", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: student_id,
      password: password,
    }),
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
}

export async function unauth() {
  const response = await fetch(url + "/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
}

export async function fetchHome() {
  const response = await fetch(url + "/resource/home", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.json();
}

export async function fetchPhoto() {
  const response = await fetch(url + "/studphoto", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return await response.blob();
}