//左边主导航
import React from 'react';
import {Menu, Icon} from 'antd';
import menu_data from '../options/left_menu';
import { Link } from 'react-router-dom'

function CreateMenu(items,key){
    return items.map((v,k)=>{
        switch(v.type){
            case "SubMenu":
                return(
                    <Menu.SubMenu
                        key={`${key}_${k}`}
                        title={
                            <span><Icon type={v.icon} /><span>{v.title}</span></span>
                        }
                    >
                        {CreateMenu(v.children,`${key}_${k}`)}
                    </Menu.SubMenu>
                );
            case "MenuItemGroup":
                return(
                    <Menu.ItemGroup
                        key={`${key}_${k}`}
                        title={
                            <span><span>{v.title}</span></span>
                        }
                    >
                        {CreateMenu(v.children,`${key}_${k}`)}
                    </Menu.ItemGroup>
                );
            case "Item":
                return(
                    <Menu.Item key={v.url}>
                        <Link to={v.url}><span><Icon type={v.icon} /><span>{v.title}</span></span></Link>
                    </Menu.Item>
                )    
            default:
                break;

        }
    });
}

export default class extends React.Component{
    render(){
        return(
            <Menu
                theme="dark"
                mode="inline"
            >
            {
                CreateMenu(menu_data,0)
            }
            </Menu>
        )
    }
}