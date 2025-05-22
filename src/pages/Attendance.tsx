import { Autocomplete, Checkbox, FormControlLabel, FormGroup, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { checkResponseStatus, fetchCached, url } from "../utils/Api";
import AttendanceTable from "../components/AttendanceTable";
import { AttendanceJson } from "../utils/Interfaces";

export default function Attendance() {
    const [year, setYear] = useState<string | null>(null);
    const [semester, setSemester] = useState("1");
    const [options, setOptions] = useState<{ [year: string]: boolean }>({});
    const [attAsm, setAttAsm] = useState(1);
    const [attLoading, setAttLoading] = useState(true);
    const [doAttAsm, setDoAttAsm] = useState(false);
    const [attdsT, setAttdsT] = useState<AttendanceJson | undefined>(undefined);

    const ssAvaliable = year ? options[year] : false;

    const getAttendances = async () => {
        await fetchCached(`${url}/resource/grades`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json();
        }).catch(e => {
            console.error(e);
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
        await fetch(`${url}/resource/attendance/${year}/${semester}`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            checkResponseStatus(response);
            return response.json()
        }).catch(e => console.error(e)
        ).then(json => {
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
        const targetValue = Number(e.target.value);
        if (!isNaN(targetValue))
            if (targetValue >= 0 && targetValue <= 30)
                setAttAsm(targetValue);
    }

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
                    <Tooltip title="Use old grading scale">
                        <FormControlLabel control={<Checkbox checked={doAttAsm} onChange={handlePredictAtt} />} label="Predict Absents" />
                    </Tooltip>
                    {
                        doAttAsm &&
                        <TextField
                            id="input-iwasm"
                            type="number"
                            placeholder="1"
                            value={attAsm}
                            onChange={handleAttAsm}
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
        </Stack>
    )
}
