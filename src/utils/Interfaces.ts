import { Theme } from "@mui/material";

export interface AuthContextType {
  name: string;
  authed: boolean;
  login: (student_id: number, password: string) => Promise<void>;
  logout: () => Promise<void>;
  imageURL: string;
  verifiedAuth: () => void;
  setImage: (url: string) => void;
  setName: (name: string) => void;
}

export interface ThemeContextType {
  theme: Theme;
  isDark: () => boolean;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

export interface GradesJson {
  courseCode: CourseJson
}

export interface CourseJson {
  course_name: string,
  act1: number,
  act2: number,
  act3: number,
  attendance: number,
  iw: number,
  final: number,
  sum: number,
}