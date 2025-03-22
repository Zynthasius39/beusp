import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Link,
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
import logo_dark from "../assets/beu_dark.svg";
import logo_light from "../assets/beu_light.svg";
import { MaterialUISwitch, PrimaryButton } from "../Components";
import { KeyboardEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import { checkResponseStatus, fetchCached, UnauthorizedApiError, url, verify } from "../utils/Api";


export default function Login() {
  const { theme, isDark, setDark } = useTheme();
  const { authed, login, logout, imageURL, name, verifiedAuth, setImage, setName } = useAuth();
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState("student");
  const [studentId, setStudentID] = useState(0);
  // const [pmsUsername, setPmsUsername] = useState(""); // Future use :P
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const getHome = () => {
    fetchCached(`${url}/resource/home`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json()
    }).then(json => {
      setName(json?.studentInfo?.fullNamePatronymic?.split(" ")[0]);
      getStudPhoto();
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    })
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleButtonGroup = useCallback(
    (_: MouseEvent<HTMLElement>, v: string) => {
      if (v !== null) {
        setAlignment(v);
      }
    },
    [],
  );

  const showAlert = useCallback((msg: string, severity: string) => {
    if (alert != undefined) {
      setAlert(undefined);
      clearTimeout(alertTimer.current);
    }
    setAlert(
      <Alert severity={severity as 'success' | 'error' | 'warning' | 'info'} sx={{ width: "100%" }}>
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
      getHome();
      navigate("/");
    } catch (e) {
      console.error("Error occured while authorizing:", e);
      showAlert("Invalid credentials", "error");
    }
  };

  const handleLogout = async () => {
    setStudentID(0);
    setPassword("");
    try {
      setImage("");
      await logout();
    } catch (e) {
      console.error("Error occured while authorizing:", e);
      showAlert("Couldn't log out:" + String(e), "error");
    }
  }

  const getStudPhoto = () => {
    fetchCached(`${url}/resource/studphoto`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "image/jpeg",
      },
    }).then(response => {
      checkResponseStatus(response);
      return response.blob()
    }).then(blob => {
      setImage(URL.createObjectURL(blob));
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    })
  }


  const getComponent = async () => {
    if (!await verify()) {
      logout();
    } else {
      verifiedAuth();
      await getHome();
      getStudPhoto();
    }
  }


  useEffect(() => {
    getComponent();
    clearTimeout(timer.current);
  }, [name, imageURL]);

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
                src={isDark() ? logo_light : logo_dark}
                width={24}
                style={{ backgroundColor: theme.palette.primary.main }}
              />
              <Typography variant="body1" id="logo-label">
                Baku Engineering University
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
            Login
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
                  {imageURL === "" ?
                    <Skeleton variant="circular" width="100px" height="100px" />
                    :
                    <Avatar alt="studphoto" src={imageURL} sx={{ width: "100px", height: "100px" }} />
                  }
                  <Typography variant="h5" pb="30px">{name}</Typography>
                  <Box>
                    <NavLink to="/">
                      <PrimaryButton disabled={loading} sx={{ width: "120px", mr: "10px" }}>Dashboard</PrimaryButton>
                    </NavLink>
                    <Button variant="outlined" onClick={handleLogout} sx={{ width: "120px" }}>Logout</Button>
                  </Box>
                </>
              }
            </Stack>
            :
            <>
              {alignment === "student" ? (
                <div>
                  <Typography variant="body2" id="login-label" pb="5px">
                    Student ID
                  </Typography>
                  <TextField
                    id="input-id"
                    type="number"
                    placeholder="220106099"
                    fullWidth={true}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      setStudentID(Number(e.target.value));
                    }}
                  />
                </div>
              ) : (
                <div>
                  <Typography variant="body2" id="login-label" pb="5px">
                    Username
                  </Typography>
                  <TextField
                    id="input-username"
                    type="text"
                    placeholder="ypiriyev"
                    fullWidth={true}
                    onKeyDown={handleKeyDown}
                  // onChange={(e) => {
                  //   setEduUsername(e.target.value);
                  // }}
                  />
                </div>
              )}
              <div>
                <Typography variant="body2" id="login-label" pb="5px">
                  Password
                </Typography>
                <TextField
                  id="input-pass"
                  type="password"
                  fullWidth={true}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <FormControlLabel control={<Checkbox />} label="Remember Me" />
              <Box sx={{ position: "relative" }}>
                <PrimaryButton
                  disabled={loading}
                  fullWidth
                  onClick={handleLogin}
                  sx={{
                    fontSize: 16,
                  }}
                >Login</PrimaryButton>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
              <Link href="#" underline="none" textAlign="center" fontSize={14}>
                Forgot your password?
              </Link>
              <Divider sx={{ pt: "5px", pb: "5px" }} />
              <ToggleButtonGroup
                fullWidth
                color="primary"
                value={alignment}
                onChange={handleButtonGroup}
                exclusive
                aria-label="account type"
              >
                <ToggleButton value="student">Student</ToggleButton>
                <ToggleButton value="educater">Educater</ToggleButton>
              </ToggleButtonGroup>
            </>
          }
        </Stack>
      </FormGroup>
      <Snackbar
        open={alert != undefined}
      >
        {alert}
      </Snackbar>
    </Stack>
  );
}
