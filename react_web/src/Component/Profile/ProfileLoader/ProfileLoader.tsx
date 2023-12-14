import {redirect} from "react-router-dom";
import axios from "axios";

const ProfileAuthLoader = async ()=>{
    if (!localStorage.getItem("token")) {
        return redirect("/login")
    }

    const axios_me = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    })
    let data = {} as any;
    await axios_me.get("/auth").then((response) => {
        data = response.data;
        console.log(response.data);
    }).catch((error) => {
        data = {TokenError: error};
        console.log(error);
    })

    if (data.hasOwnProperty('TokenError')) {
        console.log("TokenError")
        console.log(data.TokenError);
        localStorage.removeItem('token')
        return redirect("/login")
    }
    else if(data.hasOwnProperty('TokenSuccess')){
        console.log(data.TokenSuccess);
    }

    return data;
    //return null;
}

export default ProfileAuthLoader;