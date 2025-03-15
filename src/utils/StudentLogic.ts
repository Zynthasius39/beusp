import { fetchPhoto, fetchStudGrades, fetchStudRes, fetchStudStatus } from "./Api";
import { CourseJson } from "./Interfaces";

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

export const getPhoto = async () => {
    let photo64 = localStorage.getItem("studphoto");
    if (photo64 == null) {
        const blob = await fetchPhoto();
        photo64 = await convertBlobToBase64(blob)
        .then((base64String) => {
            return base64String;
        })
        .catch((error) => {
            console.error(error);
        }) as string;
        localStorage.setItem("studphoto", photo64);
    }
    return photo64;
};

export const getStudGrades = async (year: string, semester: string) => {
    const json = await fetchStudGrades(year, semester);
    return json;
}

export const getStudRes = async (res: string, cache: boolean) => {
    let json;
    if (cache) {
        json = localStorage.getItem(res);
        if (json == null) {
            json = await fetchStudRes(res)
            localStorage.setItem(res, JSON.stringify(json));
        }
    } else {
        json = await fetchStudRes(res);
    }
    return json;
}

export const getStudStatus = async () => {
    return await fetchStudStatus();
}

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

export const gradeScale = (course: CourseJson, oldScale: boolean, round: boolean): CourseJson => {
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

export const calculateSum = (json: CourseJson, round: boolean) => {
    let grade;
    if (round) {
        grade = gradeRound(json.act1) + 
        gradeRound(json.act2) +
        gradeRound(json.attendance) +
        gradeRound(json.iw) +
        gradeRound(json.final);
    } else {
        grade = parseFloat((json.act1 +
            json.act2 +
            json.attendance +
            json.iw +
            json.final).toFixed(2));
        }
    if (grade < 0)
        return 0;
    else
        return grade;
}

export const gradeRound = (grade: number) => {
    const fGrade = Math.floor(grade);
    if (grade - fGrade > 0.5)
        return Math.ceil(grade);
    else
        return fGrade;
}