import React, { Component } from 'react'
import './Test.css';


export default class Sendfrom extends Component {
    render() {
        return (
            <div className = "Send_from">
                <span className = "Send_from2">
                    {this.props.message}
                </span>
                <span className = "Send_from3">
                        {this.props.time}
                </span>
            </div>
        )
    }
}
