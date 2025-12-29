import { Button, styled } from "@mui/material";

export const PrimaryButton = styled(Button, {
    name: 'PrimaryButton',
    slot: 'root',
})(({ theme }) => ({
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.primary.main,
    paddingLeft: 16,
    paddingRight: 16,
    fontWeight: "bolder",
    ":disabled": {
        backgroundColor: theme.palette.primaryButton.dark,
    },
    variant: "outlined"
}));
