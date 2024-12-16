import {
  Announcement,
  Article,
  CalendarMonth,
  Dashboard,
  DoorSliding,
  Folder,
  Grade,
  Grading,
  Logout,
  Settings,
} from "@mui/icons-material";
import {
  Stack,
  List,
  Typography,
  Link,
  ListItemButton,
  Divider,
  ListItemIcon,
  Box,
  Avatar,
} from "@mui/material";
import logo_dark from "../assets/beu_dark.svg";
import logo_light from "../assets/beu_light.svg";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../Theme";

const spMenu = [
  { name: "Dashboard", icon: <Dashboard color="primary" />, href: "/" },
  {
    name: "Announces",
    icon: <Announcement color="primary" />,
    href: "/announces",
  },
  { name: "Departments", icon: <Folder color="primary" />, href: "" },
  { name: "Course", icon: <CalendarMonth color="primary" />, href: "" },
  { name: "Grades", icon: <Grade color="primary" />, href: "" },
  { name: "Transcript", icon: <Article color="primary" />, href: "" },
  { name: "Attendance", icon: <Grading color="primary" />, href: "" },
  { name: "Gate", icon: <DoorSliding color="primary" />, href: "" },
  { name: "Settings", icon: <Settings color="primary" />, href: "" },
];

const DrawerList = () => {
  const { theme, isDark } = useTheme();
  const path = useLocation().pathname;

  return (
    <Stack
      direction="column"
      sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}
    >
      <Stack
        p={2}
        m={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <img
          alt="Baku Engineering University"
          width={48}
          src={logo_dark}
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            fill: "#ff0000",
          }}
        />
        <Typography p={1} fontSize={16}>
          Baku Engineering University
        </Typography>
      </Stack>
      <Divider />
      <List
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box flexGrow={1}>
          {spMenu.map(({ name, icon, href }) => (
            <NavLink
              to={href}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <ListItemButton
                key={name}
                sx={{
                  p: "5%",
                  pl: "10%",
                  bgcolor:
                    path === href ? theme.palette.primary.dark : "inherit",
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ backgroundColor: theme.palette.primary.dark }}>
                    {icon}
                  </Avatar>
                </ListItemIcon>
                <Typography>{name}</Typography>
              </ListItemButton>
            </NavLink>
          ))}
        </Box>
        <Link href="" color="inherit" underline="none" width={"100%"}>
          <ListItemButton key="logout" sx={{ p: "5%", pl: "10%" }}>
            <ListItemIcon>
              <Avatar sx={{ backgroundColor: theme.palette.primary.dark }}>
                <Logout color="primary" />
              </Avatar>
            </ListItemIcon>
            <Typography fontSize={14}>LogOut</Typography>
          </ListItemButton>
        </Link>
      </List>
    </Stack>
  );
};

export default DrawerList;
