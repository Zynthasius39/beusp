import { ClassTwoTone, ImportContactsTwoTone, SchoolTwoTone, TollTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "../utils/Theme";
import { cloneElement, useEffect, useState } from "react";
import { api, checkResponseStatus, UnauthorizedApiError } from "../utils/Api";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { useTranslation } from "react-i18next";

type DashboardProps = {
  dashLoading: boolean,
  classCount: number,
  totalCredits: number,
  gpa: number,
  eduDebt: string,
  homeTable: object | undefined,
}

const translateKeys = [
  "status"
]

const Dashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [p, setP] = useState<DashboardProps>({
    dashLoading: true,
    classCount: 0,
    totalCredits: 0,
    gpa: 0,
    eduDebt: "0 AZN",
    homeTable: undefined,
  });
  const fetchCached = createFetchCached(logout);

  const updateP = <K extends keyof DashboardProps>(
    key: K,
    value: DashboardProps[K]
  ) => {
    setP(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const infoCards = [
    { name: t("enrolledClasses"), value: p.classCount, icon: <ImportContactsTwoTone /> },
    { name: t("completedCredits"), value: p.totalCredits, icon: <TollTwoTone /> },
    { name: t("educationDebt"), value: p.eduDebt, icon: <ClassTwoTone /> },
    { name: t("gpa"), value: p.gpa, icon: <SchoolTwoTone /> },
  ]

  const cardRootStyle = {
    p: "1rem",
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    width: {
      xs: "100%",
      sm: "8rem",
    },
    gap: "0.2rem",
    flexDirection: {
      xs: "row",
      sm: "column",
    },
    justifyContent: {
      xs: "space-between",
      sm: "center",
    },
  }

  const infoCardStyle = {
    flexGrow: "1",
    flexDirection: {
      xs: "row",
      sm: "column",
    },
    alignItems: "center",
    justifyContent: {
      xs: "flex-start",
      sm: "center",
    },
    gap: "1rem",
  }

  const getTranscript = async () => {
    await fetchCached(`${api}/resource/transcript`, {
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
      updateP("classCount", Object.entries(json.semesters || {}).length);
      updateP("totalCredits", Number(json.totalEarnedCredits));
      // updateP("gpa", Number((Number(json.totalGpa || 0) / 100 * 4).toFixed(2)));
      updateP("gpa", Number(json.totalGpa));  // Traditional GPA
      updateP("dashLoading", false);
    })
  }

  const getHomeStudInfo = async () => {
    await fetchCached(`${api}/resource/home`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json();
    }).catch(e => {
      console.error(e);
      logout();
    }).then(json => {
      updateP("eduDebt", `${json.studentInfo.eduDebt.amount} AZN`);
      Object.entries(json.studentInfo)
        .filter(([_, value]) => (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ))
      updateP("homeTable", json.studentInfo);
    })
  }

  useEffect(() => {
    getTranscript();
    getHomeStudInfo();
  }, []);

  return (
    <Stack sx={{
      flexWrap: "wrap",
      flexDirection: "row",
    }}>
      <Stack sx={{
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "0.8rem",
        p: "1rem",
      }}>
        {infoCards.map((infoCard, inx) => (
          p.dashLoading ?
            <Skeleton key={inx} variant="rounded" sx={[cardRootStyle, {
              height: "11rem"
            }]} />
            :
            <Card key={inx} sx={cardRootStyle}>
              <Stack sx={infoCardStyle}>
                <Avatar sx={{
                  backgroundColor: theme.palette.primary.dark,
                  float: "left",
                  width: {
                    xs: "3.2rem",
                    sm: "4.6rem",
                  },
                  height: {
                    xs: "3.2rem",
                    sm: "4.6rem",
                  }
                }}>
                  {cloneElement(infoCard.icon, {
                    sx: {
                      color: "primary.main",
                      fontSize: {
                        xs: "2rem",
                        sm: "2.8rem",
                      }
                    }
                  })}
                </Avatar>
                <Typography fontSize="inherit" textAlign="center">{infoCard.name}</Typography>
              </Stack>
              <Typography fontSize="inherit" fontWeight="bold">{infoCard.value}</Typography>
            </Card>
        ))}
      </Stack>
      <TableContainer>
        <Table>
          <TableBody>
            {
              Object.entries(p.homeTable || {})
                .filter(([_, value]) => (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                ))
                .map(([key, value]) => {
                  var val;
                  if (typeof value === "boolean")
                    val = value ? t("yes") : t("no");
                  else if (value as String === "")
                    val = t("none");
                  else
                    val = value as String;
                  return [key, val];
                })
                .map(([key, value], inx) => (
                  <TableRow
                    key={inx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {t(key as string)}
                    </TableCell>
                    <TableCell align="right">{translateKeys.includes(key as string) ? t(value as string) : value}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Dashboard;
