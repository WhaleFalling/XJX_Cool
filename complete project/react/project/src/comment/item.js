import React, { Component } from 'react';

export default class extends Component{
    render(){
        return(
            <div>
                {this.props.item}
                {this.props.k}
            </div>
        )
    }
}