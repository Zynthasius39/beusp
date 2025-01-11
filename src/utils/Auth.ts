import { createContext, useContext } from "react";
import Cookies from "universal-cookie";
import { AuthContextType } from "./Interfaces";

const cookies = new Cookies(null, { path: "/" });

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const isAuthed = (): boolean => {
    if (cookies.get("SessionID") === undefined || cookies.get("SessionID") === "") {
      console.log(cookies.get("SessionID"));
      return false;
    }
    if (cookies.get("StudentID") === undefined || cookies.get("StudentID") === "") {
      console.log(cookies.get("StudentID"));
      return false;
    }
    return true;
}
