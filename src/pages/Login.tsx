import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormGroup,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import "../style/Login.css";
import { useTheme } from "../utils/Theme";
import { KeyboardEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import TosDialog from "../components/TosDialog";
import { AlertSeverity, ApiMode } from "../utils/Interfaces";
import { MaterialUISwitch } from "../components/MaterialUISwitch";
import { PrimaryButton } from "../components/PrimaryButton";
import { ServerFaultApiError, setApiMode, UnauthorizedApiError } from "../utils/Api";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const { theme, isDark, setDark } = useTheme();
  const { user, authed, login, logout } = useAuth();
  const [alignment, setAlignment] = useState<ApiMode>("live");
  const [studentId, setStudentID] = useState(0);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();

  const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleButtonGroup = useCallback(
    (_: MouseEvent<HTMLElement>, v: string) => {
      if (v !== null) {
        setAlignment(v as ApiMode);
        setApiMode(v as ApiMode);
      }
    },
    [],
  );

  const showAlert = useCallback((msg: string, severity: AlertSeverity) => {
    if (alert != undefined) {
      setAlert(undefined);
      clearTimeout(alertTimer.current);
    }
    setAlert(
      <Alert severity={severity} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    );
    alertTimer.current = setTimeout(() => {
      setAlert(undefined);
    }, 4000);
  }, [alert]);

  const handleLogin = async () => {
    if (!loading) {
      setLoading(true);
      timer.current = setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    try {
      await login(studentId, password);

      // Only reason for visiting is to check Grades page
      // navigate("/");
      navigate("/grades");
    } catch (e) {
      console.error(t("errorAuth"), e);
      if (e instanceof UnauthorizedApiError)
        showAlert(t("errorCreds"), "error");
      else if (e instanceof ServerFaultApiError)
        showAlert(t("errorSrv"), "error");
      else
        showAlert(t("errorUex"), "error");
    }
  };

  const handleLogout = async () => {
    setStudentID(0);
    setPassword("");
    try {
      await logout();
    } catch (e) {
      console.error(t("errorAuth"), e);
      showAlert(t("errorLogout") + String(e), "error");
    }
  }

  useEffect(() => {
    clearTimeout(timer.current);
    setAlignment(localStorage.getItem("offline_mode") === "1" ? "demo" : "live");
  }, []);

  return (
    <Stack
      id="login-root"
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={{
        color: theme.palette.primary.contrastText,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <FormGroup>
        <Stack
          p="30px"
          justifyContent="space-between"
          id="login-card"
          gap="15px"
          sx={{
            backgroundColor: theme.palette.background.default,
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 100px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            width: {
              xs: "calc(100dvw - 100px)",
              md: "400px",
            },
          }}
        >
          <Stack flexDirection="row" justifyContent="space-between">
            <Stack flexDirection="row" alignItems="center" gap={1}>
              <img
                src={isDark() ? "/static/beu_light.svg" : "/static/beu_dark.svg"}
                width={24}
                style={{ backgroundColor: theme.palette.primary.main }}
              />
              <Typography variant="body1" id="logo-label">
                {t("uniName")}
              </Typography>
            </Stack>
            <MaterialUISwitch checked={isDark()} onChange={(_, checked) => {
              setDark(checked);
              if (checked)
                localStorage.setItem("theme", "dark");
              else
                localStorage.removeItem("theme");
            }} sx={{ mb: "10px" }} />
          </Stack>
          <Typography variant="h4" id="login-label" pt="5px" pb="5px">
            {t("loginTitle")}
          </Typography>
          {authed ?
            <Stack alignItems="center" gap="10px">
              {loading ?
                <CircularProgress
                  size={24}
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                />
                :
                <>
                  {
                    user?.imageURL === "" ?
                      <Skeleton variant="circular" width="100px" height="100px" />
                      :
                      <Avatar alt="studphoto" src={user?.imageURL} sx={{ width: "100px", height: "100px" }} />
                  }
                  <Typography variant="h5" pb="30px">{user?.name}</Typography>
                  <Box>
                    <NavLink to="/">
                      <PrimaryButton disabled={loading} sx={{ width: "120px", mr: "10px" }}>{t("dashboard")}</PrimaryButton>
                    </NavLink>
                    <Button variant="outlined" onClick={handleLogout} sx={{ width: "120px" }}>{t("logout")}</Button>
                  </Box>
                </>
              }
            </Stack>
            :
            <>
              <div>
                <Typography variant="body2" id="login-label" pb="5px">
                  {t("studentId")}
                </Typography>
                <TextField
                  id="input-id"
                  type="number"
                  placeholder={alignment === "demo" ? t("loginPhDemo") : t("loginPh")}
                  fullWidth={true}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setStudentID(Number(e.target.value));
                  }}
                  disabled={alignment === "demo"}
                />
              </div>
              <div>
                <Typography variant="body2" id="login-label" pb="5px">
                  {t("password")}
                </Typography>
                <TextField
                  id="input-pass"
                  type="password"
                  fullWidth={true}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={alignment === "demo"}
                />
              </div>
              {/* <FormControlLabel control={<Checkbox />} label=t("loginRemember") /> */}
              <Box sx={{ position: "relative" }}>
                <PrimaryButton
                  disabled={loading}
                  fullWidth
                  onClick={handleLogin}
                  sx={{
                    fontSize: 16,
                    mt: 1,
                  }}
                >{t("loginButton")}</PrimaryButton>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      mt: '-12px',
                      ml: '-12px',
                    }}
                  />
                )}
              </Box>
              {/* <Link href="#" underline="none" textAlign="center" fontSize={14}>
                {t("loginForgot")}
              </Link> */}
              <Divider sx={{ pt: "5px", pb: "5px" }} />
              <ToggleButtonGroup
                fullWidth
                color="primary"
                value={alignment}
                onChange={handleButtonGroup}
                exclusive
                aria-label="account type"
              >
                <ToggleButton value="live">{t("loginLive")}</ToggleButton>
                <ToggleButton value="demo">{t("loginDemo")}</ToggleButton>
              </ToggleButtonGroup>
            </>
          }
        </Stack>
      </FormGroup>
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
