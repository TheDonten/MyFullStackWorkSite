


import {Col, ConfigProvider, Divider, Layout, Row, Typography} from "antd";
import {Content} from "antd/es/layout/layout";
import * as React from "react";
import {Form, Link, useFetcher} from "react-router-dom";
import Modals from '../../ModalLogin.module.css'

const {Title} = Typography;

const DivSon1Style : React.CSSProperties = {
    margin: "0 0 50px 0",
    padding: "0",
    color : "#fff",
    fontSize : "28px",
    fontWeight : "bold"
}

export default function ModalLogin(){
    const fetcher = useFetcher();
    return(
        <ConfigProvider theme={
            {
                components : {

                }
            }
        }>
        <Layout style={{height : '100vh'}}>
            <Content style={{backgroundColor: '#003eb3'}}>
                <div className={Modals.modalcontent}>
                    <div style={DivSon1Style}>
                        LOGO CHECK
                    </div>
                    <fetcher.Form className={Modals.loginForm} method = 'post'>
                        <label>
                            <input type="name" placeholder={"name"} required={true} name="name"/>
                        </label>
                        <label>
                            <input  type="password" placeholder={"Password"} required={true} name="pass"/>
                        </label>
                        <input type="submit" value="Login" readOnly />
                        {fetcher.data && <div style={{color : "#fff"}}>Указан неверный пароль или логин</div>}
                        <Divider style={{backgroundColor:'#fff', marginTop : 12, marginBottom : 12}}/>
                        <Link to={"/regist"}>
                            <input type="submit" value="Registration" readOnly />
                        </Link>
                    </fetcher.Form>
                </div>
            </Content>
        </Layout>
        </ConfigProvider>
    )
}

