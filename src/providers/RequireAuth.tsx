import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import { CircularProgress, Stack } from "@mui/material";
import { Snowflakes } from "../components/Snowflakes";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { authed, verify, getUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authed)
      getUser();
    else
      verify().then(v => {
        if (v === false) {
          navigate("/login");
        }
      });
  }, [authed])

  return authed ? (
    children
  ) : (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Snowflakes />
      <CircularProgress size={128} />
    </Stack>
  );
}