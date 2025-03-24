import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../Components";

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
                <DialogTitle>
                    Terms of Service
                </DialogTitle>
                <DialogContent>
                    Your credentials gets saved in plain text after you login.
                    Credentials will be used by bot to login into your account.
                    It's highly recommended to host your own instance for your own privacy.
                    This is a demo frontend for beusproxy project, not all of the features are present.
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