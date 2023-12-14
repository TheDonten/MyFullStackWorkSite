import axios from "axios";
import {redirect} from "react-router-dom";

const actionDeleteList = async ( {request} : any) =>{
    console.log("Delete?")

    const axios_me = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            'Authorization': localStorage.getItem("token")
        }
})

const formData = await request.formData();
    let flag = false;
    const newPost = {
        data: formData.get('data'),
    }

    let data = {} as any;
    await axios_me.post("/todolist/deleteList", newPost).then((response) => {
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

    return redirect("../");
}

export default actionDeleteList;