import { Autocomplete, Avatar, Checkbox, Fade, FormControlLabel, FormGroup, IconButton, Paper, Popper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { useAuth } from "../utils/Auth";
import { calculateSum, colorOfMark, gradeScale, gradeToMark, getValue, pointNeedStyle, pointsNeededStr, pointNeedColors, canPredictScholarship } from "../utils/StudentLogic";
import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTheme } from "../utils/Theme";
import { useNavigate } from "react-router-dom";
import { CourseJson, GradesJson } from "../utils/Interfaces";
import BotDialog from "./BotDialog";
import { ArrowRight, Calculate } from "@mui/icons-material";
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
  const [calcAnchorEl, setCalcAnchorEl] = useState<null | HTMLElement>(null);
  const [calcNeeded, setCalcNeeded] = useState<null | number>(null);
  const navigate = useNavigate();
  const calcOpen = Boolean(calcAnchorEl);

  const tableCellStyle = {
    width: 35,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  }

  const pointCellStyle = {
    ...tableCellStyle,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
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
    await fetch(year === "ALL" ? `${url}/resource/grades/all` : `${url}/resource/grades/${year}/${semester}`, {
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
    setCalcAnchorEl(null);
    setCalcGrade(v);
  }

  const handleAct3Check = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setAct3Enabled(v);
  }

  const handleCalcClick = (e: MouseEvent<HTMLElement>, sum: number | null) => {
    console.debug(sum);
    setCalcNeeded(sum);
    setCalcAnchorEl(calcAnchorEl === e.currentTarget ? null : e.currentTarget);
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
                      <TableCell sx={tableCellStyle}>{getValue(courseG.act1)}</TableCell>
                      <TableCell sx={tableCellStyle}>{getValue(courseG.act2)}</TableCell>
                      {
                        act3Enabled &&
                        <TableCell sx={tableCellStyle}>{getValue(courseG.act3)}</TableCell>
                      }
                      <TableCell sx={tableCellStyle}>{getValue(courseG.attendance)}</TableCell>
                      <TableCell sx={tableCellStyle}>{getValue(courseG.iw)}</TableCell>
                      <TableCell sx={tableCellStyle}>{getValue(courseG.final)}</TableCell>
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
                            {gradeToMark(courseG.sum)}{calcGrade && courseG.sum === -1 &&
                              <IconButton onClick={(e) => handleCalcClick(e, canPredictScholarship(courseG) ? calculateSum(course, roundGrade) : null)}>
                                <Calculate sx={{
                                  color: isDark() ? "#CCCCCC" : "#666666"
                                }} />
                              </IconButton>
                            }
                          </Avatar>
                        </Paper>
                      </TableCell>
                    </TableRow>)
                })}
              </TableBody>
            </Table>
          </TableContainer>
      }
      <Popper open={calcOpen} anchorEl={calcAnchorEl} transition>
        {({ TransitionProps }) => {
          if (calcNeeded === null)
            return (
              <Fade {...TransitionProps} timeout={350}>
                <Paper elevation={5} sx={{ p: 2 }}>
                  <Typography>
                    Can't predict scholarship points!
                    Not all grades are given.
                  </Typography>
                </Paper>
              </Fade>
            );
          const dark = isDark();
          const colors = {
            queen: pointNeedColors(calcNeeded, "queen", dark),
            rook: pointNeedColors(calcNeeded, "rook", dark),
            pawn: pointNeedColors(calcNeeded, "pawn", dark),
          };
          return (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={5}>
                <Stack sx={{ p: 2 }}>
                  <b>Scholarship points</b>
                  <Stack sx={{ ...pointCellStyle, ...pointNeedStyle(calcNeeded, "queen", dark) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.queen.fill}><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z" /></svg>
                    <Typography>{pointsNeededStr(calcNeeded, "queen")}</Typography>
                    <ArrowRight />
                    <Typography>Əlaçı</Typography>
                  </Stack>
                  <Stack sx={{ ...pointCellStyle, ...pointNeedStyle(calcNeeded, "rook", dark) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.rook.fill}><path d="M200-160h560v-80H200v80Zm132-160h296l-23-160H355l-23 160ZM120-80v-160q0-33 23.5-56.5T200-320h52l22-160H160v-80h640v80H686l22 160h52q33 0 56.5 23.5T840-240v160H120Zm151-480-71-320q33 25 68 47t77 22q40 0 73.5-20.5T480-880q28 28 61.5 48.5T615-811q42 0 77-22t68-47l-71 320h-82l39-173-7.5 1q-7.5 1-23.5 1-46 0-70.5-11T480-773q-29 20-62.5 31T349-731q-18 0-26.5-1l-8.5-1 39 173h-82Zm209 80Zm0-80Zm0 400Z" /></svg>
                    <Typography sx={pointNeedStyle(calcNeeded, "rook", dark)}>{pointsNeededStr(calcNeeded, "rook")}</Typography>
                    <ArrowRight />
                    <Typography>Zərbəçi</Typography>
                  </Stack>
                  <Stack sx={{ ...pointCellStyle, ...pointNeedStyle(calcNeeded, "pawn", dark) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.pawn.fill}><path d="M160-80v-200q88-60 129-125t56-115H240v-80h90q-14-22-22-47t-8-53q0-75 52.5-127.5T480-880q75 0 127.5 52.5T660-700q0 28-8 53t-22 47h90v80H615q15 50 56 115t129 125v200H160Zm80-80h480v-80q-92-72-133-148.5T532-520H428q-14 55-55 131.5T240-240v80Zm240-440q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm0 440Zm0-540Z" /></svg>
                    <Typography sx={pointNeedStyle(calcNeeded, "pawn", dark)}>{pointsNeededStr(calcNeeded, "pawn")}</Typography>
                    <ArrowRight />
                    <Typography>Adi</Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Stack >);
}
