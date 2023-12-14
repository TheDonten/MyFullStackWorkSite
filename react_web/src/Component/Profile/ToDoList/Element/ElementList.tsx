import * as React from "react";
import {Content} from "antd/es/layout/layout";
import {Button, Card, Col, Flex, Input, InputRef, Row, Space} from "antd";
import {Link, redirect, useFetcher, useLoaderData, useNavigate, useOutletContext} from "react-router-dom";
import {useEffect, useMemo, useRef, useState, useReducer} from "react";
import axios from "axios";

import {DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";

interface TaskInterface {
    id_list_order: number,
    task: string,
    flag: boolean
}




interface CardMe {
    id_element: number,
    title: string,
    todo_text: string,
    flagList : boolean,
    Tasks: TaskInterface[],
}

const istNoDoIt: React.CSSProperties = {
    height: "100%",
    wordBreak: "break-word"
}

const istDoit: React.CSSProperties = {
    backgroundColor: "#a0d911",
    height: "100%",
    wordBreak: "break-word"
}


const AcitonElement = (SetStateFlag: any, SetLoading: any) => async (props: any) => {
    SetLoading(true);

    const axios_me = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    })
    let data = {} as any;
    await axios_me.post(`/todolist/${props.id_element}`, props).then((response) => {
        data = response.data;
        console.log(response.data);
    }).catch((error) => {
        data = {TokenError: error};
        console.log(error);
    })

    if (data.hasOwnProperty('TokenError')) {
        console.log("TokenError")
        console.log(data.TokenError);
        localStorage.removeItem('token')
        return redirect("/login")
    } else if (data.hasOwnProperty('TokenSuccess')) {
        console.log(data.TokenSuccess);
    }


    SetLoading(false);
    SetStateFlag(false);
    console.log(props)

}



