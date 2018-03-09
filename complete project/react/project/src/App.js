import React from 'react';
import { connect, Provider } from 'react-redux';
import actionType from './redux/actionTypes';
import store from './redux/store';
import intalState from './redux/intalState'



class Ul extends React.Component {
    
    render() {
        let list = this.props.state.get('list');
        if(list){
            list = list;
        }else{
            list = this.props.state
        }
        return (
            <ul>
                {

                    list.map((v, k) => {
                        return (<li>{v.get("name")}</li>)
                    })
                }
            </ul>
        )
    }
}

const connect_list = connect((state) => { return { state:state.get("list") } });
const ReduxList = connect_list(Ul)

class View extends React.Component {

    hendler_click() {
        this.props.dispatch({type:actionType.LIST_ADD})
    }
    hendler_go() {
        this.props.dispatch({type:actionType.LIST_UPDATE})
    }

    render() {
        return (
            <div>
                <button type="button" onClick={() => this.hendler_click()}>come on</button>
                <button type="button" onClick={() => this.hendler_go()}>let`s go</button>
                <ReduxList {...this.props}  />
            </div>
        )
    }
}
const connect_view = connect((state) => { return { state:state.get("list") } });
const Reduxview = connect_view(View)


export default class App extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <Reduxview />
            </Provider>
        )
    }
}

