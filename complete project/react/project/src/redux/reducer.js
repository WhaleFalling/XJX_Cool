import actionTypes from './actionTypes';
import intalState from './intalState';
import store from './store';
import immutable from 'immutable'

export default function (state = intalState,{type,data}){
    let newState = state;
    switch(type){
        case actionTypes.LIST_ADD:
            //newState = newState.set("list",state.get("list").push("新纪录"))
            newState=newState.update("list",(v)=>{
                return v.push("新纪录")
            })
            break
        case actionTypes.LIST_UPDATE:
            fetch("/list").then((res)=>res.json()).then((data)=>{
                store.dispatch({type:actionTypes.LIST_DELETE,data:data})
            })
            break
        case actionTypes.LIST_DELETE:
            newState=newState.update("list",(v)=>{
                return immutable.fromJS(data)
            })
            break
    }

    return newState
}