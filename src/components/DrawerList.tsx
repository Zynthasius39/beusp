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
import logo_dark from "../assets/beu_dark.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../utils/Theme";
import { useCallback } from "react";
import { useAuth } from "../utils/Auth";
import { spMenu } from "../Components";
import { LogoutTwoTone } from "@mui/icons-material";

const DrawerList = () => {
  const { logout, setImage } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const handleLogout = useCallback(async () => {
    try {
      setImage("");
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Error occured while authorizing:", e);
    }
  }, []);

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
        <Box sx={{
          flexGrow: "1",
          overflowY: "auto",
        }}>
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
                  {icon}
                </ListItemIcon>
                <Typography>{name}</Typography>
              </ListItemButton>
            </NavLink>
          ))}
        </Box>
        <Link href="" color="inherit" underline="none" width={"100%"}>
          <ListItemButton key="logout" sx={{ p: "5%", pl: "10%" }} onClick={handleLogout}>
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
