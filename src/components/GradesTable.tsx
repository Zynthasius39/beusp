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
import { Order } from "../utils/Interfaces";
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

export type GradeEntry = {
  courseCode: string;
  courseName: string;
  act1: number;
  act2: number;
  act3: number;
  sem: number;
  att: number;
  iw: number;
  final: number;
  sum: number;
  calcSum: number;
  mark: string;
}

export type GradesJson = {
  [key: string]: GradeEntry;
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
  f,
  calcAnchorEl,
  setCalcAnchorEl
}: {
  f: GradesFilters,
  calcAnchorEl: HTMLElement | null,
  setCalcAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
}) {
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

  const courseArr = Object.entries(f.gradesT ?? {}).map(([k, v]) => ({
    ...v,
    courseCode: k,
  }));
  courseArr.forEach((e) => {
    if (f.doIwAsm && e.iw === -1) e.iw = Number(f.iwAsm);
    e.calcSum = calculateSum(e, f.roundGrade, f.act3Enabled);
  });
  const sortedRows = courseArr.slice().sort(getComparator(order, orderBy));

  const tableCellStyle = {
    width: "2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    p: "1rem",
    textAlign: "end",
  };

  const handleCalcClick = (e: MouseEvent<HTMLElement>, course: GradeEntry) => {
    setCalcNeeded(
      canPredictScholarship(course, f.act3Enabled)
        ? calculateSum(course, f.roundGrade, f.act3Enabled)
        : null,
    );
    setCalcAnchorEl(calcAnchorEl === e.currentTarget ? null : e.currentTarget);
  };

  return f.gradesTLoading ? (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{
        // maxWidth: "calc(100dvw - 2rem)",
        height: "32rem",
      }}
    />
  ) : (
    <TableContainer
      sx={{
        overflow: "auto",
        // maxWidth: "calc(100dvw - 2rem)",
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
              .map((h, inx) => {
                if (
                  !(h === "act3" && !f.act3Enabled) &&
                  !(h === "sem" && sortedRows[0].sem === undefined) &&
                  !(
                    h === "att" && sortedRows[0].att === undefined
                  )
                )
                  return (
                    <TableCell
                      key={h}
                      sx={[
                        { width: "2rem", p: 0 },
                        !["courseCode", "courseName"].includes(h) &&
                        tableCellStyle,
                        !["courseCode", "courseName", "mark"].includes(h) &&
                        { flexDirection: "row-reverse" },
                        h === "mark" &&
                        { textAlign: "center" },
                        inx === 0 &&
                        { pl: "2rem", minWidth: "8.6rem" },
                        inx === 1 &&
                        { minWidth: "16rem" },
                      ]}
                    >
                      <TableSortLabel
                        active={orderBy === h}
                        direction={orderBy === h ? order : "asc"}
                        onClick={() => h === "mark" ? handleSort("sum" as keyof GradeEntry) : handleSort(h as keyof GradeEntry)}
                        hideSortIcon={h === "mark"}
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
            const courseG = gradeScale(course, f.oldScale, f.roundGrade);
            return (
              <TableRow
                key={inx}
                sx={{
                  backgroundColor:
                    inx % 2 === 0 ? "background.paper" : "inherit",
                }}
              >
                <TableCell sx={{ pl: "2rem" }}>{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.act1)}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {getGradeValue(courseG.act2)}
                </TableCell>
                {f.act3Enabled && (
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
                    : f.calcGrade && getGradeValue(courseG.calcSum)}
                </TableCell>
                <TableCell sx={tableCellStyle}>
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
                          // height: "2.5rem",
                          fontSize: "1.6rem",
                          fontWeight: "bold",
                          color: colorOfMark(courseG.sum, !isDark()),
                          backgroundColor: colorOfMark(courseG.sum, isDark()),
                        }}
                      >
                        {gradeToMark(courseG.sum)}
                        {f.calcGrade && courseG.sum === -1 && (
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
