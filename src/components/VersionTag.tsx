import { Typography, TypographyProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface VersionTagProps extends TypographyProps {
    descMode?: "minimal" | "full";
}

export default function VersionTag({ descMode, ...props }: VersionTagProps) {
    const { t } = useTranslation();

    return (
        <Typography
            {...props}
            sx={{
                fontFamily: "monospace",
                fontSize: "1.4rem",
                PointerEvent: "none",
                ...props.sx
            }}
        >
            {
                descMode === "full"
                    ? `${t("githubSrc")} - v${__APP_VERSION__}`
                    : __APP_VERSION__
            }
        </Typography>
    )
}
