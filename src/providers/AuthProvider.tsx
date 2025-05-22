import { ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../utils/Auth";
import { checkResponseStatus, isUnauthorized, UnauthorizedApiError, url } from "../utils/Api";
import Cookies from "universal-cookie";
import { User } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);
  const cookies = new Cookies(null, { path: "/" });

  // const setName = useCallback((name: string) => setname(name), [name]);

  const login = useCallback(async (student_id: number, password: string) => {
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
    if (isUnauthorized(res.status)) {
      throw new UnauthorizedApiError(String(res.status));
    }
    caches.delete("v1");
    setAuthed(true);
  }, [authed]);

  const logout = useCallback(async () => {
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
    window.location.href = "/#/login";
  }, [authed]);

  const verify = useCallback(async () => {
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
    return true;
  }, [authed]);

  // const setImage = useCallback((url: string) => {
  //   setImageURL(url);
  // }, [imageURL]);

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
    if (await verify()) {
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
  }

  useEffect(() => {
    getUser();
  }, [authed])

  return <AuthContext.Provider value={{ user, authed, login, logout, verify }}>{children}</AuthContext.Provider>;
}
