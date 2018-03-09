import React, { Component } from 'react';
import ReactDom from 'react-dom';

export default class extends Component{

    shouldComponentUpdate(){
        return false
    }

    changeDom(){
        const el = ReactDom.findDOMNode(this.refs.dom);
        window.jQuery(el).qrcode({ width: 200, height: 200, correctLevel: 0, text: "react二维码" });
    }

    render(){
        return(
            <div ref="dom">
                <button type="button" onClick={()=>this.changeDom()}>come on</button>
            </div>
        )
    }
}