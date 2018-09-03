/**
 * 表格组件
 * @authors 我贼帅
 * @date    2018-08-08 
 */

import React, {Component} from 'react'

import '../styles/table.scss'

export default class Table extends Component {

    constructor(props) {
      super(props);
    
      this.state = {
        thead: null,
        tbody: null,
        operation: null
      };
    }
    /**
     * 修改(通用)
     * @Author   我贼帅
     * @DateTime 2018-08-22
     * @param    {[type]}   id [description]
     * @param    {[type]}   e  [description]
     * @return   {[type]}      [description]
     */
    editFn = (id, e) => {
        this.props.editFn(e, id);
    }

    delFn = (id, e) => {
        this.props.delFn(e, id);
    }

    componentDidMount(){
        
    }

    render(){
        console.log(this.props.tbody);
        let thead = this.props.thead.map((item)=>{
            return <th key={item.title} width={item.width}>{item.title}</th>
        });
        let len = this.props.thead.length;
        let tbody = this.props.tbody.map((tr, i)=>{
            return  <tr key={i}>
                {
                    this.props.thead.map((td, k)=>{
                        if(k == len-1){
                            return <td key={k}>
                            {
                                 this.props.operation.map((op, p)=>{
                                    switch (op.type) {
                                        case 1:
                                            // 修改
                                            return <a href="javascript:;" key={p} className="btn edit" onClick={this.editFn.bind(this,tr.id)}>{op.name}</a>
                                            break;
                                         case 2:
                                            // 删除
                                            return <a href="javascript:;" key={p} className="btn del" onClick={this.delFn.bind(this,tr.id)}>{op.name}</a>
                                            break;
                                        default:
                                            // statements_def
                                            return <a key={p}>{op.name}</a>
                                            break;
                                    }
                                })
                            }
                            </td>
                        }else{
                            return <td key={k}>{tr[td.name]}</td>
                        }
                        
                    })
                    
                }
            </tr>
        });

       
        return (
            <table className={this.props.className || "table"} cellPadding='0' cellSpacing='0'>
                <thead>
                    <tr>
                        {thead}  
                    </tr>
                </thead>
                <tbody>
                    {tbody}
                </tbody>
            </table>
        )
    }
}
