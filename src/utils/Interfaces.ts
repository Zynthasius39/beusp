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
  [key: string]: CourseJson
}

export interface CourseJson {
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
