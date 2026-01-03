import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Popover, TextField, Tooltip } from "@mui/material"
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GradesJson } from "./GradesTable";

export type GradesFilters = {
    isAll: boolean,
    semester: "1" | "2",
    oldScale: boolean,
    calcGrade: boolean,
    roundGrade: boolean,
    act3Enabled: boolean,
    ssAvaliable: boolean,
    gradesTLoading: boolean,
    gradesLoading: boolean,
    doIwAsm: boolean,
    iwAsm: string,
    year: string | null,
    gradesT: GradesJson | undefined,
    options: { [year: string]: boolean },
}

export const GradesFilter = ({
    f,
    updateF,
    setCalcAnchorEl,
}: {
    f: GradesFilters,
    updateF: <K extends keyof GradesFilters>(
        key: K,
        value: GradesFilters[K]
    ) => void,
    setCalcAnchorEl: (anchorEl: HTMLElement | null) => void,
}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleScaleCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        updateF("roundGrade", false);
        updateF("oldScale", v);
    };

    const handleRoundCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        updateF("roundGrade", v);
    };

    const handleCalcCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        setCalcAnchorEl(null);
        updateF("calcGrade", v);
    };

    const handleAct3Check = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        updateF("act3Enabled", v);
    };

    const handleDoIwAsm = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
        updateF("doIwAsm", v);
    };

    const handleIwAsm = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let input = e.target.value;

        if (!/^\d*$/.test(input)) return;

        if (input.length > 1 && input.startsWith("0")) {
            input = input.replace(/^0+/, "");
        }

        if (Number(input) <= 10) updateF("iwAsm", input);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let current = parseInt(f.iwAsm || "0", 10);

        if (e.key === "ArrowUp") {
            current = Math.min(current + 1, 10);
            updateF("iwAsm", String(current));
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            current = Math.max(current - 1, 0);
            updateF("iwAsm", String(current));
            e.preventDefault();
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Button
                aria-describedby={id}
                endIcon={<Visibility />}
                onClick={handleClick}
            >
                {t("filterLabel")}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <FormGroup sx={{
                    paddingBlock: "0.6rem",
                    paddingInline: "1.2rem"
                }}>
                    <Tooltip title={t("gradeOld")}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={f.oldScale} onChange={handleScaleCheck} />
                            }
                            label={t("gradeOldLabel")}
                        />
                    </Tooltip>
                    <Tooltip title={t("gradeRound")}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={f.roundGrade}
                                    onChange={handleRoundCheck}
                                    disabled={f.oldScale}
                                />
                            }
                            label={t("gradeRoundLabel")}
                        />
                    </Tooltip>
                    <Tooltip title={t("gradeCalc")}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={f.calcGrade} onChange={handleCalcCheck} />
                            }
                            label={t("gradeCalcLabel")}
                        />
                    </Tooltip>
                    <Tooltip title={t("gradeAct3")}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={f.act3Enabled} onChange={handleAct3Check} />
                            }
                            label={t("gradeAct3Label")}
                        />
                    </Tooltip>
                    <Tooltip title={t("gradeAssumeIw")}>
                        <FormControlLabel
                            control={<Checkbox checked={f.doIwAsm} onChange={handleDoIwAsm} />}
                            label={t("gradeAssumeIwLabel")}
                        />
                    </Tooltip>
                    {f.doIwAsm && (
                        <TextField
                            id="input-iwasm"
                            type="number"
                            placeholder="10"
                            value={f.iwAsm}
                            onChange={handleIwAsm}
                            onKeyDown={handleKeyDown}
                            sx={{
                                width: "3.2rem",
                                pt: "0.4rem",
                                pb: "0.8rem"
                            }}
                        />
                    )}
                </FormGroup>
            </Popover>
        </>
    );
}