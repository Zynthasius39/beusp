import {
  Avatar,
  Box,
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
import { checkResponseStatus, fetchCached, UnauthorizedApiError, url } from "../utils/Api";

const Navbar = (props: { name: string; page: string }) => {
  const { isDark, setDark } = useTheme();
  const { authed, logout, setName, setImage, imageURL } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = useCallback(async () => {
  }, []);

  const handleLogout = useCallback(async () => {
    setImage("");
    await logout();
    navigate("/login");
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

  const getStudPhoto = () => {
    fetchCached(`${url}/resource/studphoto`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "image/jpeg",
      },
    }).then(response => {
      checkResponseStatus(response);
      return response.blob()
    }).then(blob => {
      const url = URL.createObjectURL(blob)
      setImage(url);
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    })
  }

  const getHome = () => {
    fetchCached(`${url}/resource/home`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json()
    }).then(json => {
      setName(json?.studentInfo?.fullNamePatronymic?.split(" ")[0]);
      getStudPhoto();
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    })
  }

  useEffect(() => {
    if (authed) {
      getHome();
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
