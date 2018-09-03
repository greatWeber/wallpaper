/**
 * 标签列表
 * @authors 我贼帅
 * @date    2018-08-27 
 */

import React, {Component} from 'react'

import {connect} from 'react-redux'

import {browserHistory} from 'react-router'

import {fetchLabelList, fetchDelLabel} from '../actions'

import Table from '../components/table'

import {util} from '../utils'

let _this;
@connect((state, props)=>{
    return {
        config: state.config
    }
    
})


export default class catePic extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        thead : [
            {width: '10%',name:'id',title:'id'},
            {width: '10%',name:'name',title:'名称'},
            {width: '20%',name:'',title:'操作'}
        ],
        tbody : [],
        operation: [
            {name:'修改',type:1},
            {name:'删除',type:2}
        ]
      };
    }

    componentDidMount(){
        _this = this;
        this.getList();
    }

    getList = () => {
        this.props.dispatch(fetchLabelList({},(res)=>{
            console.log(res);
            let list = res.list;
            this.setState({
                tbody: list
            });
        }))
    }

    delFn = (e, id)=>{
        const r = window.confirm('确定删除?');
        if(r){
            console.log(id);
            
            this.props.dispatch(fetchDelLabel({id: id}, (res)=>{
                _this.getList();
            }))
        }
    }

    editFn = (e, id) => {
        console.log(id); 
        browserHistory.push(`/editLabel/${id}`);

    }

    jumpAddFn = () => {
        browserHistory.push('/addLabel');
    }

    render(){
        return (
                <div className="content">
                    <p className="title flex j-b">
                        <span className="title-name">标签分类列表</span>
                        <span className="title-add" onClick={this.jumpAddFn}>添加</span>
                    </p>
                    <Table thead={this.state.thead} tbody={this.state.tbody} operation={this.state.operation} delFn={this.delFn} editFn={this.editFn}/>
                </div>
            )
    }
}



