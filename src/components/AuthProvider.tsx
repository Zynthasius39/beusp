import { ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../utils/Auth";
import { auth } from "../utils/Api";
import Cookies from "universal-cookie";

export default function AuthProvider({ children }: { children: ReactNode}) {
  const [name, setname] = useState("Undefined");
  const [authed, setAuthed] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const cookies = new Cookies(null, { path: "/" });

  const verifiedAuth = useCallback(() => setAuthed(true), [authed]);

  const setName = useCallback((name: string) => setname(name), [name]);

  const login = useCallback(async (student_id : number, password : string) => {
    await auth(String(student_id), password);
    caches.delete("v1");
    setAuthed(true);
  }, [authed]);

  const logout = useCallback(async () => {
    cookies.remove("StudentID");
    cookies.remove("SessionID");
    cookies.remove("ImgID");
    localStorage.removeItem("studphoto");
    caches.delete("v1");
    setAuthed(false);
  }, [authed]);

  const setImage = useCallback((url: string) => {
    setImageURL(url);
  }, [imageURL]);

  return <AuthContext.Provider value={{authed, login, logout, imageURL, name, verifiedAuth, setImage, setName }}>{children}</AuthContext.Provider>;
}
