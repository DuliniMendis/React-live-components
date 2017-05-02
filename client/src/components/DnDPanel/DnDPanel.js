import React from "react";
import { DropTarget } from 'react-dnd';
import DnDItem from "../DnDItem";
import './DnDPanel.css';

const panelTarget = {
  drop(props,monitor,component) {
    let item = monitor.getItem();

    if (props) {
      console.log(props.label,item.label);
    }

  }
};


const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}


 class DnDPanel extends React.Component {

  render() {
    let width = Math.floor(window.innerWidth/this.props.numPanels);
    console.log(width)
    const {connectDropTarget} = this.props;
    
    return connectDropTarget(
      <div className="panel-container" style={{width:width}}>
     
        <div className="panel panel-default" >

            <div className="panel-heading text-center">
              {this.props.label}            
            </div>
            <div className="scrollbar" id="scrollbar-style">
              <div className="panel-body">             
                  
                    {this.props.items.map((item) => (
                          <DnDItem key={"dndi"+item.code} 
                          code={item.code} 
                          label={item.label} />
                          
                      ))}         
                  
              </div>
            </div>
        </div>
      </div> 
    
    );
  }
}


const ItemTypes = {
  DNDITEM: 'dndItem'
};


export default DropTarget(ItemTypes.DNDITEM, panelTarget, collect)(DnDPanel)