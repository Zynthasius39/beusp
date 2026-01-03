import { styled, Switch } from "@mui/material";

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: 50,
    height: 27.4,
    padding: 5.7,
    "& .MuiSwitch-switchBase": {
      margin: 0.8,
      transform: "translateX(4.83px)",
      "&.Mui-checked": {
        transform: "translateX(17.74px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16.1" width="16.1" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            theme.palette.secondary.contrastText,
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
        },
      },
      "& .MuiSwitch-thumb": {
        width: 25.8,
        height: 25.8,
      },
    }
  },
  [theme.breakpoints.up("sm")]: {
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            theme.palette.secondary.contrastText,
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
        },
      },
    },
    "& .MuiSwitch-thumb": {
      width: 32,
      height: 32,
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 0,
    "&.Mui-checked": {
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.main,
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));