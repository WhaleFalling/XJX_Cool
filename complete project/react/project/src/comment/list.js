import React, { Component } from 'react';

export default class extends Component{
    render(){
        return(
            <div>
                <ul>
                    {this.props.children}
                </ul>
            </div>
        )
    }
}