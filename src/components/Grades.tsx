import { Autocomplete, Avatar, Checkbox, FormControlLabel, FormGroup, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { useAuth } from "../utils/Auth";
import { calculateSum, colorOfMark, getStudGrades, getStudRes, getStudStatus, gradeScale, gradeToMark } from "../utils/StudentLogic";
import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useNavigate } from "react-router-dom";
import { CourseJson, GradesJson } from "../utils/Interfaces";
import BotDialog from "./BotDialog";
import { Calculate } from "@mui/icons-material";

export default function Grades() {
  const { authed, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState("1");
  const [options, setOptions] = useState<{ [year: string]: boolean }>({});
  const [ssAvaliable, setSsAvaliable] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [oldScale, setOldScale] = useState(false);
  const [calcGrade, setCalcGrade] = useState(true);
  const [roundGrade, setRoundGrade] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradeTLoading, setGradeTLoading] = useState(true);
  const [botEnabled, setBotEnabled] = useState(false);
  const [gradesT, setGradesT] = useState<GradesJson | null>(null);
  const navigate = useNavigate();

  const tableCellStyle = {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  }

  const getGrades = async () => {
    try {
      const json = await getStudRes("grades", false);
      console.log(json);
      if (json !== null) {
        const options: { [year: string]: boolean } = {};
        if (json.can_request_all)
          options["ALL"] = true;
        json.grade_options.forEach((o: { year: string, semester: string }) => {
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

  const handleSemesterBox = (_: MouseEvent<HTMLElement>, v: string) => {
    if (v !== null) {
      setSemester(v);
      setGradeTLoading(true);
    }
  }

  const handleYearBox = (_: SyntheticEvent, v: string) => {
    setYear(v);
    setGradeTLoading(true);
  };

  const handleScaleCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setOldScale(v);
  }

  const handleRoundCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setRoundGrade(v);
  }

  const handleCalcCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setCalcGrade(v);
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

  return (
    <Stack p={1} gap={2}>
      <Stack gap={2} flexDirection="row" alignItems="center" flexWrap="wrap">
        {
          gradesLoading ?
            <Skeleton variant="rounded" animation="wave" sx={{
              flexGrow: {
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
              sx={{
                flexGrow: {
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
      </Stack>
      <Stack gap={2} flexDirection="row" alignItems="center" flexWrap="wrap">
        <FormGroup>
          <Tooltip title="Use old grading scale">
            <FormControlLabel control={<Checkbox checked={oldScale} onChange={handleScaleCheck}/>} label="100-Point Scale" />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title="Round grades according to official grading scheme. (Only works with grades before new grading scale)">
          <FormControlLabel control={<Checkbox checked={roundGrade} onChange={handleRoundCheck}/>} label="Round Grades" />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title="Automatically calculate entrance points">
            <FormControlLabel control={<Checkbox checked={calcGrade} onChange={handleCalcCheck}/>} label="Calculate Grades" />
          </Tooltip>
        </FormGroup>
        <BotDialog botEnabled={botEnabled} setBotEnabled={setBotEnabled}/>
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
            maxWidth: "calc(100dvw - 32px)",
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
                  <TableCell>Sum</TableCell>
                  <TableCell>Mark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(gradesT || {}).map(([code, course]: [code: string, course: CourseJson]) =>
                  <TableRow>
                    <TableCell height={36}>{code}</TableCell>
                    <TableCell width={512}>{course.course_name}</TableCell>
                    <TableCell sx={tableCellStyle}>{gradeScale(course.act1, "act1", oldScale, roundGrade)}</TableCell>
                    <TableCell sx={tableCellStyle}>{gradeScale(course.act2, "act2", oldScale, roundGrade)}</TableCell>
                    <TableCell sx={tableCellStyle}>{gradeScale(course.att, "att", oldScale, roundGrade)}</TableCell>
                    <TableCell sx={tableCellStyle}>{gradeScale(course.iw, "iw", oldScale, roundGrade)}</TableCell>
                    <TableCell sx={tableCellStyle}>{gradeScale(course.final, "final", oldScale, roundGrade)}</TableCell>
                    <TableCell sx={tableCellStyle}>{calcGrade || course.final !== -1 ? calculateSum(course, roundGrade) : ""}</TableCell>
                    <TableCell><Avatar sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: colorOfMark(course.sum, isDark()),
                    }}>{gradeToMark(course.sum)}{calcGrade && course.sum === -1 && <Calculate />}</Avatar></TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </Stack >);
}
