export function exclude(data, keys) {
  if (data) {
    const exclude = (data) => {
      for (let key of keys) {
        delete data[key]
      }
      return data
    }
    if (typeof data === "string") {
      for (let key of keys) {
        data.replaceAll(key, "")
      }
    } else if (Array.isArray(data)) {
      return data.map(i => {
        return exclude(i);
      });
    } else {
      return exclude(data);
    }
  }
}

export const LOCATION = process.cwd();
export const PUBLIC_FOLDER = "public";
export const IMAGE_FOLDER = "image";
export const VIDEO_FOLDER = "video";
export const PUBLIC_LOCATION = LOCATION + "/" + PUBLIC_FOLDER + "/";
export const IMAGE_FOLDER_LOCATION = PUBLIC_LOCATION + IMAGE_FOLDER + "/";

// user
export const USER_FOLDER = "user";

export const USER_IMAGE_FOLDER = "/" + IMAGE_FOLDER + "/" + USER_FOLDER + "/";
export const USER_IMAGE_LOCATION = IMAGE_FOLDER_LOCATION + USER_FOLDER + "/";

//usereducation
export const EDUCATION = "education";

export const EDUCATION_IMAGE_FOLDER = "/" + IMAGE_FOLDER + "/" + EDUCATION + "/";
export const EDUCATION_IMAGE_LOCATION = IMAGE_FOLDER_LOCATION + EDUCATION + "/";