import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "../utils/Theme";
import { NotificationsTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import { useEffect, useState } from "react";
import { api, checkResponseStatus, UnauthorizedApiError } from "../utils/Api";
import { createFetchCached } from "../features/FetchCached";

export default function Announces() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [announcesT, setAnnouncesT] = useState([]);
  const fetchCached = createFetchCached(logout);

  const getAnnounces = async () => {
    await fetchCached(`${api}/resource/announces`, {
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
        logout();
      }
    }).then(json => {
      setAnnouncesT(json);
    });
  }

  useEffect(() => {
    getAnnounces();
  }, []);

  return (
    <Stack p="0.7rem" gap="0.7rem">
      {announcesT.map(({ body, name }, inx) => (
        <Card key={inx}>
          <Stack
            sx={{
              p: "1.2rem",
              fontSize: "1rem",
              gap: "0.8rem",
            }}
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              gap="1rem"
            >
              <Avatar
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.main,
                }}
              >
                <NotificationsTwoTone />
              </Avatar>
              <Typography
                fontSize="inherit"
                fontWeight="bold"
              >
                {name}
              </Typography>
            </Stack>
            <Typography
              fontSize="inherit"
            >
              {body}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Stack >
  );
}
