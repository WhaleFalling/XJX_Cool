import React from 'react'
import Link from 'next/link'
import Head from 'next/head';

import 'isomorphic-fetch'


export default class extends React.Component {


  //第一次载入加载数据
  static async getInitialProps({ pathname, query, asPath, req, res, jsonPageRes, err }) {
    if(!req){
      let view_width=window.width;
      alert("这是前端");
    }
    console.log(pathname, query, asPath, req, res, jsonPageRes, err );

    let data = await fetch("http://localhost:3000/list", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let list = await data.json();


    return {
      photoList: list,
    }

    // .then((response) => {
    //   if (response.status == 200) {
    //     return response;
    //   } else {
    //     throw { message: response.statusText, status: response.status };
    //   }
    // }).then((response) => {
    //   return response.json();
    // }).then((json) => {
    //   resolve(json);
    // }).catch((err) => {
    //   reject(err);
    // });
  }

  constructor(props) {
    super();
    this.state = {
      photoList: props.photoList,
      activeIndex: 0
    }
  }

  handler_click() {
    this.setState({ count: this.state.count + 1 });
  }

  go_index(n) {
    this.setState({ activeIndex: n });
  }

  handler_go_prev() {
    this.state.activeIndex > 0 && this.go_index(this.state.activeIndex - 1)
  }

  handler_go_next() {
    this.state.activeIndex < this.state.photoList.length-1 && this.go_index(this.state.activeIndex + 1)
  }

  render() {
    return (
      <div className="mobile_ppt">
        <Head>
          <meta charset="utf-8" />
          <title>二组练习用</title>
          <link rel="stylesheet" type="text/css" href="css/ppt.css" />
          <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        </Head>
        <ul className="section_list">
          {
            this.state.photoList.map((v, k) => {
              let index_class = k == this.state.activeIndex ? 'active' : (this.state.activeIndex > k ? 'prev' : 'next');
              console.log(index_class);
              return (
                <li key={k} className={`section ${index_class}`}><img src={`img/${v}`} alt="" className="bg_photo" />
                </li>
              )
            })
          }
        </ul>
        <span className="btn_up" onClick={this.handler_go_prev.bind(this)}></span>
        <span className="btn_down" onClick={() => this.handler_go_next()}></span>
      </div>
    );
  }
}



// () => (
//   <ul>
//     <li><Link href='/b' as='/a'><a>a</a></Link></li>
//     <li><Link href='/a' as='/b'><a>b</a></Link></li>
//   </ul>
// )