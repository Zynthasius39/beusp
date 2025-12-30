import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import DrawerList from "../components/DrawerList";
import { useTheme } from "../utils/Theme";
import { spMenu } from "../Config";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [page, setPage] = useState("Dashboard");
  const path = useLocation();

  const updatePage = () => {
    setPage(spMenu(t).find(m => m.href === path.pathname)?.name || "");
  }

  useEffect(() => {
    updatePage();
  }, [path]);

  return (
    <Stack
      color={theme.palette.primary.contrastText}
      bgcolor={theme.palette.background.default}
      justifyContent="space-between"
      height="100vh"
      width="100vw"
    >
      <Stack direction="row" height="100%">
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            borderRight: "1px solid " + theme.palette.divider,
            flexShrink: 0,
          }}
        >
          <DrawerList />
        </Box>
        <Stack
          flexGrow={1}
          bgcolor="background.default"
          color="text.primary"
          overflow="auto"
        >
          <Navbar page={page} />
          <Box
            sx={{
              p: 1,
              pb: 20,
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Stack>
      <a id="github-ribbon" className="github-fork-ribbon right-bottom fixed" href="https://github.com/Zynthasius39/beusp" data-ribbon={t("ghRibbon")} title={t("ghRibbon")}>{t("ghRibbon")}</a>
    </Stack>
  );
}