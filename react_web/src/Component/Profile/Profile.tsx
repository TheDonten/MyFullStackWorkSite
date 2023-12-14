import {Button, Col, Layout, Menu, Row} from "antd";
import * as React from "react";
import {Link, Outlet} from "react-router-dom";
import {
    AppstoreOutlined,
    ContainerOutlined,
    FieldTimeOutlined,
    BarsOutlined,
    DesktopOutlined,
    CheckOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,

    PieChartOutlined,
} from '@ant-design/icons';

import type {MenuProps} from "antd";

const {Sider, Content, Header} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Cписок дел', 'sub1',
        <Link to={"todolist"}>
            <BarsOutlined/>
        </Link>,
    ),
    getItem('Календарь', '2',
        <Link to={"calendar"}>
            <FieldTimeOutlined/>
        </Link>
    ),
    getItem('Диаграмма Ганта', '3',
        <Link to={"gant"}>
            <PieChartOutlined/>
        </Link>
    ),
    getItem('Завершенные дела', '4',
        <Link to={"success"}>
            <CheckOutlined/>
        </Link>
    )
];

type ContextType = { user: string | null };

const myObj = {
    user : "kek"
}

const Profile: React.FC = () => {
    return (
        <Layout hasSider>
            <Sider collapsible style={{
                backgroundColor: "#141414",
                overflow: 'auto',
                height: "100vh",
                left: 0,
                top: 0,
                bottom: 0,
                position: "sticky"
            }}>
                <Row style={{height: "64px"}}>
                    <Col span={24} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <div className="logo" style={{fontSize: "28px", fontWeight: "bold", color: "#fff"}}>
                            LG
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col flex="auto">
                        <Menu
                            defaultSelectedKeys={['1']} // Navigate to first key!
                            mode="inline"
                            theme="dark"
                            items={items}
                        />
                    </Col>
                </Row>
            </Sider>
            <Layout>
                <Header style={{backgroundColor: "#141414", top: 0, position: "sticky", zIndex: 1}}>
                    <Row>
                        <Col flex="auto">
                            <div style={{fontSize: "28px", fontWeight: "bold", color: "#fff"}}>
                                LOGO CHECK
                            </div>
                        </Col>
                        <Col flex="none">
                        <Link to="logout">
                            <Button type="primary">
                                LogOut
                            </Button>
                        </Link>
                        </Col>
                    </Row>
                </Header>
                <Content style={{backgroundColor: "#003eb3", overflow: 'initial'}}>
                    <Outlet context={myObj}/>
                </Content>
            </Layout>
        </Layout>
    );
}


export default Profile;