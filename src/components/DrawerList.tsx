import {
  Stack,
  List,
  Typography,
  Link,
  ListItemButton,
  Divider,
  ListItemIcon,
  Box,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../utils/Theme";
import { spMenu } from "../Config";
import { LogoutTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import VersionTag from "./VersionTag";

const DrawerList = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const path = useLocation().pathname;

  return (
    <Stack
      direction="column"
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper
      }}
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
          src="/static/beu_dark.svg"
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
        <Box sx={{
          flexGrow: "1",
          overflowY: "auto",
        }}>
          {spMenu.map(({ name, icon, href }, inx) => (
            <NavLink
              to={href}
              key={inx}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <ListItemButton
                sx={{
                  p: "5%",
                  pl: "10%",
                  bgcolor:
                    path === href ? theme.palette.primary.dark : "inherit",
                }}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <Typography>{name}</Typography>
              </ListItemButton>
            </NavLink>
          ))}
        </Box>
        <VersionTag sx={{ position: "inherit" }} />
        <Link href="" color="inherit" underline="none" width={"100%"}>
          <ListItemButton key="logout" sx={{ p: "5%", pl: "10%" }} onClick={logout}>
            <ListItemIcon>
              <LogoutTwoTone color="primary" />
            </ListItemIcon>
            <Typography fontSize={14}>LogOut</Typography>
          </ListItemButton>
        </Link>
      </List>
    </Stack>
  );
};

export default DrawerList;
