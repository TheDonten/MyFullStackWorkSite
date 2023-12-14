import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {Link} from "react-router-dom";
import {Button, Col, ConfigProvider, Layout, Row, Menu, Breadcrumb, theme, Typography} from "antd";
import {Content, Header, Footer} from "antd/es/layout/layout";
import MeinHeader from "./Header/Header";
const {Title, Paragraph} = Typography;



const contentStyle : React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#003eb3',
    height : "auto",
    wordWrap : "break-word",
}


const App : React.FC = () => {
    return(
        <Layout style = {{height : "100vh"}}>
            <MeinHeader/>
            <Content style={contentStyle}>
                Content
            </Content>
        </Layout>
    );
}


export default App;