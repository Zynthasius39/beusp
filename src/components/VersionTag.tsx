import { Typography, TypographyProps } from '@mui/material'

export default function VersionTag(props: TypographyProps) {
    return (
        <Typography
            {...props}
            sx={{
                fontFamily: "monospace",
                pl: 4,
                color: 'primary.main',
                fontSize: 25,
                PointerEvent: "none",
                ...props.sx
            }}
        >
            v{__APP_VERSION__}
        </Typography>
    )
}
