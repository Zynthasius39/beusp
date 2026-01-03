import {
  Stack,
  List,
  Typography,
  ListItemButton,
  Divider,
  ListItemIcon,
  Box,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../utils/Theme";
import { spMenu } from "../Config";
import { GitHub, LogoutTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import VersionTag from "./VersionTag";
import { useTranslation } from "react-i18next";

const listButtonStyle = {
  paddingBlock: {
    xs: "1.5rem",
    md: "1rem",
  },
  pl: "2.25rem",
  flexGrow: 0,
}

export default function DrawerList() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const path = useLocation().pathname;

  return (
    <Stack
      direction="column"
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        p="1rem"
        m="0.5rem"
        direction="row"
        alignItems="center"
        gap={1}
      >
        <img
          alt={t("uniName")}
          width="48rem"
          src="/static/beu_dark.svg"
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            fill: "#ff0000",
          }}
        />
        <Typography p="0.5rem" fontSize="1.2rem">
          {t("uniName")}
        </Typography>
      </Stack>
      <Divider />
      <List
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingBlock: 0,
        }}
      >
        <Box sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}>
          {spMenu(t).map(({ name, icon, href }, inx) => (
            <NavLink
              to={href}
              key={inx}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <ListItemButton
                sx={[
                  listButtonStyle,
                  {
                    bgcolor: path === href ? "primary.dark" : "inherit",
                  },
                ]}
              >
                <ListItemIcon sx={{ minWidth: "4rem" }}>
                  {icon(path === href ? "action" : "primary")}
                </ListItemIcon>
                <Typography sx={{ fontSize: "1.1rem" }}>{name}</Typography>
              </ListItemButton>
            </NavLink>
          ))}
        </Box>
        <VersionTag
          sx={{
            color: "text.disabled",
            fontSize: "1.1rem",
            pl: "2rem",
          }} />
        <ListItemButton
          key="github"
          sx={listButtonStyle}
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Zynthasius39/beusp"
        >
          <ListItemIcon sx={{ minWidth: "4rem" }}>
            <GitHub color="primary" />
          </ListItemIcon>
          <Typography fontSize="1.1rem">{t("githubSrc")}</Typography>
        </ListItemButton>
        <ListItemButton
          key="logout"
          onClick={logout}
          sx={listButtonStyle}
        >
          <ListItemIcon sx={{ minWidth: "4rem" }}>
            <LogoutTwoTone color="primary" />
          </ListItemIcon>
          <Typography fontSize="1.1rem">{t("logout")}</Typography>
        </ListItemButton>
      </List>
    </Stack>
  );
};
