import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../utils/Auth";
import { checkResponseStatus, isServerFault, isUnauthorized, ServerFaultApiError, UnauthorizedApiError, url } from "../utils/Api";
import Cookies from "universal-cookie";
import { User } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);
  const cookies = new Cookies(null, { path: "/" });

  const login = async (student_id: number, password: string) => {
    const res = await fetch(`${url}/auth?` + new URLSearchParams({
      studentId: String(student_id),
      password: password,
    }).toString(), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (isUnauthorized(res.status))
      throw new UnauthorizedApiError(String(res.status));
    else if (isServerFault(res.status))
      throw new ServerFaultApiError(String(res.status));
    else {
      caches.delete("v1");
      setAuthed(true);
    }
  };

  const logout = async () => {
    fetch(url + "/logout", {
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
    caches.delete("v1");
    setUser(null);
    setAuthed(false);
  };

  const verify = async () => {
    const res = await fetch(url + "/verify", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (isUnauthorized(res.status)) {
      return false;
    }
    setAuthed(true);
    return true;
  };

  const fetchCached = createFetchCached(logout);

  const getStudPhoto = async () => {
    return await fetchCached(`${url}/resource/studphoto`, {
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
    await fetchCached(`${url}/resource/home`, {
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

  const verifySession = async () => {
    const verified = await verify();
    if (!verified)
      logout();
    return verified;
  };

  useEffect(() => {
    getUser();
  }, [authed])

  return <AuthContext.Provider value={{ user, authed, login, logout, verify, verifySession }}>{children}</AuthContext.Provider>;
}
