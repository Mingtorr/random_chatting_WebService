import React, { Component } from "react";
import './message_collect.css';

export default class Messageroom_click extends React.Component{

    constructor(props){
        super(props);
        this.setState={
            name:'',
            body:''
        }
    }
    componentWillMount(){
       
    }
  

    render(){
        return(
            <div className="messagered">
                <div className="messageroom_main_click">
                    <div className="messageroom_img">

                    </div>
                    <div className="messageroom_body">
                        <div className="messageroom_body_name_click">
                        {this.props.name}
                        </div>
                        <div className="messageroom_body_main_click">
                        {this.props.body}
                        </div>
                        
                    </div>
                    <div className="messageroom_button">
                        <button>x</button>
                    </div>
                </div>
            </div>
            
        )
    }
}