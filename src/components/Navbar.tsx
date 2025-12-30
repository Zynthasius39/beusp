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
      pl: 3,
      pr: 3,
      pt: 1,
      gap: 1,
    }}
    >
        <Drawer />
        <Typography
          variant="h6"
          component="div"
          sx={{ flex: 1, fontWeight: "bold" }}
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
              width="50px"
              height="50px"
            />
            :
            <Avatar
              alt="studphoto"
              src={user?.imageURL}
              sx={{ width: "50px", height: "50px" }}
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
            m={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            {
              user?.imageURL === "" ?
                <Skeleton
                  variant="circular"
                  width="40px"
                  height="40px"
                />
                :
                <Avatar
                  alt="studphoto"
                  src={user?.imageURL}
                  sx={{ width: "40px", height: "40px" }}
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
