import axios from "axios";
import {redirect} from "react-router-dom";

const loginAction = async ({request, params}: any) => {

    const formData = await request.formData();
    let flag = false;
    const newPost = {
        username: formData.get('name'),
        password: formData.get('pass')
    }
    await axios.post("http://127.0.0.1:5000/login", newPost).then(response => {
            if (response.data.hasOwnProperty('error')) {
                console.log(response.data.error);
            } else if (response.data.hasOwnProperty('token')) {
                localStorage.setItem('token', response.data.token)
                flag = true;
            }
        }
    ).catch(error => {
        console.log(error)
    })
    return flag ? redirect("/profile") : true;
}


export default loginAction;