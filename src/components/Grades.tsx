import { Autocomplete, Avatar, Checkbox, FormControlLabel, FormGroup, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { useAuth } from "../utils/Auth";
import { calculateSum, colorOfMark, gradeScale, gradeToMark } from "../utils/StudentLogic";
import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useNavigate } from "react-router-dom";
import { CourseJson, GradesJson } from "../utils/Interfaces";
import BotDialog from "./BotDialog";
import { Calculate } from "@mui/icons-material";
import { checkResponseStatus, fetchCached, UnauthorizedApiError, url } from "../utils/Api";

export default function Grades() {
  const { authed, logout } = useAuth();
  const { isDark } = useTheme();
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState("1");
  const [options, setOptions] = useState<{ [year: string]: boolean }>({});
  const [ssAvaliable, setSsAvaliable] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [oldScale, setOldScale] = useState(false);
  const [act3Enabled, setAct3Enabled] = useState(false);
  const [calcGrade, setCalcGrade] = useState(true);
  const [roundGrade, setRoundGrade] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradeTLoading, setGradeTLoading] = useState(true);
  const [gradesT, setGradesT] = useState<GradesJson | null>(null);
  const navigate = useNavigate();

  const tableCellStyle = {
    width: 35,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  }

  const getGrades = async () => {
    await fetchCached(`${url}/resource/grades`, {
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
      const options: { [year: string]: boolean } = {};
      if (json.canRequestAll)
        options["ALL"] = true;
      json.entries.forEach((o: { year: string, semester: number }) => {
        if (!options[o.year])
          options[o.year] = o.semester === 2;
      });
      const offset = options["ALL"] ? 2 : 1;
      const keys = Object.keys(options);
      setYear(keys[keys.length - offset]);
      setSemester(options[keys[keys.length - offset]] ? "2" : "1");
      setOptions(options);
      setGradesLoading(false);
    });
  }

  const getGradesTable = async (year: string, semester: string) => {
    await fetchCached(year === "ALL" ? `${url}/resource/grades/all` : `${url}/resource/grades/${year}/${semester}`, {
      method: "GET",
      credentials: "include",
    }).then(response => {
      checkResponseStatus(response);
      return response.json()
    }).catch(e => {
      if (e instanceof UnauthorizedApiError) {
        logout();
        navigate("/login");
      } else {
        console.error(e);
      }
    }).then(json => {
      setGradesT(json);
      setGradeTLoading(false);
    })
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

  const handleAct3Check = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setAct3Enabled(v);
  }

  useEffect(() => {
    if (authed && gradesT === null) {
      getGrades();
    }
  }, [authed])

  useEffect(() => {
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
  }, [year, semester]);

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
            <FormControlLabel control={<Checkbox checked={oldScale} onChange={handleScaleCheck} />} label="100-Point Scale" />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title="Round grades according to official grading scheme. (Only works with grades before new grading scale)">
            <FormControlLabel control={<Checkbox checked={roundGrade} onChange={handleRoundCheck} />} label="Round Grades" />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title="Automatically calculate entrance points">
            <FormControlLabel control={<Checkbox checked={calcGrade} onChange={handleCalcCheck} />} label="Calculate Grades" />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title="Show non-existing SDF3 grades">
            <FormControlLabel control={<Checkbox checked={act3Enabled} onChange={handleAct3Check} />} label="Show SDF3" />
          </Tooltip>
        </FormGroup>
        <BotDialog />
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
                  <TableCell sx={{ width: 35 }}>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell sx={{ width: 35 }}>ACT1</TableCell>
                  <TableCell sx={{ width: 35 }}>ACT2</TableCell>
                  {
                    act3Enabled &&
                    <TableCell sx={{ width: 35 }}>ACT3</TableCell>
                  }
                  <TableCell sx={{ width: 35 }}>ATT</TableCell>
                  <TableCell sx={{ width: 35 }}>IW</TableCell>
                  <TableCell sx={{ width: 35 }}>Exam</TableCell>
                  <TableCell sx={{ width: 35 }}>Sum</TableCell>
                  <TableCell sx={{ width: 35 }}>Mark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(gradesT || {}).map(([code, course]: [code: string, course: CourseJson]) => {
                  const courseG = gradeScale(course, oldScale, roundGrade);
                  return (
                    <TableRow>
                      <TableCell height={36}>{code}</TableCell>
                      <TableCell width={512}>{course.courseName}</TableCell>
                      <TableCell sx={tableCellStyle}>{courseG.act1 === -1 ? "" : courseG.act1}</TableCell>
                      <TableCell sx={tableCellStyle}>{courseG.act2 === -1 ? "" : courseG.act2}</TableCell>
                      {
                        act3Enabled &&
                        <TableCell sx={tableCellStyle}>{courseG.act3 === -1 ? "" : courseG.act3}</TableCell>
                      }
                      <TableCell sx={tableCellStyle}>{courseG.attendance === -1 ? "" : courseG.attendance}</TableCell>
                      <TableCell sx={tableCellStyle}>{courseG.iw === -1 ? "" : courseG.iw}</TableCell>
                      <TableCell sx={tableCellStyle}>{courseG.final === -1 ? "" : courseG.final}</TableCell>
                      <TableCell sx={tableCellStyle}>{calcGrade || courseG.final !== -1 ? calculateSum(course, roundGrade) : ""}</TableCell>
                      <TableCell>
                        <Paper elevation={5} sx={{ borderRadius: "50%", width: 40 }}>
                          <Avatar sx={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: colorOfMark(courseG.sum, !isDark()),
                            backgroundColor: colorOfMark(courseG.sum, isDark()),
                          }}
                          >
                            {gradeToMark(courseG.sum)}{calcGrade && courseG.sum === -1 && <Calculate sx={{
                              color: isDark() ? "#CCCCCC" : "#666666"
                            }} />}
                          </Avatar>
                        </Paper>
                      </TableCell>
                    </TableRow>)
                })}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </Stack >);
}
