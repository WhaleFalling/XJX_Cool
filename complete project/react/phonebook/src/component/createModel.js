import React, { Component } from 'react';
import { Modal, Form, FormGroup, Col, ControlLabel, Button, FormControl, Checkbox } from 'react-bootstrap';

export default class extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            phone: '',
            mobile: '',
            weichatUrl: '',
            remark: ''
        }
    }

    hendler_do_create() {
        fetch('/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `name=${this.state.name}&phone=${this.state.phone}&mobile=${this.state.mobile}&
            weichatUrl=${this.state.weichatUrl}&remark=${this.state.remark}&token=${this.props.token}`
        }).then((res) => {
            return res.json();
        }).then((result) => {
            if (result.boo) {
                this.props.getlist();
                this.props.docreate();
            } else {
                this.props.login(true);
                this.props.docreate();
            }
        })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.close}>
                <Modal.Header>
                    <Modal.Title>新建联系人</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                姓名
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.user_id}
                                    placeholder="请输入姓名"
                                    onChange={(e) => { this.setState({ name: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                固定电话
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.user_id}
                                    placeholder="请输入固定电话"
                                    onChange={(e) => { this.setState({ phone: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                手机
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.user_id}
                                    placeholder="请输入手机号"
                                    onChange={(e) => { this.setState({ mobile: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                微信二维码地址
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.user_id}
                                    placeholder="请输入二维码"
                                    onChange={(e) => { this.setState({ weichatUrl: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                备注
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.password}
                                    placeholder="请输入备注"
                                    onChange={(e) => { this.setState({ remark: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.props.create(false) }}>取消</Button>
                    <Button
                        bsStyle="primary"
                        onClick={this.hendler_do_create.bind(this)}
                    >
                        保存
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}