import { ReactNode, useCallback, useState } from "react";
import { AuthContext } from "../Auth";
import { auth } from "../Api";
import Cookies from "universal-cookie";

export default function AuthProvider({ children }: { children: ReactNode}) {
  const [authed, setAuthed] = useState(true);
  const [imageURL, setImageURL] = useState("");
  const cookies = new Cookies(null, { path: "/" });

  const login = useCallback(async (student_id : number, password : string) => {
    try {
      await auth(String(student_id), password);
      setAuthed(true);
    } catch (e) {
      throw e;
    }
  }, [authed]);

  const logout = useCallback(async () => {
    cookies.remove("StudentID");
    cookies.remove("SessionID");
    cookies.remove("ImgID");
    localStorage.removeItem("studphoto");
    localStorage.removeItem("studfullname");
    setAuthed(false);
  }, [authed]);

  const setImage = useCallback((url: string) => {
    setImageURL(url);
  }, [imageURL]);

  return <AuthContext.Provider value={{authed, login, logout, imageURL, setImage }}>{children}</AuthContext.Provider>;
}
