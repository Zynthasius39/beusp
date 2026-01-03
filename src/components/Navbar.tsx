import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Drawer from "./Drawer";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useAuth } from "../utils/Auth";
import { MaterialUISwitch } from "./MaterialUISwitch";
import { useTranslation } from "react-i18next";
import { ResponsiveButton } from "./ResponsiveButton";

const Navbar = (props: { page: string }) => {
  const { t } = useTranslation();
  const { isDark, setDark } = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleThemeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setDark(event.target.checked);
    if (event.target.checked)
      localStorage.setItem("theme", "dark");
    else
      localStorage.removeItem("theme");
  };

  const handleAccClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack sx={{
      flexDirection: "row",
      alignItems: "center",
      pl: "1.6rem",
      pr: "1.6rem",
      pt: "0.5rem",
      gap: "0.5rem",
      // bgcolor: "background.paper"
    }}
    >
      <Drawer />
      <Typography
        variant="h6"
        component="div"
        sx={{ flex: 1, fontWeight: "bold", fontSize: "1.4rem" }}
      >
        {props.page}
      </Typography>
      <MaterialUISwitch
        checked={isDark()}
        onChange={handleThemeSwitch}
      />
      <IconButton
        id="account-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleAccClick}
        color="inherit"
      >
        {user?.imageURL === "" ?
          <Skeleton
            variant="circular"
            width="3rem"
            height="3rem"
          />
          :
          <Avatar
            alt="studphoto"
            src={user?.imageURL}
            sx={{ width: "3rem", height: "3rem" }}
          />
        }
      </IconButton>
      <Menu
        id="account"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{  // TODO: Deprecated
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack
          m="1rem"
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="1rem"
        >
          {
            user?.imageURL === "" ?
              <Skeleton
                variant="circular"
                width="2.5rem"
                height="2.5rem"
              />
              :
              <Avatar
                alt="studphoto"
                src={user?.imageURL}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
          }
          <Typography>{user?.name}</Typography>
        </Stack>
        <Divider />
        {/* <MenuItem onClick={handleProfileClick}>{t("profile")}</MenuItem> */}
        <MenuItem onClick={logout}>{t("logout")}</MenuItem>
      </Menu>
    </Stack>
  );
};

export default Navbar;
