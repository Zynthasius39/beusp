import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import { CircularProgress, Stack } from "@mui/material";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [, setTick] = useState(0);
  const { authed, verifySession, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authed)
      verifySession().then(v => {
        if (v)
          setTick(t => t + 1);
        else {
          navigate("/login");
          logout();
        }
      });
  }, [authed])

  return authed ? (
    children
  ) : (
    <Stack
      sx={{
        backgroundColor: 'background.default',
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress size={128} />
    </Stack>
  );
}