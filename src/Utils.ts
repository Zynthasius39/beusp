import { fetchHome, fetchPhoto } from "./Api";

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

export const getHome = async () => {
    const json = await fetchHome();
    localStorage.setItem("studfullname", json["home"]["student_info"]["Name surname patronymic"]);
}

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
