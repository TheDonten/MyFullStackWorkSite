import {Affix, Button, Card, Col, Dropdown, Row, message, Input} from "antd"
import {Outlet, Link, useLoaderData, useFetcher, useNavigate} from "react-router-dom";

import type {MenuProps} from 'antd';
import {useEffect, useReducer, useState} from "react";

interface MeineToDoElement {
    name: string,
    smalltext: string,
}

interface Items {
    key: string,
    label: string,
}


const divStyle: React.CSSProperties = {
    height: "256px",
    width: "100%",
    borderRadius: "10px",
    backgroundColor: "#fff"
}

const onMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.')
    console.log('click', e);
};

const items: Items[] = [{
    key: '1',
    label: 'По критичности',
},
    {
        key: '2',
        label: 'По дате окончания',
    }
]

const menuProps = {
    items,
    onClick: onMenuClick,
}

interface jsonCard  {
    count_id_element : number,
    date_end : string,
    id_element : number,
    title : string,
    todo_text : string
}

const ToDoList: React.FC = () => {

    const data = useLoaderData() as jsonCard[];
    const navigate = useNavigate();
    const [items, setItems] = useState(data);
    const [sortItems, setSortItems] = useState(items)
    const [_, forceUpdate] = useReducer( (x) => {return x+1},0 );
    let fetch = useFetcher();

    useEffect(() =>{
        if(fetch.state === 'idle' && Number.isInteger(fetch.data)) {
            navigate(`/profile/todolist/${fetch.data}`)
        }

    }, [fetch.state])

    const onChangeSearch = (str : string) =>{
        const regex = new RegExp(str,'i');
        const temp = items.filter( (el : jsonCard) => {
            const index = el.title.search(regex);
            if( index !== -1)
                return true;
            else
                return false;
        })

        setSortItems([...temp])
    }

    const OnClickToDelete = (id : number) =>{
        debugger;
        const temp = [...items];
        console.log("Check")
        console.log(temp);
        for(let i : number = 0; i < temp.length; i++){
            if(temp[i].id_element
                == id){
                temp.splice(i,1);
                break;
            }
        }
        temp.forEach( (el, index) =>{
            if(el.id_element > id)
                el.id_element -= 1;
        })
        //action
        console.log("Check2")
        console.log(temp);
        setItems(temp);
        setSortItems(temp);
    }

    return (
        <>
            <Affix offsetTop={79} style={{marginTop: 15, marginLeft: 8}}>
                <Row>
                    <Col flex="none">
                        <Button disabled={fetch.state === 'idle' ? false : true } type="primary" style={{marginRight: 15, backgroundColor: "#001529"}} onClick={ () => {
                            fetch.submit({}, {method : 'put', action : "newList"});
                        }}>
                            Новая запись
                        </Button>
                    </Col>
                    {/*<Col flex="none">*/}
                    {/*    <Dropdown menu={menuProps}>*/}
                    {/*        <Button type="primary" style={{marginRight: 15, backgroundColor: "#001529"}}>*/}
                    {/*            Отсортировать:*/}
                    {/*        </Button>*/}
                    {/*    </Dropdown>*/}
                    {/*</Col>*/}
                    <Col flex="auto" style={{marginRight: 8}}>
                        <Input placeholder="Поиск" onChange={(e) => {onChangeSearch(e.currentTarget.value)}}/>
                    </Col>
                </Row>
            </Affix>
            <Row gutter={[16, 16]} style={{margin: 0, marginTop: "15px", display: "flex", justifyContent: "center"}}>
                {sortItems.map((el, index) => {
                    return (
                        <Col key={el.id_element} xs={24} sm={16} xl={8} style={{display: "flex", justifyContent: "center"}} >
                            <Card title={el.title} bordered={false} style={divStyle}>
                                <Row style={{height: "120px"}}>
                                    <Col span={24}>
                                        {el.todo_text}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Link to={`${el.id_element}`}>
                                            <Button type="primary" style={{backgroundColor: "#001529"}}>
                                                Подробнее
                                            </Button>
                                        </Link>
                                    </Col>
                                    <Col span={12} style={{textAlign: "end", height: "100%"}}>
                                        <Button type="primary" style={{backgroundColor: "#001529"}} onClick={ () =>{
                                            fetch.submit( {data : el.id_element}, {method : 'POST', action : "deleteList"})
                                            OnClickToDelete(el.id_element)
                                        }
                                        }>
                                            Удалить
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    )
}

// const ToDoList : React.FC = ()=>{
//     return(
//         <p>
//             <Outlet/>
//         </p>
//     )
// }

export default ToDoList;