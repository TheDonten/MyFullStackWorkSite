import * as React from "react";
import * as ReactDOM from "react-dom/client";

import "./index.css";
import ModalLogin from "./Component/Login/ModalLogin";
import {createBrowserRouter, Link, redirect, RouterProvider, Outlet, Form} from 'react-router-dom'
import {useState} from "react";
import ModalRegist from "./Component/Register/ModalRegist";
import App from "./Component/App";
import axios from "axios";
import Profile from './Component/Profile/Profile'
import ToDoList from "./Component/Profile/ToDoList/ToDoList";
import ElementList from "./Component/Profile/ToDoList/Element/ElementList";

import router from "./Router";





ReactDOM.createRoot(document.getElementById("root")!).render(
    //<React.StrictMode>
        <RouterProvider router={router}/>
    //</React.StrictMode>
);
