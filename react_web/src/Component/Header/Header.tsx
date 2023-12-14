import {Button, Col, ConfigProvider, Row, Typography} from "antd";
import {Link} from "react-router-dom";
import * as React from "react";
import {Header} from "antd/es/layout/layout";
const {Title} = Typography;

const headerStyle : React.CSSProperties = {
    color : '#fff',
    backgroundColor: '#141414',



}

const MeinHeader = () =>{
    return(
        <Header style={headerStyle} >
            <Row>
                <Col flex="auto">
                    <div style={{fontSize : "28px",fontWeight : "bold"}}>
                        LOGO CHECK
                    </div>
                </Col>
                <Col flex="none">
                    <Link to={"/login"}>
                        <Button type="primary" >
                            Login
                        </Button>
                    </Link>

                </Col>
            </Row>
        </Header>
    );
};

export default MeinHeader;
