import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { AttendanceCouples, AttendanceEntry, AttendanceJson, Order } from "../utils/Interfaces"
import { useState } from "react";
import { thresholdColor } from "../utils/StudentLogic";
import { AttendanceLinearProgress } from "./AttendanceLinearProgress";

interface AttendanceTableProps {
    attdsT: AttendanceJson | undefined,
    attAsm: number,
    attLoading: boolean,
    doAttAsm: boolean,
}

const attHeaders: Record<string, string> = {
    "courseCode": "Course Code",
    "courseName": "Course Name",
    "courseEducator": "Educator",
    "credit": "Credits",
    "atds": "Present count",
    "hours": "Hours",
    "limit": "Limit",
    "absent": "Absent count",
    "absentPercent": "%",
}

const attConfig = {
    base: 25,
    warning: 10,
    critical: 20,
}

const tableCellStyle = {
    width: 35,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof AttendanceEntry>('courseName');

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
        if (doAttAsm && courseCode === base) attdsGrouped[base][attdsGrouped[base].length - 1].absent += attAsm;
    });

    const sortedAttdsGrouped = Object.values(attdsGrouped ?? {}).slice().sort(getComparator(order, orderBy));

    return attLoading ?
        <Skeleton variant="rounded" animation="wave" sx={{
            maxWidth: "calc(100dvw - 32px)",
            height: 512
        }} />
        :
        <TableContainer sx={{
            overflow: "auto",
            maxWidth: "calc(100dvw - 32px)",
        }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            ["courseCode", "courseName", "courseEducator", "credit", "hours", "limit", "atds", "absent", "absentPercent"].map(h => {
                                return (
                                    <TableCell
                                        key={h}
                                        sx={[
                                            { width: 35, },
                                            !["courseCode", "courseName", "courseEducator"].includes(h) && tableCellStyle,
                                            h === "absentPercent" && { fontSize: 36 }
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
                                    <TableCell height={36}>{att.courseCode}</TableCell>
                                    <TableCell width={512}>{att.courseName}</TableCell>
                                    <TableCell width={512}>{att.courseEducator}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.credit}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.hours}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.limit}</TableCell>
                                    <TableCell sx={tableCellStyle}>{att.atds}</TableCell>
                                    <TableCell sx={[tableCellStyle, doAttAsm && inx === 0 && { color: thresholdColor(calcAbsentPercent, attConfig.warning, attConfig.critical) + '.main' }]}>{att.absent}</TableCell>
                                    <TableCell sx={[tableCellStyle, { minWidth: 170 }]}>
                                        {
                                            inx === 0 &&
                                            <AttendanceLinearProgress
                                                sx={{ height: 12, borderRadius: 4 }}
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
