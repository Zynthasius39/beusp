import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "../utils/Theme";
import { NotificationsTwoTone } from "@mui/icons-material";
import { useAuth } from "../utils/Auth";
import { getStudRes } from "../utils/StudentLogic";
import { useEffect, useState } from "react";

export default function Grades() {
  const { authed } = useAuth();
  const { theme } = useTheme();
  const [gradesT, setGradesT] = useState([]);

  const getGrades = async () => {
    await getStudRes("announces");
    const json = JSON.parse(localStorage.getItem("announces") || "{}").announces;
    if (json != null) {
      setGradesT(json);
    }
  }

  useEffect(() => {
    if (authed) {
      getGrades();
    }
  }, [authed]);

  return (<Stack p={1} gap={2}>
    {/* {gradesT.map(({ }) => (
        <Table>

        </Table>
    ))} */}
  </Stack >);
}
