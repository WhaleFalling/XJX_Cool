//面包屑
import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import menuData from '../options/left_menu';

export default class extends React.Component{

    find_path(url){
        const path=[];
        const find = (list =[])=>{
            for(let item of list){
                //保存进入路径
                path.push(item);
                switch(item.type){
                    case "SubMenu":
                    case "MenuItemGroup":
                        if(find(item.children)){
                            return true;
                        }
                        break;
                    case "Item":
                        if(url === item.url){
                            return true;
                        }
                    default:
                        break;
                }
                path.pop();
            }
        }
        find(menuData);
        return path;
    }

    creat_item(){
        const url=window.location.pathname;
        return this.find_path(url).map((v,k)=>{
            return (
                <Breadcrumb.Item key={`k`}>
                    <Icon type={v.icon} />
                    <span>{v.title}</span>
                </Breadcrumb.Item>
            )
        })
    }

    render(){
        return(
            <Breadcrumb className="breadcrumb">
                {
                    this.creat_item()
                }
            </Breadcrumb>
        )
    }
}