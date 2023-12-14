import axios from "axios";
import {redirect} from "react-router-dom";

const actionNewCard = async () =>{

    const axios_me = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    })
    let data = {} as any;
    await axios_me.put("/todolist/newList").then((response) => {
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

    return data.data;
}
export default actionNewCard;