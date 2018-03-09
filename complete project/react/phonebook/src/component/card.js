import React, { Component } from 'react';

export default class extends Component {

    do_remove(){
        var tf = window.confirm('确定删除？？？');
        if(tf){
            fetch('/remove', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `_id=${this.props.item._id}&token=${this.props.token}`
            }).then((res) => {
                return res.json();
            }).then((result) => {
                if (result.boo) {
                    this.props.getlist();
                } else {
                    this.props.login(true);
                }
            })
        }
    }

    render() {
        var target
        const item = this.props.item;
        const list = this.props.list;

        return (
            <div className="card">
                <div className="row">
                    <div className="info col-sm-3 col-xs-4">
                        <span className="name">{item.name}</span>
                        <span className="remark ">{item.remark}</span>
                    </div>
                    <div className="tel col-sm-6 col-xs-6">
                        <div className="phone ">
                            <span className="glyphicon glyphicon-phone-alt"></span>
                            <span className="hidden-xs">{item.phone}</span>
                            <a href="tel:045188888888" className="hidden-sm hidden-md hidden-lg">{item.phone}</a>
                        </div>
                        <div className="mobile ">
                            <span className="glyphicon glyphicon-phone"></span>
                            <span className="hidden-xs">{item.mobile}</span>
                            <a href="tel:13888888888" className="hidden-sm hidden-md hidden-lg">{item.mobile}</a>
                        </div>
                    </div>
                    <div className="qrcode hidden-xs col-sm-3" data-qrcode="https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk">
                        <span className="wx_title">微信</span>
                    </div>
                    {
                        !!this.props.is_login && <div className="control col-xs-2">
                            <button 
                                type="button" 
                                className=" edit"
                                onClick={()=>this.props.findupdata(item._id,target)}
                            >
                                <i className="glyphicon glyphicon-edit"></i>
                            </button>
                            <button 
                                type="button" 
                                onClick={()=>this.do_remove()}
                                className=" remove"
                            >
                                <i className="glyphicon glyphicon glyphicon-remove"></i>
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}