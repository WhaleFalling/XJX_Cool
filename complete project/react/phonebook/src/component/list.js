import React, { Component } from 'react';
import Card from './card'
import {
    Grid,Row,Col
} from 'react-bootstrap';

export default class extends Component {

    hendler_creatList(list){
        let items=[];
        let key=0;
        for(let item of list){
            let el = (
                <Col key={key++} className="card_list" xs={6} md={4}>
                    <Card  
                        item={item}
                        token={this.props.token}
                        getlist={this.props.getlist}
                        is_login={this.props.is_login}
                        login={this.props.login}
                        updata={this.props.updata}
                        show={this.props.show}
                        doupdata={this.props.doupdata}
                        list={this.props.list}
                        findupdata={this.props.findupdata}
                    />
                </Col>
                )
            items.push(el);
        }
        return items;
    }

    render() {

        var list = this.props.list;
        
        return (
            <Grid>
                <Row className="show-grid">
                    {
                        this.hendler_creatList(list)
                    }
                </Row>
            </Grid>
        )
    }
}