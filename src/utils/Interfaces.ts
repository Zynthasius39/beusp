import { Theme } from "@mui/material";

export type Order = 'asc' | 'desc';
export type ColorSeverity = "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
export type AlertSeverity = 'success' | 'error' | 'warning' | 'info';
export type AttendanceCouples = Record<string, (AttendanceEntry & { courseCode: string })[]>

export interface AttendanceJson {
  [key: string]: AttendanceEntry
}

export interface User {
  name: string,
  imageURL: string,
}

export interface AuthContextType {
  user: User | null,
  authed: boolean,
  login: (student_id: number, password: string) => Promise<void>,
  logout: () => Promise<void>,
  verify: () => Promise<boolean>,
  verifySession: () => Promise<boolean>,
}

export interface ThemeContextType {
  theme: Theme;
  isDark: () => boolean;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

export interface GradesJson {
  [key: string]: GradeEntry
}

export interface GradeEntry {
  courseCode: string,
  courseName: string,
  act1: number,
  act2: number,
  act3: number,
  attendance: number,
  iw: number,
  final: number,
  sum: number,
  calcSum: number,
  mark: string,
}

export interface AttendanceEntry {
  absent: number,
  absentPercent: number,
  atds: number,
  courseEducator: string,
  courseCode: string,
  courseName: string,
  credit: string,
  hours: number,
  limit: number,
}

export interface HomeStudentInfoJson {
  advisor: string,
  beuEmail: string,
  birthDate: string,
  dimScore: number,
  dissTopic: string,
  dormDebt: number,
  eduDebt: {
    amount: number,
    paymentAnnual: number,
    paymentType: string,
    semester: number,
    year: number,
  },
  fullNamePatronymic: string,
  groupCode: string,
  lastLogin: {
    datetime: string,
    ip: string,
  },
  presidentScholar: boolean,
  registerDate: string,
  speciality: {
    lang: string,
    program: string,
    year: number,
  },
  stateFunded: boolean,
  status: string,
  studentId: number,
}

export interface BotSubsJson {
  email?: string,
  telegramUserId?: number,
  discordWebhookUrl?: string,
}

export interface BotInfoJson {
  botEmail: string | undefined,
  botTelegram: string | undefined,
}

export interface SettingsJson {
  lang: "en" | "az",
}

export interface SpMenuEntry {
  name: string,
  icon: JSX.Element,
  href: string,
}