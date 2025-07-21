import axios from "axios";
const imagekit_key = "cHJpdmF0ZV9JaHdLRmRJYTRNUWhxVXBDTHRUMk5VZTAxVFk9Og=="
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

// Convert base64 to File object
const base64ToFile = (base64String, fileName) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

// Upload single image to ImageKit
const uploadImage = async (imageData, fileName) => {
  try {
    const form = new FormData();

    // Convert base64 to file if needed
    let fileToUpload;
    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      fileToUpload = base64ToFile(imageData, fileName);
    } else {
      fileToUpload = imageData;
    }

    const uniqueFileName = generateUniqueFileName(fileName);

    form.append("file", fileToUpload);
    form.append("fileName", uniqueFileName);
    form.append("folder", "/News")

    const options = {
      method: "POST",
      url: "https://upload.imagekit.io/api/v1/files/upload",
      headers: {
        'Content-Type': 'multipart/form-data;',
        Accept: "application/json",
        Authorization: "Basic " + imagekit_key, // Replace with your actual auth token
      },
      data: form,
    };
    console.log(options.headers)

    const { data } = await axios.request(options);
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading image:", error.respo);
    throw error;
  }
};

export default uploadImage;
