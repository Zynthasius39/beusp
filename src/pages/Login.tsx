import {
  Snackbar,
  Stack,
} from "@mui/material";
import "../style/Login.css";
import { useState } from "react";
import { Snowflakes } from "../components/Snowflakes";
import LoginCard from "../components/LoginCard";
import GithubButton from "../components/GithubButton";
import VersionTag from "../components/VersionTag";

export default function Login() {
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
      {/* <TosDialog /> */}
      <Snackbar
        open={alert != undefined}
      >
        {alert}
      </Snackbar>
      <Stack sx={{
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        p: "1rem",
      }}>
        <GithubButton />
        <VersionTag />
      </Stack>
    </Stack>
  );
}
