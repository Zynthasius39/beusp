import { Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material";
import { thresholdColor } from "../utils/StudentLogic";

const baseOfPercent = (percent: number, base: number | null) => (base !== null ? percent * 100 / base : percent);

export const AttendanceLinearProgress = (
  props: LinearProgressProps & {
    percent: number,
    percentNext: number,
    base: number | null,
    warning?: number,
    critical?: number,
    doAttAsm: boolean,
  }) => {
  const { percent, percentNext, base, warning, critical, doAttAsm, ...propsRest } = props;
  const color = thresholdColor(percentNext, warning, critical);
  return <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: '100%', mr: 1 }}>
      <LinearProgress
        {...propsRest}
        sx={{
          '& .MuiLinearProgress-dashed': {
            animation: 'none',
            backgroundImage: 'none',
          },
          '& .MuiLinearProgress-bar1Buffer': {
            borderRadius: 8
          },
          '& .MuiLinearProgress-bar2Buffer': {
            borderRadius: 8
          },
          height: 21,
          borderRadius: 8
        }}
        color={color}
        value={baseOfPercent(percent, base)}
        valueBuffer={baseOfPercent(percentNext, base)}
      />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography
        variant="body1"
        sx={{ color: doAttAsm ? color + '.main' : 'inherit' }}
      >{`${Math.round(percentNext)}%`}</Typography>
    </Box>
  </Box>
}
