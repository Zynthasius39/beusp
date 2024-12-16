import { Menu } from "@mui/icons-material";
import { Box, IconButton, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import DrawerList from "./DrawerList";

const Drawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        size="large"
        edge="start"
        color="inherit"
        sx={{
          mr: 2,
          display: {
            sm: "block",
            md: "none",
          },
        }}
      >
        <Menu />
      </IconButton>
      <SwipeableDrawer
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <Box
          height={"100%"}
          width={300}
          role="application"
          onClick={toggleDrawer(false)}
        >
          <DrawerList />
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default Drawer;
