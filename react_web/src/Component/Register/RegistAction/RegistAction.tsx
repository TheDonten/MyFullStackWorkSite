import axios from "axios";
import {redirect} from "react-router-dom";

const registAction = async ({request, params}: any) =>{
    const formData = await request.formData();
    let flag = false;
    const newPost = {
        username: formData.get('name'),
        password: formData.get('pass')
    }
    await axios.post("http://127.0.0.1:5000/regist", newPost).then( (response) =>{
        if(response.data.hasOwnProperty('ErrorLogin')){
            console.log(response.data.ErrorLogin)
        }
        else if (response.data.hasOwnProperty('Success')){
            flag = true
        }
    }).catch( (error) =>{
        console.log(error)
    })
    return flag ? redirect("/login") : true;
}

export default registAction;