import {createBrowserRouter, redirect} from "react-router-dom";
import App from "./Component/App";
import ModalLogin from "./Component/Login/ModalLogin";
import ModalRegist from "./Component/Register/ModalRegist";
import Profile from "./Component/Profile/Profile";
import ToDoList from "./Component/Profile/ToDoList/ToDoList";
import ElementList from "./Component/Profile/ToDoList/Element/ElementList";
import loginAction from "./Component/Login/LoginAction/LoginAction";
import loader_login from "./Component/Login/LoaderLogin/LoaderLogin";
import registAction from "./Component/Register/RegistAction/RegistAction";

import ProfileAuthLoader from "./Component/Profile/ProfileLoader/ProfileLoader";
import loader_todolist from "./Component/Profile/ToDoList/LoaderToDoList/LoaderToDolist";
import loader_element from "./Component/Profile/ToDoList/Element/LoaderElement";
import actionNewCard from "./Component/Profile/ToDoList/ActionToDoList/ActionToDoListNewCard";
import actionDeleteList from "./Component/Profile/ToDoList/ActionToDoList/AcitonDeleteElement";
import ToDoListSuccess from "./Component/Profile/ToDoListSuccess/ToDoListSuccess";
import loader_todolist_success from "./Component/Profile/ToDoListSuccess/LoaderToDoListSuccess/LoaderToDoListSuccess";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        Component: App,

        children: []
    },
    {

        path: "/login",
        //Component: ModalLogin,
        Component : ModalLogin,
        action : loginAction,
        loader : loader_login
    },
    {
        id: "ModalRegist",
        path: "/regist",
        Component : ModalRegist,
        action : registAction
    },
    {
        id: "profile",
        path: "/profile",
        Component: Profile, //Protected
        loader : ProfileAuthLoader,
        children: [
            {
                id: "todolist",
                path: "todolist",
                children: [
                    {
                        id: "rootList",
                        index: true,
                        Component: ToDoList,
                        loader : loader_todolist
                    },
                    {
                        id: "elementList",
                        path: ":id",
                        Component: ElementList,
                        loader : loader_element,

                        // children : [
                        //     {
                        //         id : "update",
                        //         path : "update",
                        //         action : actionUpdateElementList
                        //     },
                        // ]
                    },
                    {
                        id : 'newElement',
                        path : "newList",
                        action : actionNewCard
                    },
                    {
                        id : "delete",
                        path : "deleteList",
                        action : actionDeleteList,
                    }
                ]
            },
            {
                id : "logout",
                path : "logout",
                loader : async () =>{
                    if (localStorage.getItem('token')) {
                        localStorage.removeItem('token');
                        return redirect("/")
                    }
                    else{
                        return redirect("/")
                    }
                }
            },
            {
                id: "calendar",
                path: "calendar"
            },
            {
                id: "gant",
                path: "gant",
            },
            {
                id: "successDoList",
                path: "success",
                children: [
                    {
                        id : "RootListSuccess",
                        index: true,
                        Component : ToDoListSuccess,
                        loader : loader_todolist_success,
                    },
                    {
                        id : "deleteSuccess",
                        path : "deleteList",
                        action : actionDeleteList,
                    },
                    {
                        id: "elementListSuccess",
                        path: ":id",
                        Component: ElementList,
                        loader : loader_element,
                    },

                ]
            }

        ]
    }
])

export default router;