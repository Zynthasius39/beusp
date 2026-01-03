import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { Order } from "../utils/Interfaces"
import { useState } from "react";
import { thresholdColor } from "../utils/StudentLogic";
import { AttendanceLinearProgress } from "./AttendanceLinearProgress";
import { useTranslation } from "react-i18next";

type AttendanceEntry = {
    absent: number;
    absentPercent: number;
    atds: number;
    courseEducator: string;
    courseCode: string;
    courseName: string;
    credit: string;
    hours: number;
    limit: number;
}


type AttendanceCouples = Record<
    string,
    (AttendanceEntry & { courseCode: string })[]
>;

export type AttendanceJson = {
    [key: string]: AttendanceEntry;
}

interface AttendanceTableProps {
    attdsT: AttendanceJson | undefined,
    attAsm: string,
    attLoading: boolean,
    doAttAsm: boolean,
}

const attConfig = {
    base: 25,
    warning: 10,
    critical: 20,
}

const tableCellStyle = {
    width: "2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    p: "1rem",
    textAlign: "end",
}

export function descendingComparator(a: AttendanceEntry[], b: AttendanceEntry[], orderBy: keyof AttendanceEntry) {
    if (a.length > 1 && b.length > 1) {
        if (b[1][orderBy] < a[1][orderBy]) return -1;
        if (b[1][orderBy] > a[1][orderBy]) return 1;
        if (b[1][orderBy] === a[1][orderBy]) {
            if (b[0][orderBy] < a[0][orderBy]) return -1;
            if (b[0][orderBy] > a[0][orderBy]) return 1;
            return 0;
        }
        return 0;
    } else if (a.length > 1) {
        if (b[0][orderBy] < a[1][orderBy]) return -1;
        if (b[0][orderBy] > a[1][orderBy]) return 1;
        return 0;
    } else if (b.length > 1) {
        if (b[1][orderBy] < a[0][orderBy]) return -1;
        if (b[1][orderBy] > a[0][orderBy]) return 1;
        return 0;
    } else {
        if (b[0][orderBy] < a[0][orderBy]) return -1;
        if (b[0][orderBy] > a[0][orderBy]) return 1;
        return 0;
    }
}

export function getComparator<Key extends keyof AttendanceEntry>(
    order: Order,
    orderBy: Key
): (a: AttendanceEntry[], b: AttendanceEntry[]) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function AttendanceTable({ attdsT, attLoading, attAsm, doAttAsm }: AttendanceTableProps) {
    const { t } = useTranslation();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof AttendanceEntry>('courseName');

    const attHeaders: Record<string, string> = {
        "courseCode": t("courseCode"),
        "courseName": t("courseName"),
        "courseEducator": t("courseEducator"),
        "credit": t("credit"),
        "atds": t("atds"),
        "hours": t("hours"),
        "limit": t("limit"),
        "absent": t("absent"),
        "absentPercent": t("absentPercent"),
    }

    let count = 0;
    const handleSort = (property: keyof AttendanceEntry) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const attdsGrouped: AttendanceCouples = {};
    Object.entries(attdsT ?? {}).forEach(([courseCode, att]) => {
        const base = courseCode.split('-')[0];
        if (!attdsGrouped[base]) attdsGrouped[base] = [];
        attdsGrouped[base].push({ ...att, courseCode });
    });

    Object.keys(attdsGrouped ?? {}).forEach(courseCode => {
        if (doAttAsm)
            attdsGrouped[courseCode][0].absent += Number(attAsm);
    })

    const sortedAttdsGrouped = Object.values(attdsGrouped ?? {}).slice().sort(getComparator(order, orderBy));

    return attLoading ?
        <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
                height: "32rem",
            }} />
        :
        <TableContainer sx={{
            overflow: "auto",
        }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            ["courseCode", "courseName", "courseEducator", "credit", "hours", "limit", "atds", "absent", "absentPercent"].map((h, inx) => {
                                return (
                                    <TableCell
                                        key={h}
                                        sx={[
                                            { width: "2rem", p: 0 },
                                            !["courseCode", "courseName", "courseEducator"].includes(h) && tableCellStyle,
                                            !["courseCode", "courseName", "courseEducator"].includes(h) &&
                                            { flexDirection: "row-reverse" },
                                            h === "absentPercent" && { fontSize: "2rem" },
                                            inx === 0 &&
                                            { pl: "2rem", minWidth: "8.6rem" },
                                            inx === 1 &&
                                            { minWidth: "16rem" },
                                        ]}
                                    >
                                        <TableSortLabel
                                            active={orderBy === h}
                                            direction={orderBy === h ? order : "asc"}
                                            onClick={() => handleSort(h as keyof AttendanceEntry)}
                                        >
                                            {attHeaders[h]}
                                        </TableSortLabel>
                                    </TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        sortedAttdsGrouped?.map(attds => {
                            const init = { hours: 0, absent: 0 };
                            attds.forEach(att => {
                                init.hours += att.hours;
                                init.absent += att.absent;
                            });
                            const preAbsentPercent = Math.ceil(init.absent / init.hours * 100);
                            const calcAbsentPercent = preAbsentPercent >= 25 ? 25 : preAbsentPercent;
                            return attds.map((att, inx) =>
                                <TableRow key={count} sx={{ backgroundColor: count++ % 2 === 0 ? 'background.paper' : 'inherit' }}>
                                    <TableCell sx={{ pl: "2rem" }}>{att.courseCode}</TableCell>
                                    <TableCell sx={{ p: 0, paddingBlock: "0.8rem", pr: "0.8rem" }}>{att.courseName}</TableCell>
                                    <TableCell sx={{ p: 0, paddingBlock: "0.8rem", pr: "0.8rem" }}>{att.courseEducator}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.credit}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.hours}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.limit}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.atds}</TableCell>
                                    <TableCell sx={[tableCellStyle, doAttAsm && inx === 0 && { color: thresholdColor(calcAbsentPercent, attConfig.warning, attConfig.critical) + '.main' }]}>{att.absent}</TableCell>
                                    <TableCell sx={[tableCellStyle, { minWidth: 170 }]}>
                                        {
                                            inx === 0 &&
                                            <AttendanceLinearProgress
                                                variant="buffer"
                                                percentNext={calcAbsentPercent}
                                                percent={att.absentPercent}
                                                base={attConfig.base}
                                                warning={attConfig.warning}
                                                critical={attConfig.critical}
                                                doAttAsm={doAttAsm}
                                            />
                                        }
                                    </TableCell>
                                </TableRow>)
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
}
