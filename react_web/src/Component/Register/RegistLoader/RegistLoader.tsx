import {redirect} from "react-router-dom";

const Registraion_Loader = async () =>{
    if(localStorage.getItem('token')){
        return redirect('/profile');
    }
    return null;
}

export default  Registraion_Loader;