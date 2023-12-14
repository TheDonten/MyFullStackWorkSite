import {redirect} from "react-router-dom";

const loader_login = async ({requst} : any) => {

    if (localStorage.getItem('token')) {
        return redirect('/profile');
    }
    return null;
}

export default  loader_login;