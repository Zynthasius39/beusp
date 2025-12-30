import { Autocomplete, Checkbox, FormControlLabel, FormGroup, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { ChangeEvent, KeyboardEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { api, checkResponseStatus } from "../utils/Api";
import AttendanceTable from "../components/AttendanceTable";
import { AttendanceJson } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { useTranslation } from "react-i18next";

export default function Attendance() {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const [year, setYear] = useState<string | null>(null);
    const [semester, setSemester] = useState("1");
    const [options, setOptions] = useState<{ [year: string]: boolean }>({});
    const [attAsm, setAttAsm] = useState('');
    const [attLoading, setAttLoading] = useState(true);
    const [doAttAsm, setDoAttAsm] = useState(false);
    const [attdsT, setAttdsT] = useState<AttendanceJson | undefined>(undefined);
    const fetchCached = createFetchCached(logout);
    const fetch = createFetchWithAuth(logout);

    const ssAvaliable = year ? options[year] : false;
    const maxAtt = 30;

    const getAttendances = async () => {
        await fetchCached(`${api}/resource/grades`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json();
        }).catch(e => {
            console.error(e);
            logout();
        }).then(json => {
            const options: { [year: string]: boolean } = {};
            json.entries.forEach((o: { year: string, semester: number }) => {
                if (!options[o.year])
                    options[o.year] = o.semester === 2;
            });
            const keys = Object.keys(options);
            setYear(keys[keys.length - 1]);
            setSemester(options[keys[keys.length - 1]] ? "2" : "1");
            setOptions(options);
            setAttLoading(false);
        });

    }

    const getAttendanceTable = async (year: string, semester: string) => {
        await fetch(`${api}/resource/attendance/${year}/${semester}`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).catch(e => {
            console.error(e);
            logout();
        }).then(json => {
            setAttdsT(json);
            setAttLoading(false);
        })

    };

    const handleSemesterBox = (_: MouseEvent<HTMLElement>, v: string) => {
        if (v !== null) {
            setSemester(v);
            setAttLoading(true);
        }
    }

    const handleYearBox = (_: SyntheticEvent, v: string) => {
        setYear(v);
        setAttLoading(true);
    };

    const handlePredictAtt = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        setDoAttAsm(v);
    }

    const handleAttAsm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let input = e.target.value;

        if (!/^\d*$/.test(input)) return;

        if (input.length > 1 && input.startsWith('0')) {
            input = input.replace(/^0+/, '');
        }

        if (Number(input) <= maxAtt)
            setAttAsm(input);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let current = parseInt(attAsm || '0', 10);

        if (e.key === 'ArrowUp') {
            current = Math.min(current + 1, 30);
            setAttAsm(String(current));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            current = Math.max(current - 1, 0);
            setAttAsm(String(current));
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (attdsT === undefined)
            getAttendances();
    }, [])

    useEffect(() => {
        if (year !== null && semester !== null) {
            if (semester === "2" && !options[year])
                setSemester("1");
            else {
                getAttendanceTable(year, semester);
            }
        }
    }, [year, semester]);

    return (
        <Stack p={1} gap={2}>
            <Stack gap={2} m={2} flexDirection="row" alignItems="center" flexWrap="wrap">
                {
                    attLoading ?
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            sx={{
                                width: 96,
                                height: 52
                            }}
                        />
                        :
                        <Autocomplete
                            disablePortal
                            options={Object.keys(options)}
                            sx={{ width: 96 }}
                            onChange={handleYearBox}
                            value={year || ""}
                            disableClearable
                            renderInput={(params) => <TextField {...params} label="Year" />}
                        />
                }
                {
                    attLoading ?
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            sx={{
                                width: 64,
                                height: 52
                            }}
                        />
                        :
                        (
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
                        )
                }
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                    <Tooltip title={t("gradeCalcTitle")}>
                        <FormControlLabel control={<Checkbox checked={doAttAsm} onChange={handlePredictAtt} />} label={t("gradeCalc")} />
                    </Tooltip>
                    {
                        doAttAsm &&
                        <TextField
                            id="input-iwasm"
                            type="text"
                            inputMode="numeric"
                            placeholder="1"
                            value={attAsm}
                            onChange={handleAttAsm}
                            onKeyDown={handleKeyDown}
                            sx={{ width: 49 }}
                        />
                    }
                </FormGroup>
            </Stack>
            <AttendanceTable
                attdsT={attdsT}
                attLoading={attLoading}
                attAsm={attAsm}
                doAttAsm={doAttAsm}
            />
        </Stack >
    )
}
