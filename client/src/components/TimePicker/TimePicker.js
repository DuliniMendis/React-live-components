import React from 'react';
import './TimePicker.css';


const now = new Date();

export default class TimePicker extends React.Component {

  constructor(props){
    super(props);
    this.state={
      hour:this.props.hour?this.props.hour:now.getHours(),
      minute:this.props.minute?this.props.minute:now.getMinutes(),
    }
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      hour:this.props.hour?this.props.hour:now.getHours(),
      minute:this.props.minute?this.props.minute:now.getMinutes(),
    })
  }



  selectHour = (evt) => {
    evt.stopPropagation();
    this.setState({hour:evt.target.innerHTML},()=>{
      this.props.changeValues(this.state);
    });
  }

  selectMinute = (evt) => {
     evt.stopPropagation();
    this.setState({minute:evt.target.innerHTML},()=>{
      this.props.changeValues(this.state);
    });
  }


  render() {

    let hours = [];
    for(let i=0;i<24;i++){
      let num = i.toString();
      if(i<10)
        num = "0"+num;
      hours.push(num);
    }


    let minutes = [];
    for(let i=0;i<59;i++){
      let num = i.toString();
      if(i<10)
        num = "0"+num;
      minutes.push(num);
    }

    let displayMode = this.props.isVisible ? "block" : "none";
    let heightVal = this.props.isVisible ? "150px" : "0px";

    let style = {display:displayMode, height:heightVal, top:this.props.y, left:this.props.x};
    if(this.props.isUp)
       style = {display:displayMode, height:heightVal, bottom:this.props.y, left:this.props.x};


     return (
       
      <div className="timePickerContainer" style={style}>
      <div className="timePickerInner">
      <div className="header-time">
          <div className="header-item-time">Hours</div>
          <div className="header-item-time">Minutes</div>
      </div>
        <div className="column-time">
          {hours.map((item,i)=>{
            if(item===this.state.hour)
              return (<div className="item-time selected" key={"ctih"+i} onClick={this.selectHour}>{item}</div>);
            else
              return (<div className="item-time" key={"ctih"+i} onClick={this.selectHour}>{item}</div>);
          })}
        </div>
        <div className="column-time">
        
         {minutes.map((item,i)=>{
            if(item===this.state.minute)
              return (<div className="item-time selected" key={"ctim"+i} onClick={this.selectMinute}>{item}</div>);
            else
              return (<div className="item-time" key={"ctim"+i} onClick={this.selectMinute}>{item}</div>);
          })}
        </div>
      </div>
      </div>

      

         
       );
   }

 
}

