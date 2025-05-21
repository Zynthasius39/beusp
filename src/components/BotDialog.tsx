import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, FormControlLabel, FormGroup, IconButton, LinearProgress, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { useAuth } from '../utils/Auth';
import { checkResponseStatus, fetchCached, NotFoundApiError, UnauthorizedApiError, url } from '../utils/Api';
import { Close, Email, Send, Telegram } from '@mui/icons-material';
import { formatTime, isValidDcWebhook, isValidEmail } from '../utils/StudentLogic';
import { PrimaryButton } from '../Components';
import { useNavigate } from 'react-router-dom';
import { BotInfoJson, BotSubsJson } from '../utils/Interfaces';
import { useTheme } from '../utils/Theme';

export default function BotDialog() {
    const { authed, logout } = useAuth();
    const { theme, isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [subs, setSubs] = useState<any | undefined>(undefined);
    const [botInfo, setBotInfo] = useState<BotInfoJson>({ botEmail: undefined, botTelegram: undefined });
    const [botEnabled, setBotEnabled] = useState(false);
    const [useEmail, setUseEmail] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [discord, setDiscord] = useState("");
    const [errField, setErrField] = useState({ error: false, helperText: "" });
    const [useDiscord, setUseDiscord] = useState(false);
    const [useTelegram, setUseTelegram] = useState(false);
    const [telegramCode, setTelegramCode] = useState<number | undefined>(undefined);
    const [verifyTimeout, setVerifyTimeout] = useState(0);
    const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const navigate = useNavigate();

    const handleClose = () => {
        clearInterval(timer.current);
        setIsOpen(false);
        setUseEmail(false);
        setVerifyEmail(false);
        setUseDiscord(false);
        setUseTelegram(false);
    };

    const handleUnsub = (service: "email" | "discord" | "telegram") => {
        fetch(`${url}/bot/subscribe`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                unsubscribe: [
                    service,
                ],
            }),
        }).then(response => {
            checkResponseStatus(response)
            getBotSubs();
        }).catch(e => {
            if (e instanceof UnauthorizedApiError) {
                logout();
                navigate("/login");
            } else {
                console.error(e);
                showAlert("An error occured", "error");
            }
        })
    }

    const handleEmailClick = () => {
        setIsOpen(false);
        setUseEmail(true);
    }

    const handleEmailSub = () => {
        if (isValidEmail(email)) {
            setVerifyTimeout(100);
            fetch(`${url}/bot/subscribe`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email
                }),
            }).then(response => {
                checkResponseStatus(response);
                return response.json();
            }).then(json => {
                if (json.emailSent)
                    setUseEmail(false);
                setVerifyEmail(true);
            }).catch(e => {
                clearInterval(timer.current);
                if (e instanceof UnauthorizedApiError) {
                    logout();
                    navigate("/login");
                } else {
                    console.error(e);
                    showAlert("An error occured", "error");
                }
            })
        } else {
            setErrField({ error: true, helperText: "Invalid E-mail address" });
        }
    }

    const handleEmailText = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (e.target.value.includes("@"))
            if (isValidEmail(e.target.value)) {
                setErrField({ error: false, helperText: "" });
            }
            else {
                setErrField({ error: true, helperText: "Invalid E-mail address" });
            }
        else
            setErrField({ error: false, helperText: "" });
    }

    const handleDiscordClick = () => {
        setIsOpen(false);
        setUseDiscord(true);
    }

    const handleDiscordText = (e: ChangeEvent<HTMLInputElement>) => {
        setDiscord(e.target.value);
        if (isValidDcWebhook(e.target.value))
            setErrField({ error: false, helperText: "" });
        else
            setErrField({ error: true, helperText: "Invalid URL" });
    }

    const handleDiscordSub = () => {
        if (isValidDcWebhook(discord))
            fetch(`${url}/bot/subscribe`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "discordWebhookUrl": discord,
                })
            }).then(response => {
                checkResponseStatus(response);
                getBotSubs();
                showAlert("Subscribed via Discord!", "success");
                handleClose();
            }).catch(e => {
                if (e instanceof UnauthorizedApiError) {
                    logout();
                    navigate("/login");
                } else {
                    console.error(e);
                    showAlert("An error occured", "error");
                }
            })
    }

    const handleTelegramClick = () => {
        setIsOpen(false);
        getTelegramCode();
        setVerifyTimeout(100);
        setUseTelegram(true);
    }

    const handleBotSwitch = (_: SyntheticEvent, __: boolean) => {
        setIsOpen(true);
    }

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

    const getBotInfo = () => {
        fetchCached(`${url}/bot`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).then((json: BotInfoJson) => {
            setBotInfo(json);
            setBotEnabled(true);
        }).catch(e => {
            if (e instanceof NotFoundApiError) {
                console.error(e);
                showAlert("Bot is offline", "error");
            } else if (e instanceof UnauthorizedApiError) {
                logout();
                navigate("/login");
            } else {
                console.error(e);
                showAlert("An error occured", "error");
            }
        })
    }

    const getBotSubs = () => {
        fetch(`${url}/bot/subscribe`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json();
        }).then((json: BotSubsJson) => {
            setSubs((prevSubs: any) => {
                if (json?.email && verifyEmail)
                    if (
                        prevSubs === null ||
                        prevSubs?.email !== json.email
                    ) {
                        showAlert("Subscribed via E-mail!", "success");
                        clearInterval(timer.current);
                        handleClose();
                    }
                if (json?.telegramUserId && useTelegram)
                    if (
                        prevSubs === null ||
                        prevSubs?.telegramUserId !== json.telegramUserId
                    ) {
                        showAlert("Subscribed via Telegram!", "success");
                        handleClose();
                    }
                return json;
            });
        }).catch(e => {
            if (e instanceof UnauthorizedApiError) {
                logout();
                navigate("/login");
            } else {
                console.error(e);
                showAlert("An error occured", "error");
            }
        })
    }

    const getTelegramCode = () => {
        fetch(`${url}/bot/subscribe`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                telegram: "",
            })
        }).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).then(json => {
            setTelegramCode(json?.telegramCode)
        }).catch(e => {
            if (e instanceof UnauthorizedApiError) {
                logout();
                navigate("/login");
            } else {
                console.error(e);
                showAlert("An error occured", "error");
            }
        })
    }

    useEffect(() => {
        if (authed) {
            getBotInfo();
            getBotSubs();
        }
    }, [authed])

    useEffect(() => {
        timer.current = setInterval(() => {
            setVerifyTimeout((prevTimeout) => prevTimeout - 100 / 60);
            if (Math.round(verifyTimeout) % 8 === 0)
                getBotSubs();
        }, 1000);

        if (verifyTimeout <= 0) {
            clearInterval(timer.current);
            if (useTelegram) {
                getTelegramCode();
                setVerifyTimeout(100);
            }
        }

        return () => {
            clearInterval(timer.current);
        }
    }, [verifyTimeout])

    return (
        <>
            <FormGroup>
                <Tooltip title="Subscribe to BeuTMSBot v3 to receive notification when there is an update in grades table via Discord, E-Mail">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={subs?.email || subs?.discordWebhookUrl || subs?.telegramUserId || false}
                                onChange={handleBotSwitch}
                            />}
                        disabled={!botEnabled}
                        label="BeuTMSBot v3"
                    />
                </Tooltip>
            </FormGroup>

            {/* Main Dialog */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
            >
                <DialogTitle>BeuTMSBot Subscriptions</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bot notifies you about changes to grades table. Select your choice of notification to create or update existing subscriptions. You can unsubscribe anytime you want.
                    </DialogContentText>
                    <List>
                        <ListItem
                            key="email"
                            secondaryAction={
                                <IconButton edge="end" aria-label="unsubscribe" onClick={() => handleUnsub("email")}>
                                    {
                                        subs?.email &&
                                        <Close />
                                    }
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={handleEmailClick}>
                                <ListItemIcon>
                                    <Email />
                                </ListItemIcon>
                                <ListItemText
                                    primary="E-Mail"
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key="discord"
                            secondaryAction={
                                <IconButton edge="end" aria-label="unsubscribe" onClick={() => handleUnsub("discord")}>
                                    {
                                        subs?.discordWebhookUrl &&
                                        <Close />
                                    }
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={handleDiscordClick}>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50" fill={isDark() ? theme.palette.text.primary : theme.palette.text.secondary}>
                                        <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
                                    </svg>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Discord Webhook"
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key="telegram"
                            secondaryAction={
                                <IconButton edge="end" aria-label="unsubscribe" onClick={() => handleUnsub("telegram")}>
                                    {
                                        subs?.telegramUserId &&
                                        <Close />
                                    }
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={handleTelegramClick}>
                                <ListItemIcon>
                                    <Telegram />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Telegram"
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog >

            {/* Email Subscription Dialog */}
            < Dialog
                open={useEmail}
                onClose={handleClose}
            >
                <DialogTitle>Email Subscription</DialogTitle>
                <DialogContent>
                    <DialogContentText>We will send a verification email to you</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="E-mail"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={handleEmailText}
                        error={errField.error}
                        helperText={errField.helperText}
                        value={email}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <PrimaryButton
                        onClick={handleEmailSub}
                    >
                        Subscribe
                    </PrimaryButton>
                </DialogActions>
            </Dialog >
            <Dialog
                open={verifyEmail}
                onClose={handleClose}
            >
                <DialogTitle>Email Verification</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please check your email. If you haven't received one, you can send again later. Updating with the existing email doesn't count as an update.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <PrimaryButton
                        onClick={handleEmailSub}
                        endIcon={<Send />}
                        disabled={Math.round(verifyTimeout) != 0}
                    >
                        {Math.round(verifyTimeout) !== 0 ? formatTime(Math.round(verifyTimeout * 0.6)) : "Send"}
                    </PrimaryButton>
                </DialogActions>
            </Dialog>

            {/* Discord Subscription Dialog */}
            <Dialog
                open={useDiscord}
                onClose={handleClose}
            >
                <DialogTitle>Discord Webhook Subscription</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Be careful!
                        Your grades will be sent to this webhook.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="URL"
                        type="url"
                        fullWidth
                        variant="standard"
                        onChange={handleDiscordText}
                        error={errField.error}
                        helperText={errField.helperText}
                        value={discord}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <PrimaryButton
                        onClick={handleDiscordSub}
                    >
                        Subscribe
                    </PrimaryButton>
                </DialogActions>
            </Dialog >

            {/* Telegram Subscription Dialog */}
            <Dialog
                open={useTelegram}
                onClose={handleClose}
            >
                <DialogTitle>Telegram Subscription</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You need to be verified in telegram bot. Verification checking can take a while. Updating with the existing telegram account doesn't count as an update.
                    </DialogContentText>
                    <Stack alignItems="center" gap={2} pt={4}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'inline-flex',
                            }}
                        >
                            <LinearProgress
                                variant="determinate"
                                value={Math.round(verifyTimeout)}
                                sx={{
                                    width: {
                                        xs: "128px",
                                        sm: "256px",
                                    },
                                    height: {
                                        xs: "32px",
                                        sm: "64px",
                                    },
                                    p: {
                                        xs: 2,
                                        sm: 4,
                                    },
                                    borderRadius: 6,
                                }}
                            />
                            <Typography sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: {
                                    xs: 32,
                                    sm: 64,
                                },
                                fontWeight: "bolder",
                                fontFamily: "monospace",
                                letterSpacing: {
                                    xs: 4,
                                    sm: 8,
                                },
                                borderRadius: 4,
                            }}>
                                {telegramCode}
                            </Typography>
                        </Box>
                        <Link
                            href={`https://t.me/${botInfo.botTelegram}`} fontSize={{
                                xs: 20,
                                sm: 32,
                            }}
                            target="_blank" rel="noreferrer" underline="none">
                            @{botInfo.botTelegram}
                        </Link>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog >

            <Snackbar
                open={alert != undefined}
            >
                {alert}
            </Snackbar>
        </>
    );
}