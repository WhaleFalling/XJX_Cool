import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
// import List from './comment/list';
// import Item from './comment/item';
// import Changedom from './comment/domchange';


// const listData = [
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
//   { title: 'q' },
// ]


class App extends Component {

  // constructor() {
  //   super();
  //   this.state = {
  //     change: ''
  //   }

  // }

  // changeClass() {
  //   this.setState({ change: !this.state.change })
  // }

  // render() {
  //   return (
  //     <div ref="change" className={!!this.state.change ? 'change' : ''} >
  //       <button onClick={() => this.changeClass()}>come on</button>
  //       <List >
  //         {
  //           listData.map((v, k) => {
  //             return <Item item={v.title} k={k} />
  //           })
  //         }
  //       </List>
  //       <Changedom />
  //     </div>

  //   );
  // }
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul className="top_nav">
            <li><Link to="/">index</Link></li>
            <li><Link to="/change/:id">change</Link></li>
            <li><Link to="/p1">1</Link></li>
            <li><Link to="/p2">2</Link></li>
            <li><Link to="/p3">3</Link></li>
            <li><Link to="/32153">别点我</Link></li>
            <li><Link to="/go">重定向</Link></li>
          </ul>
          <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/change/:id" component={Change} />
          <Route path="/p1" component={C1} />
          <Route path="/p2" component={C2} />
          <Route path="/p3" component={C3} />
          <Redirect from='/go' to='p1' />
          <Route component={NotFound} />
         
          </Switch>
        </div>
      </BrowserRouter>
    )
  }




}

export default App;

class Index extends Component {
  render() {
    return (
      <div>
        <h1>这是INDEX{this.props.match.params.id}</h1>
      </div>
    )
  }
}
class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>瞎几把点 啥都没有</h1>
      </div>
    )
  }
}
class Change extends Component {
  render() {
    return (
      <div>
        <h1>便参数{this.props.match.params.id}</h1>
        <button
          onClick={() => {
            this.props.history.push('/change/{lalala:lalala}')
          }}
        >
          come on
        </button>
      </div>
    )
  }
}
class C1 extends Component {
  render() {
    return (
      <h2>这是c1</h2>
    )
  }
}
class C2 extends Component {
  render() {
    return (
      <h3>这是c2</h3>
    )
  }
}
class C3 extends Component {
  render() {
    return (
      <h4>这是c3</h4>
    )
  }
}

