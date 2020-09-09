import React, { Component } from "react";
import './message_collect.css';
import io from 'socket.io-client';


const socket = io('http://localhost:3001/message_collect');
export default class Messageroom extends React.Component{
    constructor(props){
        super(props);
        this.setState={
            name:'',
            body:''
        }
    }
    componentWillMount(){
      socket.on('test2',userid=>{
          socket.emit('test',userid);
      })
        
    }
    onClick=()=>{
        const userid = 'jybin96'
        socket.emit('test',userid);
    }
    render(){
        return(
            <div className="messagewhite">
                <div className="messageroom_main">
                    <div className="messageroom_img">

                    </div>
                    <div className="messageroom_body">
                        <div className="messageroom_body_name">
                            {this.props.name}
                        </div>
                        <div className="messageroom_body_main">
                            {this.props.body}
                        </div>
                        
                    </div>
                    <div className="messageroom_button">
                        <button onClick={this.onClick}>x</button>
                    </div>
                </div>
            </div>
            
        )
    }
}