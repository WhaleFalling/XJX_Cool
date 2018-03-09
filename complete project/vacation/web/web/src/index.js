import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


//引入redux组件
import { Provider } from 'react-redux';
import store from './redux/store'


const AppRoot = () => {
    return (

        <Provider store={store}>
            <App />
        </Provider>

    )

}


ReactDOM.render(<AppRoot />, document.getElementById('root'));
registerServiceWorker();
