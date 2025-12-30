import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { useTranslation } from "react-i18next";

export default function TosDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const [btn, setBtn] = useState(5);

    const handleContinueClick = () => {
        localStorage.setItem("tos", "true");
        setOpen(false);
    }

    useEffect(() => {
        if (btn === 0) return;

        const timer = setTimeout(() => {
            setBtn((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [btn]);

    if (localStorage.getItem("tos") === "true") {
        return;
    } else
        return (
            <Dialog open={open}
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundImage: "none",
                        backgroundColor: "background.default",
                    },
                }}>
                <DialogTitle variant="h4">
                    Terms of Service
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Your credentials gets saved in plain text after you login when using <b>LIVE</b> server!
                        Credentials will be used by bot to login into your account.
                        It's highly recommended to host your own instance for your own privacy.
                    </Typography>
                    <Typography>
                        You can also use <b>DEMO</b> mode to preview the page.
                        This is a demo frontend for beusproxy project, not all of the features are present.
                    </Typography>
                </DialogContent>
                <DialogActions style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 16
                }}>
                    <Button onClick={() => window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} variant="outlined">
                        {t("tosGmoh")}
                    </Button>
                    <PrimaryButton onClick={handleContinueClick} loading={btn > 0} disabled={btn > 0} loadingPosition="end">
                        {
                            btn > 0 ?
                                btn :
                                t("continue")
                        }
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        )
}