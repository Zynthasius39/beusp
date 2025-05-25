import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";

export default function TosDialog() {
    const [open, setOpen] = useState(true);
    const [btn, setBtn] = useState(true);

    const handleContinueClick = () => {
        localStorage.setItem("tos", "true");
        setOpen(false);
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setBtn(false);
            clearInterval(timer);
        }, 5000);
    }, []);

    if (localStorage.getItem("tos") === "true") {
        return;
    } else
        return (
            <Dialog open={open}>
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
                <DialogActions>
                    <Button onClick={() => window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>
                        Get me out of here
                    </Button>
                    <PrimaryButton onClick={handleContinueClick} disabled={btn}>
                        Continue
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        )
}