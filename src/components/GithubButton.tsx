import { GitHub } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next";

function GithubButton() {
    const { t } = useTranslation();

    return (
        <Tooltip title={t("github")}>
            <IconButton
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/Zynthasius39/beusp"
            >
                <GitHub sx={{
                    fontSize: "2.4rem",
                }} />
            </IconButton>
        </Tooltip>
    )
}

export default GithubButton