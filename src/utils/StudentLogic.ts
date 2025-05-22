import { green, red, yellow } from "@mui/material/colors";
import { ColorSeverity, GradeEntry } from "./Interfaces";
import { darkTheme, lightTheme } from "./Theme";

export const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        }
        reader.onerror = (error) => {
            reject(error);
        }
        reader.readAsDataURL(blob);
    });
};

export const gradeToMark = (grade: number) => {
    let mark;
    if (grade == -1) mark = " "
    else if (grade == 100) mark = "A+"
    else if (grade > 90) mark = "A"
    else if (grade > 80) mark = "B"
    else if (grade > 70) mark = "C"
    else if (grade > 60) mark = "D"
    else if (grade > 50) mark = "E"
    else mark = "F"
    return mark;
}

export const colorOfMark = (grade: number, isDark: boolean) => {
    let color;
    if (isDark) {
        if (grade == -1) color = "#202020"
        else if (grade == 100) color = "#149361"
        else if (grade > 90) color = "#4f9314"
        else if (grade > 80) color = "#789314"
        else if (grade > 70) color = "#8e9314"
        else if (grade > 60) color = "#936614"
        else if (grade > 50) color = "#935414"
        else if (grade > 40) color = "#931414"
    } else {
        if (grade == -1) color = "#dddddd"
        else if (grade == 100) color = "#80ea9e"
        else if (grade > 90) color = "#abea80"
        else if (grade > 80) color = "#c1ea80"
        else if (grade > 70) color = "#dcea80"
        else if (grade > 60) color = "#eade80"
        else if (grade > 50) color = "#eaa980"
        else if (grade > 40) color = "#ea8080"
    }
    return color;
}

export const gradeScale = (course: GradeEntry, oldScale: boolean, round: boolean): GradeEntry => {
    const act3_enabled = typeof course.act3 !== "undefined";
    const courseG = Object.assign({}, course);
    if (courseG.act1 !== -1)
        courseG.act1 = parseFloat((oldScale ? Math.round(courseG.act1 / (act3_enabled ? 10 : 15) * 100) : round ? gradeRound(courseG.act1) : courseG.act1).toFixed(2));
    if (courseG.act2 !== -1)
        courseG.act2 = parseFloat((oldScale ? Math.round(courseG.act2 / (act3_enabled ? 10 : 15) * 100) : round ? gradeRound(courseG.act2) : course.act2).toFixed(2));
    if (courseG.act3 !== -1 && act3_enabled)
        courseG.act3 = parseFloat((oldScale ? courseG.act3 * 10 : round ? gradeRound(courseG.act3) : courseG.act3).toFixed(2));
    if (courseG.attendance !== -1)
        courseG.attendance = parseFloat((oldScale ? courseG.attendance * 10 : round ? gradeRound(course.attendance) : courseG.attendance).toFixed(2));
    if (courseG.iw !== -1)
        courseG.iw = parseFloat((oldScale ? courseG.iw * 10 : round ? gradeRound(course.iw) : courseG.iw).toFixed(2));
    if (courseG.final !== -1)
        courseG.final = parseFloat((oldScale ? courseG.final * 2 : round ? gradeRound(course.final) : courseG.final).toFixed(2));
    return courseG;
}

export const calculateSum = (json: GradeEntry, round: boolean, act3Enabled: boolean) => {
    let grade;
    if (round) {
        grade = gradeRound(getValueNum(json.act1)) +
            gradeRound(getValueNum(json.act2)) +
            (act3Enabled ? gradeRound(getValueNum(isNaN(json.act3) ? 0 : json.act3)) : 0) +
            gradeRound(getValueNum(json.attendance)) +
            gradeRound(getValueNum(json.iw)) +
            gradeRound(getValueNum(json.final)
            );
    } else {
        grade = parseFloat((
            getValueNum(json.act1) +
            getValueNum(json.act2) +
            (act3Enabled ? getValueNum(isNaN(json.act3) ? 0 : json.act3) : 0) +
            getValueNum(json.attendance) +
            getValueNum(json.iw) +
            getValueNum(json.final)
        ).toFixed(2));
    }
    if (grade < 0)
        return 0;
    else
        return grade;
}

