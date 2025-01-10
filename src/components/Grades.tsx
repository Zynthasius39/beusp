import { Autocomplete, Avatar, FormControlLabel, FormGroup, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAuth } from "../utils/Auth";
import { colorOfMark, getStudGrades, getStudRes, getStudStatus, gradeToMark } from "../utils/StudentLogic";
import { useEffect, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useNavigate } from "react-router-dom";
import { validateSections } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";

export default function Grades() {
  const { authed, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [gradesT, setGradesT] = useState([]);
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState("1");
  const [options, setOptions] = useState<{[year: string]: boolean}>({});
  const [ssAvaliable, setSsAvaliable] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradeTLoading, setGradeTLoading] = useState(true);
  const [botEnabled, setBotEnabled] = useState(false);
  const navigate = useNavigate();

  const tableCellStyle = {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
  
  const getGrades = async () => {
    try {
      const json = await getStudRes("grades", false);
      console.log(json);
      if (json !== null) {
        const options: { [year: string]: boolean} = {};
        if (json.can_request_all)
          options["ALL"] = true;
        json.grade_options.forEach((o: {year: string, semester: string}) => {
          if (!options[o.year])
            options[o.year] = o.semester === "2";
        });
        const offset = options["ALL"] ? 2 : 1;
        const keys = Object.keys(options);
        setYear(keys[keys.length - offset]);
        setSemester(options[keys[keys.length - offset]] ? "2" : "1");
        setOptions(options);
        setGradesLoading(false);
      }
    } catch (e) {
      logout();
      navigate("/login");
    }
  }

  const getGradesTable = async (year: string, semester: string) => {
    const json = await getStudGrades(String(year), semester);
    if (json != null) {
      setGradesT(json.grades);
      setGradeTLoading(false);
    }
  }

  const getBotStatus = async () => {
    const json = await getStudStatus();
    if (json?.status.bot_enabled) {
      setBotEnabled(true);
    }
  }

  const handleSemesterBox = (_: React.MouseEvent<HTMLElement>, v: string) => {
    if (v !== null) {
      setSemester(v);
      setGradeTLoading(true);
    }
  }

  const handleYearBox = (_: React.SyntheticEvent, v: string) => {
    setYear(v);
    setGradeTLoading(true);
  };

  const handleBotSwitch = (_: React.MouseEvent<HTMLElement>, v: boolean) {
    //
    // SUBSCRIBE MENU
    //    Pop-up menu to re-enter credentials
    //
    setBotEnabled(v);
  }

  useEffect(() => {
    if (authed && Object.keys(options).length === 0) {
      getGrades();
      getBotStatus();
    }
    if (year !== null && semester !== null) {
      if (year === "ALL") {
        setIsAll(true);
      } else
        setIsAll(false);
      setSsAvaliable(options[year]);
      if (semester === "2" && !options[year])
        setSemester("1");
      else {
        getGradesTable(year, semester);
      }
    }
  }, [authed, year, semester]);

  return (<Stack p={1} gap={2}>
    <Stack gap={2} flexDirection="row" alignItems="center" flexWrap="wrap">
      {
        gradesLoading ?
        <Skeleton variant="rounded" animation="wave" sx={{ flexGrow: {
          xs: 0,
          sm: 1,
        },
        width: 96,
        height: 52
        }} />
        :
        <Autocomplete
          disablePortal
          options={Object.keys(options)}
          sx={{ flexGrow: {
            xs: 0,
            sm: 1,
          },
          width: 96
          }}
          onChange={handleYearBox}
          value={year || ""}
          disableClearable
          renderInput={(params) => <TextField {...params} label="Year" />}
        />
      }
        {
          !isAll &&
          <ToggleButtonGroup
            color="primary"
            value={semester}
            onChange={handleSemesterBox}
            exclusive
            aria-label="semester number"
          >
            <ToggleButton value="1" aria-label="first">
              1
            </ToggleButton>
            <ToggleButton value="2" aria-label="second" disabled={!ssAvaliable}>
              2
            </ToggleButton>
          </ToggleButtonGroup>
        }
        <FormGroup>
          <FormControlLabel control={<Switch />} checked={botEnabled} onChange={handleBotSwitch} label="BeuTMSBot v3" />
        </FormGroup>
    </Stack>
    {
      gradeTLoading ?
      <Skeleton variant="rounded" animation="wave" sx={{
        maxWidth: "calc(100dvw - 32px)",
        height: 512
      }} />
      :
      <TableContainer sx={{
        overflow: "auto",
        overflowY: "auto",
        maxWidth: "calc(100dvw - 32px)"
      }}>
        <Table>
          <TableHead>
              <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>SDF1</TableCell>
            <TableCell>SDF2</TableCell>
            <TableCell>ATT</TableCell>
            <TableCell>IW</TableCell>
            <TableCell>Exam</TableCell>
            <TableCell>Avg.</TableCell>
            <TableCell>Mark</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(gradesT).map(([code, course]) =>
            <TableRow>
              <TableCell height={36}>{code}</TableCell>
              <TableCell width={512}>{course.course_name}</TableCell>
              <TableCell sx={tableCellStyle}>{course.act1}</TableCell>
              <TableCell sx={tableCellStyle}>{course.act2}</TableCell>
              <TableCell sx={tableCellStyle}>{course.att}</TableCell>
              <TableCell sx={tableCellStyle}>{course.iw}</TableCell>
              <TableCell sx={tableCellStyle}>{course.final}</TableCell>
              <TableCell sx={tableCellStyle}>{course.sum}</TableCell>
              <TableCell><Avatar sx={{
                color: theme.palette.primary.contrastText,
                backgroundColor: colorOfMark(course.sum, isDark()),
              }}>{gradeToMark(course.sum)}</Avatar></TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    }
  </Stack >);
}
