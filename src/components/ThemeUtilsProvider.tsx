import { ReactNode, useCallback, useEffect, useState } from "react";
import { darkTheme, lightTheme, ThemeContext } from "../utils/Theme";
import { ThemeProvider } from "@mui/material";

export default function ThemeUtilsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState(lightTheme);

    const isDark = useCallback(() => {
        return theme === darkTheme;
    }, [theme]);

    const toggleTheme = useCallback(() => {
        if (isDark()) setTheme(darkTheme);
        else setTheme(darkTheme);
    }, [isDark]);

    const setDark = useCallback((dark: boolean) => {
        if (dark) setTheme(darkTheme);
        else setTheme(lightTheme);
    }, []);

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            setDark(true);
        }
    });

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setDark }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}