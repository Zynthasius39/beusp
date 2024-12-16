import { useState } from "react";
import { Box, Stack } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import DrawerList from "./DrawerList";
import { useTheme } from "../Theme";

export default function App() {
  const { theme } = useTheme();
  const [auth] = useState(true);
  const [page] = useState("Dashboard");
  const username = "Unknown";

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
          <Navbar username={username} page={page} auth={auth} />
          <Box p={2} flex={8}>
            <Outlet />
          </Box>
        </Stack>
      </Stack>
      {/* <BottomNav /> */}
    </Stack>
  );
}
