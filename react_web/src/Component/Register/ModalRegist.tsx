import type { LoaderFunctionArgs } from "react-router-dom";
import Modals from "../../ModalLogin.module.css"
import {Link, useFetcher} from "react-router-dom";
import {ConfigProvider, Divider, Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import * as React from "react";

const DivSon1Style : React.CSSProperties = {
    margin: "0 0 50px 0",
    padding: "0",
    color : "#fff",
    fontSize : "28px",
    fontWeight : "bold"
}

export default function ModalRegist(){
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
                            <input type="submit" value="Regist" readOnly />
                            <Divider style={{backgroundColor:'#fff', marginTop : 12, marginBottom : 12}}/>
                            {fetcher.data && <div style = {{color : "#fff"}}>Неправильно указан логин или пароль</div>}
                        </fetcher.Form>
                    </div>
                </Content>
            </Layout>
        </ConfigProvider>
    )
}