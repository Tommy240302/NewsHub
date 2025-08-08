import axios from "axios";

const ipify = async()=>{
    try {
        const ipV4 = await axios.get("https://api.ipify.org?format=text")
        return ipV4.data
    } catch(error) {
        console.log("Lỗi ipify: ",error)
    }
}

export default ipify;