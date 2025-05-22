import { DateCalendar } from "@mui/x-date-pickers";
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
import "../style/Dashboard.css";
import { cloneElement, useEffect, useState } from "react";
import { checkResponseStatus, UnauthorizedApiError, url } from "../utils/Api";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";

const Dashboard = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [dashLoading, setDashLoading] = useState(true);
  const [classCount, setClassCount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [eduDebt, setEduDebt] = useState("0 AZN");
  const [homeTable, setHomeTable] = useState<object | undefined>(undefined);
  const fetchCached = createFetchCached(logout);

  const infoCards = [
    { name: "Enrolled Classes", value: classCount, icon: <ImportContactsTwoTone /> },
    { name: "Completed Credits", value: totalCredits, icon: <TollTwoTone /> },
    { name: "Education Debt", value: eduDebt, icon: <ClassTwoTone /> },
    { name: "GPA", value: gpa, icon: <SchoolTwoTone /> },
  ]

  const cardRootStyle = {
    p: "15px",
    display: "flex",
    alignItems: "center",
    fontSize: {
      xs: "16px",
      sm: "17px",
    },
    width: {
      xs: "100%",
      sm: "150px",
    },
    height: {
      xs: "60px",
      sm: "150px",
    },
    gap: "20px",
    flexDirection: {
      xs: "row",
      sm: "column",
    },
    justifyContent: {
      xs: "space-between",
      sm: "center",
    },
    backgroundColor: theme.palette.background.paper,
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
    gap: "10px",
  }

  const getTranscript = async () => {
    await fetchCached(`${url}/resource/transcript`, {
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
      setClassCount(Object.entries(json.semesters || {}).length);
      setTotalCredits(Number(json.totalEarnedCredits));
      setGpa(Number((Number(json.totalGpa || 0) / 100 * 4).toFixed(2)));
      setDashLoading(false);
    })
  }

  const getHomeStudInfo = async () => {
    await fetchCached(`${url}/resource/home`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json();
    }).catch(e => {
      console.error(e);
    }).then(json => {
      setEduDebt(`${json.studentInfo.eduDebt.amount} AZN`);
      Object.entries(json.studentInfo)
        .filter(([_, value]) => (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ))
      setHomeTable(json.studentInfo);
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
        flex: "1 1 calc(50% - 150px)",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "10px",
        p: "10px",
      }}>
        {infoCards.map(infoCard => (
          <>
            {
              dashLoading ?
                <Skeleton variant="rounded" sx={cardRootStyle} />
                :
                <Card sx={cardRootStyle}>
                  <Stack sx={infoCardStyle}>
                    <Avatar className="card-logo" sx={{
                      backgroundColor: theme.palette.primary.dark, float: "left", width: {
                        xs: "32px",
                        sm: "64px",
                      },
                      height: {
                        xs: "32px",
                        sm: "64px",
                      }
                    }}>
                      {cloneElement(infoCard.icon, {
                        sx: {
                          color: theme.palette.primary.main, fontSize: {
                            xs: "18px",
                            sm: "36px",
                          }
                        }
                      })}
                    </Avatar>
                    <Typography fontSize="inherit" textAlign="center">{infoCard.name}</Typography>
                  </Stack>
                  <Typography fontSize="inherit" fontWeight="bold">{infoCard.value}</Typography>
                </Card>
            }
          </>
        ))}
      </Stack>
      <DateCalendar readOnly />
      <TableContainer>
        <Table>
          <TableBody>
            {
              Object.entries(homeTable || {})
                .filter(([_, value]) => (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                ))
                .map(([key, value]) => {
                  var val;
                  if (typeof value === "boolean")
                    val = value ? "Yes" : "No";
                  else if (value as String === "")
                    val = "None";
                  else
                    val = value as String;
                  return [key, val];
                })
                .map(([key, value], index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Dashboard;
