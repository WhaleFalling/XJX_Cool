import React, { Component } from 'react';
import NavBar from './component/nav';
import List from './component/list';
import Loginmodel from './component/loginModel';
import Createmodel from './component/createModel';
import Updatamodel from './component/updataModel';
import 'whatwg-fetch';
import './App.css';

class App extends Component {
  constructor(props){
    super();

      var token=localStorage.getItem("token");

    this.state={
      list:[],
      keyword:'',
      show_login_model:false,
      token:token||'',
      show_create_model:false,
      show_updata_model:false,
      element:{}
    }
  }

  hendler_show_loginmodel(tf){
    this.setState({show_login_model:tf});
  }
  hendler_show_updatamodel(tf){
    this.setState({show_updata_model:tf})
  }

  hendler_show_createmodel(tf){
    this.setState({show_create_model:tf});
  }

  handler_create(){
    this.setState({show_create_model:false})
  }

  handler_updata(){
    this.setState({show_updata_model:false})
  }

  handler_login(token) {
    
    this.setState({ show_login_model: false, token: token });
    localStorage.setItem("token", token);
  }

  handler_logout(){
    localStorage.setItem("token", '');
    this.setState({ token: '' });
  }

  componentDidMount(){
    this.hendler_getList();
  }

  hendler_getList(){
    let url="/list";
    if(this.state.keyword){
      url+=`?keyword=${this.state.keyword}`
    }
    fetch(url).then((res)=>{
      return res.json();
    }).then((result)=>{
      this.setState({list:result.list});
    })
  }

  hendler_do_search(key){
    this.setState({keyword:key},()=>this.hendler_getList());
  }

  hendler_do_updata(_id){
    for(let item of this.state.list){
      if(item._id===_id){
        this.setState({element:item,show_updata_model:true})
      }
    }
  }

  render() {
    return (
      <div>
        <NavBar 
          keyword={this.state.keyword} 
          do_search={(key)=>this.hendler_do_search(key)}
          login={(tf)=>this.hendler_show_loginmodel(tf)}
          do_logout={()=>this.handler_logout()}
          create={(tf)=>this.hendler_show_createmodel(tf)}
          is_login={!!this.state.token?true:false}
         />
        <List 
          list={this.state.list}
          token={this.state.token}
          getlist={()=>this.hendler_getList()}
          is_login={!!this.state.token?true:false}
          login={(tf)=>this.hendler_show_loginmodel(tf)}
          updata={(tf)=>this.hendler_show_updatamodel(tf)}
          show={this.state.show_updata_model}
          doupdata={()=>this.handler_updata()}
          findupdata={(_id,target)=>this.hendler_do_updata(_id,target)}
        />
        <Loginmodel 
          show={this.state.show_login_model} 
          login={(tf)=>this.hendler_show_loginmodel(tf)}
          handler_login={(token) => this.handler_login(token)}
        />
        <Createmodel 
          show={this.state.show_create_model}
          create={(tf)=>this.hendler_show_createmodel(tf)}
          login={(tf)=>this.hendler_show_loginmodel(tf)}
          token={this.state.token}
          getlist={()=>this.hendler_getList()}
          docreate={()=>this.handler_create()}
        />
        <Updatamodel 
          login={(tf)=>this.hendler_show_loginmodel(tf)}
          getlist={()=>this.hendler_getList()}
          show={this.state.show_updata_model}
          doupdata={()=>this.handler_updata()}
          updata={(tf)=>this.hendler_show_updatamodel(tf)}
          element={this.state.element}
          token={this.state.token}
        />
      </div>
    );
  }
}

export default App;
