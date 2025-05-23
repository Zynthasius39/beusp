import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "../utils/Theme";
import { NotificationsTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import { useEffect, useState } from "react";
import { checkResponseStatus, UnauthorizedApiError, url } from "../utils/Api";
import { createFetchCached } from "../features/FetchCached";

export default function Announces() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [announcesT, setAnnouncesT] = useState([]);
  const fetchCached = createFetchCached(logout);

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
      } else {
        console.error(e);
      }
    }).then(json => {
      setAnnouncesT(json);
    });
  }

  useEffect(() => {
    getAnnounces();
  }, []);

  return (<Stack p={1} gap={2}>
    {announcesT.map(({ body, name }, inx) => (
      <Card key={inx}>
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
        </Stack>
      </Card>
    ))}
  </Stack >);
}
