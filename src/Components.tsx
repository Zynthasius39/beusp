import { Button, styled, Switch } from "@mui/material";
import {
  AnnouncementTwoTone,
  ArticleTwoTone,
  CalendarMonthTwoTone,
  DashboardTwoTone,
  DoorSlidingTwoTone,
  FolderTwoTone,
  GradeTwoTone,
  GradingTwoTone,
  SettingsTwoTone,
  SummarizeTwoTone,
} from "@mui/icons-material";

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          theme.palette.secondary.contrastText,
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.main,
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        theme.palette.secondary.contrastText,
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.main,
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

// export const IOSSwitch = styled((props: SwitchProps) => (
//   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
// ))(({ theme }) => ({
//   width: 42,
//   height: 26,
//   padding: 0,
//   "& .MuiSwitch-switchBase": {
//     padding: 0,
//     margin: 2,
//     transitionDuration: "300ms",
//     "&.Mui-checked": {
//       transform: "translateX(16px)",
//       color: "#fff",
//       "& + .MuiSwitch-track": {
//         backgroundColor: "#65C466",
//         opacity: 1,
//         border: 0,
//         ...theme.applyStyles("dark", {
//           backgroundColor: "#2ECA45",
//         }),
//       },
//       "&.Mui-disabled + .MuiSwitch-track": {
//         opacity: 0.5,
//       },
//     },
//     "&.Mui-focusVisible .MuiSwitch-thumb": {
//       color: "#33cf4d",
//       border: "6px solid #fff",
//     },
//     "&.Mui-disabled .MuiSwitch-thumb": {
//       color: theme.palette.grey[100],
//       ...theme.applyStyles("dark", {
//         color: theme.palette.grey[600],
//       }),
//     },
//     "&.Mui-disabled + .MuiSwitch-track": {
//       opacity: 0.7,
//       ...theme.applyStyles("dark", {
//         opacity: 0.3,
//       }),
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxSizing: "border-box",
//     width: 22,
//     height: 22,
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 26 / 2,
//     backgroundColor: "#E9E9EA",
//     opacity: 1,
//     transition: theme.transitions.create(["background-color"], {
//       duration: 500,
//     }),
//     ...theme.applyStyles("dark", {
//       backgroundColor: "#39393D",
//     }),
//   },
// }));

export const PrimaryButton = styled(Button, {
  name: 'PrimaryButton',
  slot: 'root',
})(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.primary.main,
  paddingLeft: 16,
  paddingRight: 16,
  fontWeight: "bolder",
  ":disabled": {
    backgroundColor: theme.palette.primaryButton.dark,
  }
}));

export const spMenu = [
  { name: "Dashboard", icon: <DashboardTwoTone color="primary" />, href: "/" },
  {
    name: "Announces",
    icon: <AnnouncementTwoTone color="primary" />,
    href: "/announces",
  },
  { name: "Departments", icon: <FolderTwoTone color="primary" />, href: "/departments" },
  { name: "Course", icon: <CalendarMonthTwoTone color="primary" />, href: "" },
  { name: "Grades", icon: <GradeTwoTone color="primary" />, href: "/grades" },
  { name: "Transcript", icon: <SummarizeTwoTone color="primary" />, href: "" },
  { name: "Attendance", icon: <GradingTwoTone color="primary" />, href: "" },
  { name: "Gate", icon: <DoorSlidingTwoTone color="primary" />, href: "" },
  { name: "Documents", icon: <ArticleTwoTone color="primary" />, href: "" },
  { name: "Settings", icon: <SettingsTwoTone color="primary" />, href: "" },
];