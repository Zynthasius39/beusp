import { Autocomplete, Checkbox, FormControlLabel, FormGroup, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { ChangeEvent, KeyboardEvent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { api, checkResponseStatus } from "../utils/Api";
import AttendanceTable, { AttendanceJson } from "../components/AttendanceTable";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { useTranslation } from "react-i18next";

type AttendanceFilters = {
    year: string | null,
    semester: "1" | "2",
    options: { [year: string]: boolean },
    attAsm: string,
    attLoading: boolean,
    doAttAsm: boolean,
    attdsT: AttendanceJson | undefined,
}

export default function Attendance() {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const [f, setF] = useState<AttendanceFilters>({
        year: null,
        semester: "1",
        options: {},
        attAsm: "",
        attLoading: true,
        doAttAsm: false,
        attdsT: undefined,
    })
    const fetchCached = createFetchCached(logout);
    const fetch = createFetchWithAuth(logout);

    const ssAvaliable = f.year ? f.options[f.year] : false;
    const maxAtt = 30;

    const updateF = <K extends keyof AttendanceFilters>(
        key: K,
        value: AttendanceFilters[K]
    ) => {
        setF(prev => ({
            ...prev,
            [key]: value,
        }));
    };

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
            updateF("year", keys[keys.length - 1]);
            updateF("semester", options[keys[keys.length - 1]] ? "2" : "1");
            updateF("options", options);
            updateF("attLoading", false);
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
            updateF("attdsT", json);
            updateF("attLoading", false);
        })

    };

    const handleSemesterBox = (_: MouseEvent<HTMLElement>, v: "1" | "2") => {
        if (v !== null) {
            updateF("semester", v);
            updateF("attLoading", true);
        }
    }

    const handleYearBox = (_: SyntheticEvent, v: string) => {
        updateF("year", v);
        updateF("attLoading", true);
    };

    const handlePredictAtt = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        updateF("doAttAsm", v);
    }

    const handleAttAsm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let input = e.target.value;

        if (!/^\d*$/.test(input)) return;

        if (input.length > 1 && input.startsWith('0')) {
            input = input.replace(/^0+/, '');
        }

        if (Number(input) <= maxAtt)
            updateF("attAsm", input);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let current = parseInt(f.attAsm || '0', 10);

        if (e.key === 'ArrowUp') {
            current = Math.min(current + 1, 30);
            updateF("attAsm", String(current));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            current = Math.max(current - 1, 0);
            updateF("attAsm", String(current));
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (f.attdsT === undefined)
            getAttendances();
    }, [])

    useEffect(() => {
        if (f.year !== null && f.semester !== null) {
            if (f.semester === "2" && !f.options[f.year])
                updateF("semester", "1");
            else {
                getAttendanceTable(f.year, f.semester);
            }
        }
    }, [f.year, f.semester]);

    return (
        <Stack p="0.05rem" gap="0.1rem">
            <Stack
                sx={{
                    p: "0.4rem",
                    m: "1rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "& .MuiStack-root": {
                        gap: "1rem",
                        flexDirection: "row"
                    }
                }}
            >
                <Stack>
                    {
                        f.attLoading ?
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    width: "6rem",
                                    height: "3.25rem",
                                }}
                            />
                            :
                            <Autocomplete
                                disablePortal
                                options={Object.keys(f.options)}
                                sx={{ width: "6.4rem" }}
                                onChange={handleYearBox}
                                value={f.year || ""}
                                disableClearable
                                renderInput={(params) => <TextField {...params} label={t("courseYear")} />}
                            />
                    }
                    {
                        f.attLoading ?
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    width: "4rem",
                                    height: "3.25rem",
                                }}
                            />
                            :
                            (
                                <ToggleButtonGroup
                                    color="primary"
                                    value={f.semester}
                                    onChange={handleSemesterBox}
                                    exclusive
                                    aria-label="semester number"
                                    sx={{
                                        m: "0.2rem",
                                        "& .MuiToggleButton-root": {
                                            paddingInline: "1.2rem",
                                        }
                                    }}
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
                </Stack>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                    <Tooltip title={t("gradeCalcTitle")}>
                        <FormControlLabel control={<Checkbox checked={f.doAttAsm} onChange={handlePredictAtt} />} label={t("gradeCalc")} />
                    </Tooltip>
                    {
                        f.doAttAsm &&
                        <TextField
                            id="input-iwasm"
                            type="text"
                            inputMode="numeric"
                            placeholder="1"
                            value={f.attAsm}
                            onChange={handleAttAsm}
                            onKeyDown={handleKeyDown}
                            sx={{ width: 49 }}
                        />
                    }
                </FormGroup>
            </Stack>
            <AttendanceTable
                attdsT={f.attdsT}
                attLoading={f.attLoading}
                attAsm={f.attAsm}
                doAttAsm={f.doAttAsm}
            />
        </Stack >
    )
}
