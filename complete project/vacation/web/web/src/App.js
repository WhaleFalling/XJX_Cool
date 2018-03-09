import React, { Component } from 'react';
import './App.css';
import 'moment/locale/zh-cn';
import Layout from './component/layout';
import LoginPage from './component/login_page';

import { connect } from 'react-redux';
import actionTypes from './redux/actionTypes';

import { BrowserRouter } from 'react-router-dom';


class App extends Component {
  render() {
    const { isLogin, isMount } = this.props;
    if (isLogin || !isMount) {
      this.props.dispatch(actionTypes.create(actionTypes.SET_VIEW_IS_MOUNT,false));
      return (
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      );
    } else {
      return (
        <LoginPage />
      )
    }

  }
}

export default connect(state => ({
  isLogin: state.get("isLogin"),
  isMount: state.getIn(["view", "isMount"])
}))(App);
