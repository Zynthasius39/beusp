import {
  AnnouncementTwoTone,
  // ArticleTwoTone,
  // CalendarMonthTwoTone,
  DashboardTwoTone,
  Edit,
  // DoorSlidingTwoTone,
  // FolderTwoTone,
  GradeTwoTone,
  // GradingTwoTone,
  SettingsTwoTone,
  // SummarizeTwoTone,
} from "@mui/icons-material";
import { SpMenuEntry } from "./utils/Interfaces";

const createSpMenuEntry = (name: string, icon: JSX.Element, href: string): SpMenuEntry => ({ name, icon, href });

export const spMenu = [
  createSpMenuEntry("Dashboard", <DashboardTwoTone color="primary" />, "/"),
  createSpMenuEntry("Announces", <AnnouncementTwoTone color="primary" />, "/announces"),
  createSpMenuEntry("Attendance", <Edit color="primary" />, "/attendance"),
  // createSpMenuEntry("Departments", <FolderTwoTone color="primary" />, "/departments"),
  // createSpMenuEntry("Course", <CalendarMonthTwoTone color="primary" />, ""),
  createSpMenuEntry("Grades", <GradeTwoTone color="primary" />, "/grades"),
  // createSpMenuEntry("Transcript", <SummarizeTwoTone color="primary" />, ""),
  // createSpMenuEntry("Attendance", <GradingTwoTone color="primary" />, ""),
  // createSpMenuEntry("Gate", <DoorSlidingTwoTone color="primary" />, ""),
  // createSpMenuEntry("Documents", <ArticleTwoTone color="primary" />, ""),
  createSpMenuEntry("Settings", <SettingsTwoTone color="primary" />, "/settings"),
];