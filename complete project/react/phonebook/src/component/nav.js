import React, { Component } from 'react';
import {
    Navbar, Nav, NavItem,FormGroup,FormControl,Button
} from 'react-bootstrap'


export default class extends Component {

    constructor(props){
        super();
        this.state={
            keyword:props.keyword
        }
    }

    render() {
        return (
            <Navbar inverse collapseOnSelect fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">四组电话本项目</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {
                            !!this.props.is_login &&
                            <NavItem 
                                eventKey={1} 
                                onClick={()=>{this.props.create(true)}}
                                href="#"
                            >
                                +添加联系人
                            </NavItem>
                        }
                    </Nav>

                    <Navbar.Form pullLeft>
                        <FormGroup>
                            <FormControl 
                                onChange={(e) => { this.setState({ keyword: e.target.value }) }}
                                value={this.state.keyword}
                                type="text"
                                placeholder="查找联系人"
                            />
                        </FormGroup>
                        {' '}
                        <Button type="submit" onClick={()=>{this.props.do_search(this.state.keyword)}}>搜索联系人</Button>
                    </Navbar.Form>

                    <Nav pullRight>
                        {
                            !this.props.is_login &&
                            <NavItem 
                                onClick={() => { this.props.login(true); }}
                                eventKey={1} href="#"
                            >
                                登录
                            </NavItem>
                        }
                        {
                            !!this.props.is_login &&
                            <NavItem 
                                onClick={()=>{this.props.do_logout()}}
                                eventKey={2} 
                                href="#"
                            >
                                注销
                            </NavItem>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    }
}