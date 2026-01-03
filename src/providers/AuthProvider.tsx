import { ReactNode, useState } from "react";
import { AuthContext } from "../utils/Auth";
import { api, checkResponseStatus, isServerFault, isUnauthorized, ServerFaultApiError, UnauthorizedApiError } from "../utils/Api";
import Cookies from "universal-cookie";
import { User } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";

let locked = false;

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);
  const cookies = new Cookies(null, { path: "/" });

  const login = async (studentId: number, password: string) => {
    const res = await fetch(`${api}/auth`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: String(studentId),
        password: password
      }),
    });
    if (isUnauthorized(res.status))
      throw new UnauthorizedApiError(String(res.status));
    else if (isServerFault(res.status))
      throw new ServerFaultApiError(String(res.status));
    else {
      if (window.location.protocol === 'https:')
        caches.delete("v1");
      setAuthed(true);
      locked = false;
    }
  };

  const logout = async () => {
    if (locked) return;
    locked = true;
    await fetch(`${api}/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    cookies.remove("StudentID");
    cookies.remove("SessionID");
    cookies.remove("ImgID");
    localStorage.removeItem("studphoto");
    if (window.location.protocol === 'https:')
      caches.delete("v1");
    setUser(null);
    locked = false;
    setAuthed(false);
  };

  const verify = async () => {
    if (locked) return;
    locked = true;
    const res = await fetch(`${api}/verify`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (isUnauthorized(res.status)) {
      return false;
    }
    setAuthed(res.ok);
    locked = false;
    return res.ok;
  };

  const fetchCached = createFetchCached(logout);

  const getStudPhoto = async () => {
    if (!authed) return;
    return await fetchCached(`${api}/resource/studphoto`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "image/jpeg",
      },
    }).then(response => {
      checkResponseStatus(response);
      return response.blob()
    }).then(blob => {
      return URL.createObjectURL(blob);
    }).catch(e => {
      console.error(e);
    })
  }

  const getUser = async () => {
    if (!authed) return;
    await fetchCached(`${api}/resource/home`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json()
    }).then(json => {
      getStudPhoto().then(url => {
        setUser({ name: json?.studentInfo?.fullNamePatronymic?.split(" ")[0], imageURL: url ?? "" });
      });
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
      } else {
        console.error(e);
      }
    });
  }

  return <AuthContext.Provider value={{ user, authed, login, logout, verify, getUser }}>{children}</AuthContext.Provider>;
}
