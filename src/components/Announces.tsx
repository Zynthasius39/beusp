import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "../utils/Theme";
import { NotificationsTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkResponseStatus, fetchCached, UnauthorizedApiError, url } from "../utils/Api";

export default function Announces() {
  const { authed, logout } = useAuth();
  const { theme } = useTheme();
  const [announcesT, setAnnouncesT] = useState([]);
  const navigate = useNavigate();

  const getAnnounces = async () => {
    await fetchCached(`${url}/resource/announces`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json();
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    }).then(json => {
      setAnnouncesT(json);
    });
  }

  useEffect(() => {
    if (authed) {
      getAnnounces();
    }
  }, [authed]);

  return (<Stack p={1} gap={2}>
    {announcesT.map(({ body, name }) => (
      <Card>
        <Stack p={2} flexDirection="row" justifyContent="center" alignItems="center" gap={2} fontSize="12px">
          <Stack flexDirection="row" width="200px" gap={2}>
            <Avatar sx={{
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.main,
            }}>
              <NotificationsTwoTone />
            </Avatar>
            <Typography fontSize="inherit" width={96} fontWeight="bold">{name}</Typography>
          </Stack>
          <Typography fontSize="inherit" flexGrow={1}>{body}</Typography>
          {/* <Typography fontSize="inherit">{date}</Typography> */}
        </Stack>
      </Card>
    ))}
  </Stack >);
}
