import { Button, styled } from "@mui/material";

export const PrimaryButton = styled(Button, {
    name: 'PrimaryButton',
    slot: 'root',
})(({ theme }) => ({
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.primary.main,
    // paddingLeft: "1rem",
    // paddingRight: "1rem",
    fontWeight: "bolder",
    ":disabled": {
        backgroundColor: theme.palette.primaryButton.dark,
    },
}));
