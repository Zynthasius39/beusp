import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import DrawerList from "./DrawerList";
import { useTheme } from "../utils/Theme";
import { isAuthed, useAuth } from "../utils/Auth";
import { getPhoto } from "../utils/StudentLogic";
import { verify } from "../utils/Api";

export default function App() {
  const { name, authed, imageURL, setImage, logout, verifiedAuth } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [page] = useState("Dashboard");

  const getComponent = async () => {
    if (!await verify()) {
      logout();
      navigate("/login");
    } else {
      verifiedAuth();
    }
  }

  useEffect(() => {
    if (!authed)
      getComponent();
  }, [name, imageURL]);

  return (
    <Stack
      color={theme.palette.primary.contrastText}
      bgcolor={theme.palette.background.default}
      justifyContent="space-between"
      height={"100vh"}
    >
      <Stack direction="row" height="100%">
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            borderRight: "1px solid " + theme.palette.divider,
          }}
        >
          <DrawerList />
        </Box>
        {/* <Divider /> */}
        <Stack flex={4} bgcolor="background.default" color="text.primary">
          <Navbar name={name} page={page} />
          <Box p={1} flex={8} overflow="auto">
            <Outlet />
          </Box>
        </Stack>
      </Stack>
      {/* <BottomNav /> */}
    </Stack>
  );
}
