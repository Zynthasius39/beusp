import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Drawer from "./Drawer";
import { MaterialUISwitch } from "../Components";
import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useAuth } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import { getPhoto } from "../utils/StudentLogic";

const Navbar = (props: { name: string; page: string }) => {
  const { isDark, setDark } = useTheme();
  const { authed, logout, setName, setImage, imageURL } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = useCallback(async () => {
    // Debuggin purposes
    console.log(JSON.parse(localStorage.getItem("transcript") || "{}"));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setImage("");
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Error occured while authorizing:", e);
    }
  }, []);

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

  const getStudPhoto = async () => {
    try {
      setImage(await getPhoto());
    } catch (error) {
      console.error("Unable to get Student Photo:", error);
    }
  }

  useEffect(() => {
    if (authed) {
      getStudPhoto();
      const homeJson = JSON.parse(localStorage.getItem("home") || "{}").home;
      if (homeJson != undefined) {
        setName(homeJson.student_info["Name surname patronymic"].split(" ")[0]);
      }
    }
  }, [authed]);

  return (
    <Box p={1}>
      <Toolbar>
        <Drawer />
        <Typography
          variant="h6"
          component="div"
          sx={{ flex: 1, fontWeight: "bold" }}
        >
          {props.page}
        </Typography>
        <MaterialUISwitch
          sx={{ m: 1 }}
          defaultChecked
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
          {imageURL === "" ?
            <Skeleton variant="circular" width="50px" height="50px" />
            :
            <Avatar alt="studphoto" src={imageURL} sx={{ width: "50px", height: "50px" }} />
          }
        </IconButton>
        <Menu
          id="account"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
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
            {imageURL === "" ?
              <Skeleton variant="circular" width="40px" height="40px" />
              :
              <Avatar alt="studphoto" src={imageURL} sx={{ width: "40px", height: "40px" }} />
            }
            <Typography>{props.name}</Typography>
          </Stack>
          <Divider />
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
