import React, { Component } from 'react';
import { Modal, Form, FormGroup, Col, ControlLabel, Button, FormControl, Checkbox } from 'react-bootstrap';

export default class extends Component {

    constructor() {
        super();
        this.state = {
            user_id: '',
            password: ''
        }
    }

    hendler_do_login() {
        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `user_id=${this.state.user_id}&password=${this.state.password}`
        }).then((res) => {
            return res.json();
        }).then((result) => {
            if (result.token != 401) {
                this.props.handler_login(result.token);
            } else {
                alert('用户名密码错误！');
            }
        })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.close}>
                <Modal.Header>
                    <Modal.Title>请登录</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                用户名
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.user_id}
                                    placeholder="请输入用户名"
                                    onChange={(e) => { this.setState({ user_id: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                密码
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    placeholder="Password"
                                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.props.login(false) }}>取消</Button>
                    <Button
                        onClick={this.hendler_do_login.bind(this)}
                        bsStyle="primary"
                    >
                        登录
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}