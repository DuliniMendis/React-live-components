import React from "react";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Panel from "../DnDPanel";
import './DnDContainer.css';


class DnDContainer extends React.Component {

 constructor(props) {
  super(props);

  this.state = {
    panels: [{
              code:0,
              label:"Applied",
              items:[{
                code:0,
                label:"Apple"
              },
              {
                code:1,
                label:"Orange"
              }]
              },
              {
              code:1,
              label:"Screened",
              items:[]
              },
              {
              code:2,
              label:"Interviewed",
              items:[]
              },
              {
              code:3,
              label:"Shortlisted",
              items:[]
              },
              {
              code:4,
              label:"Offer",
              items:[]
              },
              {
              code:5,
              label:"Placed",
              items:[]
              },
    ]
    }
  
 }


render() {

  return (

      <div className="dnd-container">

         {this.state.panels.map((item) => (
                      <Panel 
                        key={"panel"+item.code} 
                        code={item.code} 
                        label={item.label}
                        items={item.items}
                        numPanels={this.state.panels.length} />
                      ))}
       
     </div>
    
    
    );
}
}


export default DragDropContext(HTML5Backend)(DnDContainer)

