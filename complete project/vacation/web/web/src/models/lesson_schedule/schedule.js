import React from 'react';
import {  Spin, Form, Select, Calendar, message } from 'antd';
import Container from '../../component/container';
import fd from '../../base/fetchData';
import moment from 'moment';
import Btncreate from './create_lesson';

export default class extends React.Component {
    constructor(props) {
        super();
        let redirect_class_id = "";
        if (props.location && props.location.state) {
            redirect_class_id = props.location.state.class_id.toString();
        };
        this.state = {
            list: [],
            loading: false,
            editRecord: null, //被选中的行
            showEdit: false, //显示编辑窗口
            class_list: [],
            class_id: redirect_class_id,
            month: moment(new Date(Date.now())).format("YYYY/MM/DD")

        }
    }

    componentDidMount() {
        this.get_class();
        if (!!this.state.class_id) {
            this.get_list();
        }
    }

    get_class() {
        fd.getJSON(fd.ports.option.class.all_list, [this.state.class_id]).then((result) => {
            this.setState({ class_list: result },()=>{
                if(!this.state.class_id && result.length > 0){
                    this.setState({class_id:this.state.class_list[0].class_id.toString()},()=>{
                        this.get_list();
                    })
                }
            });
        }).catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
        });
    }

    get_list() {
        this.setState({ loading: true });
        //构建参数
        let {class_id, month} = this.state;

        fd.getJSON(fd.ports.option.schedule.list, {class_id:Number(class_id),month}).then((result) => {
            this.setState({
                list: result,loading: false
            });
        }).catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
        });
    }

    view_disabledDate(date) {
        if (moment(this.state.month).format("YYYY/MM") === date.format("YYYY/MM")) {
            return false;
        } else {
            return true;
        }
    }

    data_cell_render(value) {
        //取得当前日期
        const toDay = value.format("L");
        let lessons = this.state.list.filter((v, k) => {
            if (toDay === moment(v.begin_time).format("L")) {
                return true;
            } else {
                return false;
            }
        });

        return (
            <ul className="lesson_of_day">
                {
                    lessons.map((v, k) => {
                        let begin_time = moment(v.begin_time).format("HH:mm"),
                            end_time = moment(v.end_time).format("HH:mm");
                        return (
                            <li key={k}>
                                <span className="room">{v.room_name}</span>
                                &nbsp;
                                <span className="time">{`[${begin_time}-${end_time}]`}</span>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }

    handler_select_day(date) {
        this.setState({ editRecord: date });
    }

    handler_panel_change(date, mode) {
        this.setState({ editRecord: date,month:date.format("YYYY/MM/DD") },()=>this.get_list());
    }

    render() {
        return (
            <div onDoubleClick={()=>this.setState({showEdit:true})}>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Form layout="inline" style={{}}>
                            <Form.Item label="班级">
                                <Select
                                    style={{ width: 200 }}
                                    value={this.state.class_id}
                                    onChange={(v) => {
                                        this.setState({class_id:v},()=>{
                                            this.get_list();
                                        })
                                    }}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        this.state.class_list.map((v) => (
                                            <Select.Option key={v.class_id}>{v.class_name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Btncreate 
                                    handler_refresh={() => { this.get_list() }} 
                                    editRecord={this.state.editRecord}
                                    visible={this.state.showEdit}
                                    handler_close={() => this.setState({ showEdit: false })}
                                    lesson_list={this.state.list}
                                    class_id={this.state.class_id}
                                />
                            </Form.Item>
                        </Form>


                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <Calendar
                            fullscreen={true}
                            disabledDate={(data)=>this.view_disabledDate(data)}
                            dateCellRender={(v) => this.data_cell_render(v)}
                            onSelect={(d)=>this.handler_select_day(d)}
                            onPanelChange={(date,mode)=>this.handler_panel_change(date)}
                        />
                    </Spin>
                </Container>
                {/* {
                        this.state.showEdit && <Edit
                            visible={this.state.showEdit}
                            handler_close={() => this.setState({ showEdit: false })}
                            editRecord={this.state.editRecord}
                            handler_refresh={() => this.get_list()}
                        />
                    } */}
            </div>
        );
    }
}