const ElementList: React.FC = () => {

    const data = useLoaderData() as CardMe;


    const [loading, setLoading] = useState(false);
    const [localFlagChangeButton, SetLocalFlagChangeButton] = useState(false);
    const [localFlagChangeInput, SetLocalFlagChangeInput] = useState(false);
    const [localState, SetState] = useState(data)

    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const navigate = useNavigate();

    let SaveElement: TaskInterface;

    const itemsRef: any = useRef([]);
    const titleRef: any = useRef([]);
    const textRef: any = useRef();

    let fetcher = useFetcher();

    const ActionCheck = AcitonElement(SetLocalFlagChangeButton, setLoading)

    const onChangeText = () => {
        console.log("TEXT AREA")
        console.log(textRef.current.resizableTextArea.textArea.value)
        SetState({...localState, todo_text: textRef.current.resizableTextArea.textArea.value})
    }

    const onChangeTextTitle = () => {
        SetState({...localState, title: titleRef.current.input.value})
    }

    const onDeleteElement = (index: number) => {
        debugger;
        let temp = [...localState.Tasks]
        temp.splice(index, 1)
        temp.sort((a, b) => a.id_list_order - b.id_list_order)
        for (let i: number = 0; i < temp.length; i++) {
            temp[i].id_list_order = i;
        }
        SetState({...localState, Tasks: temp})
    }

    const onChangeElementFlag = (index: number) => {
        let temp = [...localState.Tasks]
        temp[index].flag = !temp[index].flag;

        SetState({...localState, Tasks: temp, flagList : temp.every( el => el.flag)})
    }

    const onChangeTextItem = (index: number) => {


        let localeTemp = [...localState.Tasks];


        localeTemp[index].task = itemsRef.current[index].resizableTextArea.textArea.value;
        //SynchroneArays(localeTemp, localeNew);
        SetState({...localState, Tasks: localeTemp,});

    }


    const onClickAddElement = () => {
        const thisLocal = localState.Tasks.length;
        let localeTemp = [...localState.Tasks];
        localeTemp.push({
            id_list_order: thisLocal,
            task: "",
            flag: false
        })

        SetState({...localState, Tasks: localeTemp,});
    }

    function HandlerDragOver(e: any, el: any) {
        e.preventDefault()
        e.currentTarget.style.backgroundColor = "gray";

    }

    function HandlerDragStart(e: any, el: any) {
        SaveElement = el;
        e.currentTarget.style.backgroundColor = "gray";

    }

    function HandlerDragEnd(e: any, el: any) {
        e.currentTarget.style.backgroundColor = el.flag ? "#a0d911" : "white";

    }

    function HandlerDragLeave(e: any, el: any) {
        e.currentTarget.style.backgroundColor = el.flag ? "#a0d911" : "white";


    }

    function HandlerOnDrop(el: any, index: number, e: any) {
        e.currentTarget.style.backgroundColor = el.flag ? "#a0d911" : "white";
        debugger;
        let temp = [...localState.Tasks];
        let [index_first, index_second] = [SaveElement.id_list_order, el.id_list_order];
        console.log(localState)
        debugger;
        temp[index_first].id_list_order = index_second;
        temp[index_second].id_list_order = index_first;

        [temp[index_first], temp[index_second]] = [temp[index_second], temp[index_first]];


        //SynchroneArays(temp, tempNew);

        SetState({...localState, Tasks: temp});


    }

    console.log("Rerender me pls");
    console.log(localState);
    return (
        <Content style={{
            textAlign: "center",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Card title={<Input ref={titleRef} value={localState.title} style={{textAlign: "center"}}
                                readOnly={!localFlagChangeInput} onChange={() => {
                onChangeTextTitle()
            }}/>} style={{height: "90%", width: "80%", overflow: "initial"}}
                  bodyStyle={{height: "92.4%"}} extra={
                <Link to={".."}>
                    <Button>
                        X
                    </Button>
                </Link>
            }>
                <div style={{height: "10%", overflow: "auto", marginBottom: "2%", display: "flex"}}>
                    <div style={{width: "10%", alignSelf: "center", fontWeight: "bold"}}>
                        Краткое описание задачи:
                    </div>
                    <Input.TextArea maxLength={100} value={localState.todo_text}
                                    style={{height: "100%", width: "90%", resize: 'none'}}
                                    readOnly={!localFlagChangeInput} ref={textRef} onChange={() => {
                        onChangeText()
                    }}/>
                </div>
                <div style={{height: "78%", overflow: "auto", marginBottom: "2%",}}>
                    <div style={{fontWeight: "bold", paddingBottom: 15}}>
                        Список дел:
                    </div>
                    <Row gutter={[0, 16]}>

                        {
                            localState.Tasks.map((el, index) => {

                                return (
                                    <Col key={el.id_list_order} span={24} style={{
                                        borderColor: "#d9d9d9",
                                        borderRadius: 6,
                                        borderStyle: "solid",
                                        borderWidth: 1
                                    }}>
                                        <Row>
                                            <Col flex="auto">
                                                <Input.TextArea autoSize={{minRows: 3, maxRows: 5}}
                                                                style={el.flag ? istDoit : istNoDoIt}
                                                                ref={(element: any) => {
                                                                    itemsRef.current[index] = element;
                                                                }}
                                                                readOnly={!localFlagChangeInput} value={el.task}
                                                                onChange={() => {
                                                                    onChangeTextItem(index)
                                                                }}
                                                                draggable={localFlagChangeInput} onDragStart={(e) => {
                                                    HandlerDragStart(e, el)
                                                }}
                                                                onDragEnd={(e) => {
                                                                    HandlerDragEnd(e, el)
                                                                }}
                                                                onDragOver={(e) => {
                                                                    HandlerDragOver(e, el)
                                                                }}
                                                                onDragLeave={(e) => {
                                                                    HandlerDragLeave(e, el)
                                                                }}
                                                                onDrop={(e) => {
                                                                    HandlerOnDrop(el, index, e)
                                                                }}
                                                >
                                                </Input.TextArea>
                                            </Col>
                                            {localFlagChangeInput &&
                                                <Col flex='none'>
                                                    <Flex vertical={true} justify="space-between"
                                                          style={{height: "100%"}}>
                                                        <DeleteOutlined style={{fontSize: 32}} onClick={() => {
                                                            onDeleteElement(index)
                                                        }}/>
                                                        {el.flag ?
                                                            <CloseCircleOutlined style={{fontSize: 32}} onClick={() => {
                                                                onChangeElementFlag(index)
                                                            }}/> :
                                                            <CheckCircleOutlined onClick={() => {
                                                                onChangeElementFlag(index)
                                                            }} style={{fontSize: 32}}/>
                                                        }
                                                    </Flex>
                                                </Col>
                                            }
                                        </Row>
                                        {/*<DeleteOutlined />*/}
                                    </Col>
                                );
                            })
                        }

                        {
                            localFlagChangeButton && <Col span={24}><Button style={{textAlign: "center"}}
                                                                            onClick={onClickAddElement}> + </Button>
                            </Col>
                        }

                    </Row>
                </div>
                <div style={{height: "6%", display: "flex", justifyContent: "space-between"}}>
                    {
                        localFlagChangeButton ? <Button type='primary' onClick={() => {
                                SetLocalFlagChangeInput(false);
                                ActionCheck(localState);

                            }
                            } disabled={loading}> Потвердить </Button> :
                            <Button type="primary" onClick={() => {
                                SetLocalFlagChangeButton(true)
                                SetLocalFlagChangeInput(true);
                            }}>
                                Изменить
                            </Button>
                    }
                    {
                        !localFlagChangeButton && <Button type="primary"
                                                          onClick={() => {
                                                              fetcher.submit({data: localState.id_element}, {
                                                                  method: 'POST',
                                                                  action: "../deleteList"
                                                              });
                                                          }
                                                          }
                        >
                            Удалить
                        </Button>
                    }
                </div>
            </Card>
        </Content>
    )
}


export default ElementList;