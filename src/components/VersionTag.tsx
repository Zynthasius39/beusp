import { Typography, TypographyProps } from '@mui/material'

export default function VersionTag(props: TypographyProps) {
    return (
        <Typography
            {...props}
            sx={{
                fontFamily: "monospace",
                padding: "32px",
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
