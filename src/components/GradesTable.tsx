import {
  Avatar,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { GradeEntry, GradesJson, Order } from "../utils/Interfaces";
import {
  calculateSum,
  canPredictScholarship,
  colorOfMark,
  getGradeValue,
  gradeScale,
  gradeToMark,
} from "../utils/StudentLogic";
import { useTheme } from "../utils/Theme";
import { Calculate } from "@mui/icons-material";
import GradesPopper from "./GradesPopper";
import { useTranslation } from "react-i18next";

interface GradesTableProps {
  doIwAsm: boolean;
  iwAsm: string;
  gradeTLoading: boolean;
  oldScale: boolean;
  calcGrade: boolean;
  roundGrade: boolean;
  act3Enabled: boolean;
  gradesT: GradesJson | undefined;
  calcAnchorEl: HTMLElement | null;
  setCalcAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}

function descendingComparator<GradeEntry>(
  a: GradeEntry,
  b: GradeEntry,
  orderBy: keyof GradeEntry,
) {
  if (orderBy === "mark")
    if (
      a["sum" as keyof GradeEntry] !== -1 &&
      b["sum" as keyof GradeEntry] !== -1
    )
      orderBy = "sum" as keyof GradeEntry;
    else orderBy = "calcSum" as keyof GradeEntry;
  if (orderBy === "sum" && a[orderBy] === -1 && b[orderBy] === -1)
    orderBy = "calcSum" as keyof GradeEntry;
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof GradeEntry>(
  order: Order,
  orderBy: Key,
): (a: GradeEntry, b: GradeEntry) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function GradesTable({
  doIwAsm,
  iwAsm,
  gradeTLoading,
  oldScale,
  calcGrade,
  roundGrade,
  act3Enabled,
  gradesT,
  calcAnchorEl,
  setCalcAnchorEl,
}: GradesTableProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [calcNeeded, setCalcNeeded] = useState<null | number>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof GradeEntry>("courseName");

  const courseHeaders: Record<string, string> = {
    courseCode: t("courseCode"),
    courseName: t("courseName"),
    act1: t("act1"),
    act2: t("act2"),
    act3: t("act3"),
    sem: t("sem"),
    att: t("att"),
    iw: t("iw"),
    final: t("final"),
    sum: t("sum"),
    mark: t("mark"),
  };

  const handleSort = (property: keyof GradeEntry) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const courseArr = Object.entries(gradesT ?? {}).map(([k, v]) => ({
    ...v,
    courseCode: k,
  }));
  courseArr.forEach((e) => {
    if (doIwAsm && e.iw === -1) e.iw = Number(iwAsm);
    e.calcSum = calculateSum(e, roundGrade, act3Enabled);
  });
  const sortedRows = courseArr.slice().sort(getComparator(order, orderBy));

  const tableCellStyle = {
    width: "2rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    // textAlign: "center",
  };

  const handleCalcClick = (e: MouseEvent<HTMLElement>, course: GradeEntry) => {
    setCalcNeeded(
      canPredictScholarship(course, act3Enabled)
        ? calculateSum(course, roundGrade, act3Enabled)
        : null,
    );
    setCalcAnchorEl(calcAnchorEl === e.currentTarget ? null : e.currentTarget);
  };

  return gradeTLoading ? (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{
        maxWidth: "calc(100dvw - 2rem)",
        height: "32rem",
      }}
    />
  ) : (
    <TableContainer
      sx={{
        overflow: "auto",
        maxWidth: "calc(100dvw - 2rem)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {[
              "courseCode",
              "courseName",
              "act1",
              "act2",
              "act3",
              "sem",
              "att",
              "iw",
              "final",
              "sum",
              "mark",
            ]
              .map((h) => {
                if (
                  !(h === "act3" && !act3Enabled) &&
                  !(h === "sem" && sortedRows[0].sem === undefined) &&
                  !(
                    h === "att" && sortedRows[0].att === undefined
                  )
                )
                  return (
                    <TableCell
                      key={h}
                      sx={[
                        { width: "2rem" },
                        h !== "courseCode" &&
                        h !== "courseName" &&
                        tableCellStyle,
                      ]}
                    >
                      <TableSortLabel
                        active={orderBy === h}
                        direction={orderBy === h ? order : "asc"}
                        onClick={() => handleSort(h as keyof GradeEntry)}
                      >
                        {courseHeaders[h] ?? h}
                      </TableSortLabel>
                    </TableCell>
                  );
              })
              .filter((x) => x !== undefined)}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((course, inx) => {
            const courseG = gradeScale(course, oldScale, roundGrade);
            return (
              <TableRow
                key={inx}
                sx={{
                  backgroundColor:
                    inx % 2 === 0 ? "background.paper" : "inherit",
                }}
              >
                <TableCell height="2.25rem">{course.courseCode}</TableCell>
                <TableCell width="32rem">{course.courseName}</TableCell>
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.act1)}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.act2)}
                </TableCell>
                {act3Enabled && (
                  <TableCell sx={tableCellStyle}>
                    {getGradeValue(courseG.act3)}
                  </TableCell>
                )}
                {courseG.sem !== undefined && (
                  <TableCell sx={tableCellStyle}>
                    {getGradeValue(courseG.sem)}
                  </TableCell>
                )}
                {courseG.att !== undefined && (
                  <TableCell sx={tableCellStyle}>
                    {getGradeValue(courseG.att)}
                  </TableCell>
                )}
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.iw)}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.final)}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {courseG.sum !== -1
                    ? courseG.sum
                    : calcGrade && getGradeValue(courseG.calcSum)}
                </TableCell>
                <TableCell>
                  <Stack sx={{ alignItems: "center" }}>
                    <Paper
                      elevation={5}
                      sx={{
                        borderRadius: "50%",
                        // width: "2.5rem"
                      }}
                    >
                      <Avatar
                        sx={{
                          // width: "2.5rem",
                          fontSize: "1.6rem",
                          fontWeight: "bold",
                          color: colorOfMark(courseG.sum, !isDark()),
                          backgroundColor: colorOfMark(courseG.sum, isDark()),
                        }}
                      >
                        {gradeToMark(courseG.sum)}
                        {calcGrade && courseG.sum === -1 && (
                          <IconButton
                            onClick={(e) => handleCalcClick(e, course)}
                          >
                            <Calculate
                              sx={{
                                color: isDark() ? "#CCCCCC" : "#666666",
                              }}
                            />
                          </IconButton>
                        )}
                      </Avatar>
                    </Paper>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <GradesPopper
        calcNeeded={calcNeeded}
        calcAnchorEl={calcAnchorEl}
        setCalcAnchorEl={setCalcAnchorEl}
      />
    </TableContainer>
  );
}
