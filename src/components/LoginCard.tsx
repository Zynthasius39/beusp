import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormGroup,
    Skeleton,
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
import { AlertSeverity, ApiMode } from "../utils/Interfaces";
import { MaterialUISwitch } from "../components/MaterialUISwitch";
import { PrimaryButton } from "../components/PrimaryButton";
import { ServerFaultApiError, setApiMode, UnauthorizedApiError } from "../utils/Api";
import { useTranslation } from "react-i18next";

export default function LoginCard({ setAlert }: { setAlert: (alert: JSX.Element | undefined) => void }) {
    const { t } = useTranslation();
    const { theme, isDark, setDark } = useTheme();
    const { user, authed, login, logout, verify, getUser } = useAuth();
    const [alignment, setAlignment] = useState<ApiMode>("live");
    const [studentId, setStudentID] = useState(0);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
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
        if (authed)
            getUser();
        else
            verify();
    }, [authed])


    useEffect(() => {
        clearTimeout(timer.current);
        setAlignment(localStorage.getItem("offline_mode") === "1" ? "demo" : "live");
    }, []);

    return (
        <FormGroup>
            <Stack
                p="1.8rem"
                justifyContent="space-between"
                id="login-card"
                gap="0.8rem"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    backdropFilter: "blur(1rem)",
                    boxShadow: "0 0 2.5rem 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: 4,
                    width: "28rem",
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
                    <MaterialUISwitch
                        checked={isDark()}
                        onChange={(_, checked) => {
                            setDark(checked);
                            if (checked)
                                localStorage.setItem("theme", "dark");
                            else
                                localStorage.removeItem("theme");
                        }}
                        sx={{ mb: "0.5rem" }}
                    />
                </Stack>
                <Typography variant="h4" id="login-label" pt="0.25rem" pb="0.25rem">
                    {t("loginTitle")}
                </Typography>
                {authed ?
                    <Stack alignItems="center" gap="0.5rem">
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
                                        <Skeleton variant="circular" width="5rem" height="5rem" />
                                        :
                                        <Avatar alt="studphoto" src={user?.imageURL} sx={{ width: "7.5rem", height: "7.5rem" }} />
                                }
                                <Typography variant="h5" pb="1.5rem">{user?.name}</Typography>
                                <Box>
                                    <NavLink to="/">
                                        <PrimaryButton disabled={loading} sx={{ width: "7rem", mr: "1rem" }}>{t("dashboard")}</PrimaryButton>
                                    </NavLink>
                                    <Button variant="outlined" onClick={handleLogout} sx={{ width: "7rem" }}>{t("logout")}</Button>
                                </Box>
                            </>
                        }
                    </Stack>
                    :
                    <>
                        <div>
                            <Typography variant="body2" id="login-label" pb="0.35rem">
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
                            <Typography variant="body2" id="login-label" pb="0.35rem">
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
                                    fontSize: "1rem",
                                    mt: "0.2rem",
                                }}
                            >{t("loginButton")}
                                {loading && (
                                    <CircularProgress
                                        size="0.8rem"
                                        sx={{
                                            color: theme.palette.primary.main,
                                            position: 'absolute',
                                            right: '1rem',
                                        }}
                                    />
                                )}</PrimaryButton>
                        </Box>
                        {/* <Link href="#" underline="none" textAlign="center" fontSize={14}>
                {t("loginForgot")}
              </Link> */}
                        <Divider sx={{ pt: "0.25rem", pb: "0.25rem" }} />
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
    );
}
