import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "../utils/Theme";
import { NotificationsTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import { getStudRes } from "../utils/StudentLogic";
import { useEffect, useState } from "react";

export default function Announces() {
  const { authed } = useAuth();
  const { theme } = useTheme();
  const [announcesT, setAnnouncesT] = useState([]);

  const getAnnounces = async () => {
    await getStudRes("announces");
    const json = JSON.parse(localStorage.getItem("announces") || "{}").announces;
    if (json != null) {
      setAnnouncesT(json);
    }
  }

  useEffect(() => {
    if (authed) {
      getAnnounces();
    }
  }, [authed]);

  return (<Stack p={1} gap={2}>
    {announcesT.map(({ body, name, date }) => (
      <Card>
        <Stack p={2} flexDirection="row" justifyContent="center" alignItems="center" gap={2} fontSize="12px">
          <Avatar sx={{
            backgroundColor: theme.palette.primary.dark
          }}>
            <NotificationsTwoTone />
          </Avatar>
          <Typography fontSize="inherit" width="100px">{name}</Typography>
          <Typography fontSize="inherit" flexGrow={1}>{body}</Typography>
          {/* <Typography fontSize="inherit">{date}</Typography> */}
        </Stack>
      </Card>
    ))}
  </Stack >);
}
