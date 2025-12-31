import {
  Snackbar,
  Stack,
} from "@mui/material";
import "../style/Login.css";
import { useState } from "react";
import TosDialog from "../components/TosDialog";
import { useTranslation } from "react-i18next";
import { Snowflakes } from "../components/Snowflakes";
import LoginCard from "../components/LoginCard";

export default function Login() {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);

  return (
    <Stack
      id="login-root"
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={{
        color: "primary.contrastText",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        // backgroundColor: "background.paper",
      }}
    >
      <Snowflakes />
      <LoginCard setAlert={setAlert} />
      <TosDialog />
      <Snackbar
        open={alert != undefined}
      >
        {alert}
      </Snackbar>
      <a id="github-ribbon" className="github-fork-ribbon right-bottom fixed" href="https://github.com/Zynthasius39/beusp" data-ribbon={t("ghRibbon")} title={t("ghRibbon")}>{t("ghRibbon")}</a>
    </Stack>
  );
}
