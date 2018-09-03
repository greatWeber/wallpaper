
/**
 * 后台首页
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */

import React, {Component} from 'react';

import {connect} from 'react-redux';


/**
 * @Author   我贼帅
 * @DateTime 2018-07-31
 * [connect](https://www.jianshu.com/p/1a2f3db4af61)
 */
@connect((state, props)=>{
    config: state.config
})


export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {},
        }
    }

    componentDidMount(){
        console.log(this.props);
    }

    render(){
        return (
            <h1>关于此项目</h1>
            )
    }

}
