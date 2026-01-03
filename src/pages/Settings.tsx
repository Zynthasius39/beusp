import { AutoFixHigh, Edit, ExpandLess, ExpandMore, Security, Storage } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, Snackbar, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, checkResponseStatus } from "../utils/Api";
import { AlertSeverity } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { useAuth } from "../utils/Auth";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTranslation } from "react-i18next";
import { changeUiLang, UiLang } from "../utils/i18n";

type TmsLang = "en" | "az";
const tmsLangKeys = ["en", "az"] as const satisfies readonly TmsLang[];
const uiLangKeys = ["en-US", "az-AZ"] as const satisfies readonly UiLang[];

type SettingOptions = {
    tabOpen: "ui" | "sec" | "ser" | null
    pwdOpen: boolean,
    tmsLang: TmsLang,
    uiLang: UiLang,
}

export default function Settings() {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const [o, setO] = useState<SettingOptions>({
        tabOpen: null,
        pwdOpen: false,
        tmsLang: "en",
        uiLang: "az-AZ",
    })
    const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);
    const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const fetchCached = createFetchCached(logout);
    const fetch = createFetchWithAuth(logout);

    const updateO = <K extends keyof SettingOptions>(
        key: K,
        value: SettingOptions[K]
    ) => {
        setO(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const avatarStyle = {
        backgroundColor: "primary.dark",
        float: "left",
        mr: "1rem",
        width: "3.2rem",
        height: "3.2rem",
    }

    const iconStyle = {
        color: "primary.main",
        fontSize: "2rem",
    }

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

    const handleUiLangSelect = (e: SelectChangeEvent) => {
        updateO("uiLang", e.target.value as UiLang);
        changeUiLang(e.target.value as UiLang);
    }

    const handleServerLangSelect = (e: SelectChangeEvent) => {
        fetch(`${api}/settings`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lang: e.target.value
            }),
        }).then(response => {
            checkResponseStatus(response);
            getSettings();
        }).catch(e => {
            console.error(e);
            showAlert(t("error"), "error");
        })
    }

    const getSettings = () => {
        updateO("uiLang", localStorage.getItem("i18nextLng") as UiLang);
        fetchCached(`${api}/resource/home`, {
            method: "GET",
            credentials: "include",
        }, false).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).then(json => {
            updateO("tmsLang", json.lang);
        }).catch(e => {
            console.error(e);
            showAlert(t("error"), "error");
        })
    }

    useEffect(() => {
        getSettings();
    }, [])

    return (
        <>
            <Stack sx={{
                p: "0.4rem",
            }}>
                <Box m="1rem">
                    <Typography variant="h5">
                        {t("settingsWarning")}
                    </Typography>
                </Box>
                <List>
                    <ListItemButton onClick={() => updateO("tabOpen", o.tabOpen === "ui" ? null : "ui")}>
                        <ListItemIcon>
                            <Avatar sx={avatarStyle}>
                                <AutoFixHigh sx={iconStyle} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={t("settingsUi")} />
                        {o.tabOpen === "ui" ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={o.tabOpen === "ui"} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Divider sx={{ mb: "1rem" }} />
                            <ListItem secondaryAction={
                                <Select
                                    value={o.uiLang}
                                    onChange={handleUiLangSelect}
                                >
                                    {uiLangKeys.map(l =>
                                        <MenuItem value={l}>{t(l)}</MenuItem>
                                    )}
                                </Select>
                            }>
                                <ListItemText primary={t("settingsUiLang")} />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => updateO("tabOpen", o.tabOpen === "sec" ? null : "sec")}>
                        <ListItemIcon>
                            <Avatar sx={avatarStyle}>
                                <Security sx={iconStyle} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={t("settingsSec")} />
                        {o.tabOpen === "sec" ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={o.tabOpen === "sec"} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Divider sx={{ mb: "1rem" }} />
                            <ListItem secondaryAction={
                                <IconButton disabled onClick={_ => updateO("pwdOpen", true)}>
                                    <Edit />
                                </IconButton>
                            }>
                                <ListItemText primary={t("settingsSecPass")} />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => updateO("tabOpen", o.tabOpen === "ser" ? null : "ser")}>
                        <ListItemIcon>
                            <Avatar sx={avatarStyle}>
                                <Storage sx={iconStyle} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={t("settingsServer")} />
                        {o.tabOpen === "ser" ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={o.tabOpen === "ser"} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Divider sx={{ mb: "1rem" }} />
                            <ListItem secondaryAction={
                                <Select
                                    value={o.tmsLang}
                                    onChange={handleServerLangSelect}
                                >
                                    {tmsLangKeys.map((l, inx) =>
                                        <MenuItem value={l}>{t(uiLangKeys[inx])}</MenuItem>
                                    )}
                                </Select>
                            }>
                                <ListItemText primary={t("settingsServerLang")} />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Stack>
            <Dialog open={o.pwdOpen}>
                <DialogContent>
                    <DialogContentText>
                        {t("settingsSecPasText")}
                    </DialogContentText>
                    <DialogActions>
                        <Button>Cancel</Button>
                        <PrimaryButton>Update</PrimaryButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={alert != undefined}
            >
                {alert}
            </Snackbar>
        </>
    )
}
