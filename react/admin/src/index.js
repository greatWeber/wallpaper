import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './config';

import configure from './store/configureStore';

import {Provider} from 'react-redux';


const store = configure({config: global.gconfig});

const fontSize = () =>{
    let doc = document.documentElement;
    let clientWidth = doc.clientWidth;
    doc.style.fontSize = clientWidth / 19.8 +"px";
}

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , 
    document.getElementById('root'));
registerServiceWorker();

fontSize();

window.addEventListener('resize', ()=>{
    fontSize();
})