export const canPredictScholarship = (json: GradeEntry, act3Enabled: boolean): boolean => {
    if (getGradeValue(json.act1) === "") return false;
    if (getGradeValue(json.act2) === "") return false;
    if (getGradeValue(json.act3) === "" && act3Enabled) return false;
    if (getGradeValue(json.attendance) === "") return false;
    if (getGradeValue(json.iw) === "") return false;
    return true;
}

export const canPredictScholarshipNoIw = (json: GradeEntry, act3Enabled: boolean): boolean => {
    if (getGradeValue(json.act1) === "") return false;
    if (getGradeValue(json.act2) === "") return false;
    if (getGradeValue(json.act3) === "" && act3Enabled) return false;
    if (getGradeValue(json.attendance) === "") return false;
    if (getGradeValue(json.iw) !== "") return false;
    return true;
}

export const gradeRound = (grade: number) => {
    const fGrade = Math.floor(grade);
    if (grade - fGrade > 0.5)
        return Math.ceil(grade);
    else
        return fGrade;
}

export const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const isValidDcWebhook = (url: string) => {
    return /https:\/\/discord.com\/api\/webhooks\/\d{19}\/[-_a-zA-Z0-9]{68}\/?/.test(url);
}

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedSecs = secs.toString().padStart(2, '0');
    return `${mins}:${paddedSecs}`;
}

export const getGradeValue = (value: number): string => {
    if (typeof value === "undefined") return "";
    if (value === -1) return "";
    if (value === -2) return "Q";
    if (value === -3) return "ERR";
    return value.toString();
}

export const getValueNum = (value: number): number => {
    return value < 0 ? 0 : value;
}

export const pointsNeeded = (sum: number, category: "queen" | "rook" | "pawn"): number => {
    switch (category) {
        case "queen":
            return 91 - sum;
        case "rook":
            return 71 - sum;
        case "pawn":
            return 51 - sum;
    }
}

export const pointsNeededStr = (sum: number, category: "queen" | "rook" | "pawn"): string => {
    const needed = pointsNeeded(sum, category);
    return (needed === 50 ? "" : "+") + needed.toString();
}

export const pointNeedStyle = (sum: number, category: "queen" | "rook" | "pawn", isDark: boolean) => {
    const baseColors = pointNeedColors(sum, category, isDark);
    if (pointsNeeded(sum, category) > 50) {
        return { textDecoration: "line-through", color: baseColors.lost };
    }
    if (pointsNeeded(sum, category) > 44) {
        return { color: baseColors.hard };
    }
    if (pointsNeeded(sum, category) > 26) {
        return { color: baseColors.mid };
    }
    return { color: baseColors.easy };
}

export const pointNeedColors = (sum: number, category: "queen" | "rook" | "pawn", isDark: boolean) => {
    const theme = isDark ? darkTheme : lightTheme;
    const colors = isDark ?
        {
            lost: theme.palette.text.secondary,
            hard: red.A700,
            mid: yellow.A700,
            easy: green.A700,
        } :
        {
            lost: theme.palette.text.secondary,
            hard: red[500],
            mid: yellow[500],
            easy: green[500],
        };
    return {
        ...colors,
        fill: pointsNeeded(sum, category) > 50 ? theme.palette.text.disabled : theme.palette.text.primary,
    }
}

export const thresholdColor = (percent: number, warning?: number, critical?: number) => {
    let color = 'primary';
    if (warning !== undefined && percent >= warning)
        color = 'warning';
    if (critical !== undefined && percent >= critical)
        color = 'error';
    return color as ColorSeverity; 
}