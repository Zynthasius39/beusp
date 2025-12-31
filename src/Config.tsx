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
import { iconColor, SpMenuEntry } from "./utils/Interfaces";
import { TFunction } from "i18next";

const createSpMenuEntry = (name: string, icon: (c: iconColor) => JSX.Element, href: string): SpMenuEntry => ({ name, icon, href });

export const spMenu = (t: TFunction) => {
  return [
    createSpMenuEntry(t("dashboard"), (c: iconColor) => <DashboardTwoTone color={c} />, "/"),
    createSpMenuEntry(t("announces"), (c: iconColor) => <AnnouncementTwoTone color={c} />, "/announces"),
    createSpMenuEntry(t("attendance"), (c: iconColor) => <Edit color={c} />, "/attendance"),
    // createSpMenuEntry(t("departments"), (c: iconColor) => <FolderTwoTone color={c} />, "/departments"),
    // createSpMenuEntry(t("course", (c: iconColor) => <CalendarMonthTwoTone color={c} />, ""),
    createSpMenuEntry(t("grades"), (c: iconColor) => <GradeTwoTone color={c} />, "/grades"),
    // createSpMenuEntry(t("transcript"), (c: iconColor) => <SummarizeTwoTone color={c} />, ""),
    // createSpMenuEntry(t("gate"), (c: iconColor) => <DoorSlidingTwoTone color={c} />, ""),
    // createSpMenuEntry(t("documents"), (c: iconColor) => <ArticleTwoTone color={c} />, ""),
    createSpMenuEntry(t("settings"), (c: iconColor) => <SettingsTwoTone color={c} />, "/settings"),
  ]
};