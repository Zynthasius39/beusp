import { ClickAwayListener, Fade, Paper, Popper, Stack, Typography } from "@mui/material";
import { pointNeedColors, pointNeedStyle, pointsNeededStr } from "../utils/StudentLogic";
import { useTheme } from "../utils/Theme";
import { ArrowRight } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";

interface GradesPopperProps {
    calcNeeded: null | number,
    calcAnchorEl: null | HTMLElement,
    setCalcAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>,
}

export default function GradesPopper({ calcAnchorEl, calcNeeded, setCalcAnchorEl }: GradesPopperProps) {
    const { isDark } = useTheme();
    const calcOpen = Boolean(calcAnchorEl);

    const pointCellStyle = {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
    }

    return (
        <Popper open={calcOpen} anchorEl={calcAnchorEl} transition>
            {({ TransitionProps }) => {
                if (calcNeeded === null)
                    return (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper elevation={5} sx={{ p: 2, display: "flex", gap: 1, flexDirection: "column" }}>
                                <ClickAwayListener onClickAway={() => { setCalcAnchorEl(null) }}>
                                    <Typography>
                                        Can't predict scholarship points!
                                        Not all grades are given.
                                    </Typography>
                                </ClickAwayListener>
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
                            <ClickAwayListener
                                onClickAway={() => {
                                    setCalcAnchorEl(null);
                                }}
                            >
                                <Stack sx={{ p: 2 }}>
                                    <b>Scholarship points</b>
                                    <Stack sx={[pointCellStyle, pointNeedStyle(calcNeeded, "queen", dark)]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.queen.fill}><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z" /></svg>
                                        <Typography>{pointsNeededStr(calcNeeded, "queen")}</Typography>
                                        <ArrowRight />
                                        <Typography>Əlaçı</Typography>
                                    </Stack>
                                    <Stack sx={[pointCellStyle, pointNeedStyle(calcNeeded, "rook", dark)]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.rook.fill}><path d="M200-160h560v-80H200v80Zm132-160h296l-23-160H355l-23 160ZM120-80v-160q0-33 23.5-56.5T200-320h52l22-160H160v-80h640v80H686l22 160h52q33 0 56.5 23.5T840-240v160H120Zm151-480-71-320q33 25 68 47t77 22q40 0 73.5-20.5T480-880q28 28 61.5 48.5T615-811q42 0 77-22t68-47l-71 320h-82l39-173-7.5 1q-7.5 1-23.5 1-46 0-70.5-11T480-773q-29 20-62.5 31T349-731q-18 0-26.5-1l-8.5-1 39 173h-82Zm209 80Zm0-80Zm0 400Z" /></svg>
                                        <Typography sx={pointNeedStyle(calcNeeded, "rook", dark)}>{pointsNeededStr(calcNeeded, "rook")}</Typography>
                                        <ArrowRight />
                                        <Typography>Zərbəçi</Typography>
                                    </Stack>
                                    <Stack sx={[pointCellStyle, pointNeedStyle(calcNeeded, "pawn", dark)]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="46px" viewBox="0 -960 960 960" width="46px" fill={colors.pawn.fill}><path d="M160-80v-200q88-60 129-125t56-115H240v-80h90q-14-22-22-47t-8-53q0-75 52.5-127.5T480-880q75 0 127.5 52.5T660-700q0 28-8 53t-22 47h90v80H615q15 50 56 115t129 125v200H160Zm80-80h480v-80q-92-72-133-148.5T532-520H428q-14 55-55 131.5T240-240v80Zm240-440q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm0 440Zm0-540Z" /></svg>
                                        <Typography sx={pointNeedStyle(calcNeeded, "pawn", dark)}>{pointsNeededStr(calcNeeded, "pawn")}</Typography>
                                        <ArrowRight />
                                        <Typography>Adi</Typography>
                                    </Stack>
                                </Stack>
                            </ClickAwayListener>
                        </Paper>
                    </Fade >
                );
            }}
        </Popper >
    )
}
