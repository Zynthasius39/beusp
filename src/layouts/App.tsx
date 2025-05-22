import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import DrawerList from "../components/DrawerList";
import { useTheme } from "../utils/Theme";
import { spMenu } from "../Components";

export default function App() {
  const { theme } = useTheme();
  const [page, setPage] = useState("Dashboard");
  const path = useLocation();

  const updatePage = () => {
    setPage(spMenu.find(m => m.href === path.pathname)?.name || "");
  }

  useEffect(() => {
    updatePage();
  }, [path]);

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
          <Navbar page={page} />
          <Box p={1} flex={8} sx={{ pb: 20 }} overflow="auto">
            <Outlet />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
