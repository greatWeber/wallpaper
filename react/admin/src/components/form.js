/**
 * 表单组件
 * @Author   我贼帅
 * @DateTime 2018-08-01
 */
import React, {Component} from 'react';
/**
 * 输入框组件
 * @Author   我贼帅
 * @DateTime 2018-08-01
 * class: css类名
 * type: 输入框类型
 * required: 是否必填
 * placeholder: 提示信息
 * name: 名称(标识)
 */
class Input extends Component{

    handleChange = (e)=>{
        this.props.handleChange(e.target); //状态提升
    }

    render(){
        return (
            <div className="form-item">
                <input className={this.props.class || 'form-input'} type={this.props.type} name={this.props.name} value={this.props.value} required={this.props.required || 'true'} placeholder={this.props.placeholder} onChange={this.handleChange}/>
            </div>

        )
    }
}

/**
 * 按钮组件
 * @Author   我贼帅
 * @DateTime 2018-08-01
 * class: css类名
 * type: 按钮类型
 * html: 名称
 */
class Button extends Component{

    handleChange = (e)=>{
        this.props.handleChange(e); //状态提升
    }

    render(){
        return (
            <div className="form-item">
                <button className={this.props.class || 'form-button'} type={this.props.type} onClick={this.handleChange}> {this.props.html || '按钮'}</button>
            </div>

        )
    }
}

/**
 * 输入框组件(带label)
 * @Author   我贼帅
 * @DateTime 2018-08-08
 * class: css类名
 * type: 输入框类型
 * required: 是否必填
 * placeholder: 提示信息
 * name: 名称(标识)
 */
class Linput extends Component {

    handleChange = (e)=>{
        this.props.handleChange(e.target); //状态提升
    }

    render(){
        return (
            <div className="form-item">
                <label className="form-label" htmlFor={this.props.name}>{this.props.label}</label>
                <input className={this.props.class || 'form-input'} type={this.props.type} name={this.props.name} value={this.props.value} required={this.props.required || 'true'} placeholder={this.props.placeholder} onChange={this.handleChange}/>
            </div>

        )
    }
}

/**
 * 上传文件组件
 * @Author   我贼帅
 * @DateTime 2018-08-08
 * class: css类名
 * name: 名称(标识)
 */
class Upload extends Component {

    constructor(props) {
      super(props);
    
      this.fileInput = React.createRef();
    }

    handleChange = (e)=>{
        this.props.handleChange(this.fileInput.files[0]); //状态提升
    }

    render(){
        return (
            <div className="form-item">
                <label className="form-label" htmlFor={this.props.name}>{this.props.label}</label>

                <label className={this.props.class || 'img-label'}>点击上传
                    <input type="file" ref={this.fileInput} name={this.props.name} onChange={this.handleChange}/>
                </label>
                <img className="img-show" src={this.props.src} alt="图片"/>
            </div>
            
        )
    }
}

/**
 * 下拉框组件
 * @Author   我贼帅
 * @DateTime 2018-08-08
 * class: css类名
 * name: 名称(标识)
 * options: 下拉框选项
 */
class Select extends Component {

    constructor(props) {
      super(props);
    
      this.state = {
        option: null
      };
    }

    handleChange = (e)=>{
        this.props.handleChange(e.target); //状态提升

    }

    componentDidMount(){
        // console.log(this.props.options);
        // this.optionRender();
    }


    render(){
        let option= this.props.options.map((item)=>{
           return <option key={item.id} value={item.id}>{item.name}</option>
        });
        return (
            <div className="form-item">
                <label className="form-label" htmlFor={this.props.name}>{this.props.label}</label>
                <select name={this.props.name} className="form-select" onChange={this.handleChange}>
                    {option}
                </select>
            </div>
            
        )
    }
}

/**
 * 添加标签组件
 * @Author   我贼帅
 * @DateTime 2018-08-08
 * @return   {[type]}   [description]
 */
class AddLabel extends Component {

    constructor(props) {
      super(props);
    
      this.state = {
        labels: null
      };
    }

    handleChange = (e)=>{
        this.props.handleChange(e.target ); //状态提升
    }

    handleClick = (e) => {
        this.props.handleClick(e); //状态提升

    }

    componentDidMount(){

    }

    labelRender = () => {
        let labels = this.props.labels.map((item)=>{
            return <span key={item.id} className="label-item">
                        <input id={item.id}  name={this.props.name} value={item.id} type="checkbox" onChange={this.handleChange}/>
                        <label  htmlFor={item.id} >{item.name}</label>
                    </span>
        });
        return labels

    }

    render(){
        let labels = this.labelRender();
        return (
            <div className="form-item">
                <label className="form-label" htmlFor={this.props.name}>{this.props.label}</label>
                {labels}
            </div>

        )
    }
}

export {
    Input,
    Button,
    Linput,
    Upload,
    Select,
    AddLabel
}