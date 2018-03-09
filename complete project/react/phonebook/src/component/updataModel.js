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

    componentWillReceiveProps(nextProps){
        this.setState({
            name: nextProps.element.name,
            phone: nextProps.element.phone,
            mobile: nextProps.element.mobile,
            weichatUrl: nextProps.element.weichatUrl,
            remark: nextProps.element.remark
        })
    }

    hendler_do_updata() {
        fetch('/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `name=${this.state.name}&phone=${this.state.phone}&mobile=${this.state.mobile}&weichatUrl=${this.state.weichatUrl}&remark=${this.state.remark}&token=${this.props.token}&id=${this.props.element._id}`
        }).then((res) => {
            return res.json();
        }).then((result) => {
            if (result.boo) {
                this.props.getlist();
                this.props.doupdata();
            } else {
                this.props.login(true);
                this.props.doupdata();
            }
        })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.close}>
                <Modal.Header>
                    <Modal.Title>修改联系人</Modal.Title>
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
                                    value={this.state.name}
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
                                    value={this.state.phone}
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
                                    value={this.state.mobile}
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
                                    value={this.state.weichatUrl}
                                    onChange={(e) => { this.setState({ weichatUrl: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                备注
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={this.state.remark}
                                    onChange={(e) => { this.setState({ remark: e.target.value }) }}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.props.updata(false) }}>取消</Button>
                    <Button
                        bsStyle="primary"
                        onClick={this.hendler_do_updata.bind(this)}
                    >
                        保存
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}