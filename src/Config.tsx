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
import { TFunction } from "i18next";

const createSpMenuEntry = (name: string, icon: JSX.Element, href: string): SpMenuEntry => ({ name, icon, href });

export const spMenu = (t: TFunction) => {
  return [
  createSpMenuEntry(t("dashboard"), <DashboardTwoTone color="primary" />, "/"),
  createSpMenuEntry(t("announces"), <AnnouncementTwoTone color="primary" />, "/announces"),
  createSpMenuEntry(t("attendance"), <Edit color="primary" />, "/attendance"),
  // createSpMenuEntry(t("departments"), <FolderTwoTone color="primary" />, "/departments"),
  // createSpMenuEntry(t("course", <CalendarMonthTwoTone color="primary" />, ""),
  createSpMenuEntry(t("grades"), <GradeTwoTone color="primary" />, "/grades"),
  // createSpMenuEntry(t("transcript"), <SummarizeTwoTone color="primary" />, ""),
  // createSpMenuEntry(t("gate"), <DoorSlidingTwoTone color="primary" />, ""),
  // createSpMenuEntry(t("documents"), <ArticleTwoTone color="primary" />, ""),
  createSpMenuEntry(t("settings"), <SettingsTwoTone color="primary" />, "/settings"),
]};