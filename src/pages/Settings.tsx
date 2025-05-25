import { AutoFixHigh, Edit, ExpandLess, ExpandMore, Security, Storage } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, Snackbar, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, checkResponseStatus } from "../utils/Api";
import { AlertSeverity } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { useAuth } from "../utils/Auth";
import { PrimaryButton } from "../components/PrimaryButton";

export default function Settings() {
    const { logout } = useAuth();
    const [uiOpen, setUiOpen] = useState(false);
    const [secOpen, setSecOpen] = useState(false);
    const [serOpen, setSerOpen] = useState(false);
    const [pwdOpen, setPwdOpen] = useState(false);
    const [tmsLang, setTmsLang] = useState<"en" | "az">("en");
    const [alert, setAlert] = useState<JSX.Element | undefined>(undefined);
    const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const fetchCached = createFetchCached(logout);
    const fetch = createFetchWithAuth(logout);

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

    const handleTmsLangSelect = (e: SelectChangeEvent) => {
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
            showAlert("An error occurred", "error");
        })
    }

    const getSettings = () => {
        fetchCached(`${api}/resource/home`, {
            method: "GET",
            credentials: "include",
        }, false).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).then(json => {
            setTmsLang(json.lang);
        }).catch(e => {
            console.error(e);
            showAlert("An error occurred", "error");
        })
    }

    useEffect(() => {
        getSettings();
    }, [])

    return (
        <>
            <Stack flexDirection="row" flexWrap="wrap">
                <Box m={4} flexGrow={1}>
                    <Typography variant="h5">
                        Some settings may not work.
                    </Typography>
                </Box>
                <List sx={{
                    flexGrow: 2,
                }}>
                    <ListItemButton onClick={() => setUiOpen(!uiOpen)}>
                        <ListItemIcon>
                            <Avatar>
                                <AutoFixHigh />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="UI & Language" />
                        {uiOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={uiOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem sx={{ pl: 4 }} secondaryAction={
                                <PrimaryButton disabled>
                                    <Edit />
                                </PrimaryButton>
                            }>
                                <ListItemText primary="Interface language" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => setSecOpen(!secOpen)}>
                        <ListItemIcon>
                            <Avatar>
                                <Security />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Security & Privacy" />
                        {secOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={secOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem sx={{ pl: 4 }} secondaryAction={
                                <PrimaryButton disabled onClick={() => setPwdOpen(true)}>
                                    <Edit />
                                </PrimaryButton>
                            }>
                                <ListItemText primary="Password" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => setSerOpen(!serOpen)}>
                        <ListItemIcon>
                            <Avatar>
                                <Storage />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Server settings" />
                        {serOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={serOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem sx={{ pl: 4 }} secondaryAction={
                                <Select
                                    value={tmsLang}
                                    label="Age"
                                    onChange={handleTmsLangSelect}
                                >
                                    <MenuItem value={"az"}>Azerbaijani</MenuItem>
                                    <MenuItem value={"en"}>English</MenuItem>
                                </Select>
                            }>
                                <ListItemText primary="TMS Language" />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Stack>
            <Dialog open={pwdOpen}>
                <DialogContent>
                    <DialogContentText>
                        Be careful! You can get locked out of your account.
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
