import { AccountCircle } from "@mui/icons-material";
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
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useTheme } from "../Theme";
import { isAuthed, useAuth } from "../Auth";
import { getPhoto } from "../Utils";

const Navbar = (props: { username: string; page: string; auth: boolean }) => {
  const [name, setName] = useState("Undefined");
  const { isDark, setDark } = useTheme();
  const { logout, setImage, imageURL } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleThemeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setDark(event.target.checked);
  };

  const handleAccClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      setImage("");
      await logout();
    } catch (e) {
      console.error("Error occured while authorizing:", e);
    }
  }

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
    if (!isAuthed()) {
      logout();
    } else {
      getStudPhoto();
      setName((localStorage.getItem("studfullname") || "Unauthorized").split(" ")[0]);
    }
  }, []);

  return (
    <Box p={1} m={1}>
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
          sx={{ m: 2 }}
          defaultChecked
          checked={isDark()}
          onChange={handleThemeSwitch}
        />
        {props.auth ? (
          <IconButton
            id="account-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleAccClick}
            // size="large"
            color="inherit"
          >
            {imageURL === "" ?
              <Skeleton variant="circular" width="50px" height="50px" />
              :
              <Avatar alt="studphoto" src={imageURL} sx={{ width: "50px", height: "50px" }} />
            }
          </IconButton>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              color: "secondary.contrastText",
            }}
          >
            Login
          </Button>
        )}
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
            <Typography>{name}</Typography>
          </Stack>
          <Divider />
          <MenuItem>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
