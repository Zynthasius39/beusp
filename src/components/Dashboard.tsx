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
import { getStudRes } from "../utils/StudentLogic";
import { useAuth } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { theme } = useTheme();
  const { authed, logout } = useAuth();
  const [dashLoading, setDashLoading] = useState(true);
  const [classCount, setClassCount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [eduDebt, setEduDebt] = useState("0 AZN");
  const navigate = useNavigate();

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
    await getStudRes("transcript", true);
    try {
      const homeJson = JSON.parse(localStorage.getItem("home") || "{}").home;
      if (homeJson != undefined) {
        Object.entries(homeJson.student_info).map(([key, value]) => {
          if (key.includes("Education debt")) {
            setEduDebt(String(value));
          }
        });
      }
      const json = JSON.parse(localStorage.getItem("transcript") || "{}").transcript;
      if (json != undefined) {
        setClassCount(Object.entries(json.semesters || {}).length);
        setTotalCredits(Number(json.total_earned_credits));
        setGpa(Number((Number(json.total_gpa || 0) / 100 * 4).toFixed(2)));
        setDashLoading(false);
      }
    } catch (e) {
      logout();
      navigate("/logout");
    }
  }

  const getHomeStudInfo = () => {
    const json = JSON.parse(localStorage.getItem("home") || "{}").home?.student_info;
    if (json != null) {
      return json;
    }
    return {};
  }

  useEffect(() => {
    if (authed) {
      getTranscript();
    }
  }, [authed]);

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
            {Object.entries(getHomeStudInfo()).map(([key, value]) => (
              <TableRow
                key={key.trim().replace(" ", "_").toLowerCase()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell align="right">{value as String}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Dashboard;
