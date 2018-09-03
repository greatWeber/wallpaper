
/**
 * 后台首页
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */

import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Header} from '../components/header'


/**
 * @Author   我贼帅
 * @DateTime 2018-07-31
 * [connect](https://www.jianshu.com/p/1a2f3db4af61)
 */
@connect((state, props)=>{
    return {
        config: state.config
    }
    
})


export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {},
        }
    }

    componentDidMount(){
    }

    render(){
        return (
            <div>
            <Header />
                {this.props.children}
                
            </div>
            )
    }

}
