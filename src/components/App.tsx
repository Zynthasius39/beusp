import { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DrawerList from "./DrawerList";
import { useTheme } from "../utils/Theme";
import { useAuth } from "../utils/Auth";
import { verify } from "../utils/Api";
import { spMenu } from "../Components";

export default function App() {
  const { authed, imageURL, name, logout, verifiedAuth } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState("Dashboard");
  const path = useLocation();

  const getComponent = async () => {
    if (!await verify()) {
      logout();
      navigate("/login");
    } else {
      verifiedAuth();
    }
  }

  const updatePage = () => {
    setPage(spMenu.find(m => m.href === path.pathname)?.name || "");
  }

  useEffect(() => {
      updatePage();
    if (!authed) {
      getComponent();
    }
  }, [name, imageURL, path]);

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
        <Stack flex={4} bgcolor="background.default" color="text.primary">
          <Navbar name={name} page={page}/>
          <Box p={1} flex={8} overflow="auto">
            <Outlet />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
