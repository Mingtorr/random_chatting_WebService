import React, { Component } from "react";
import "./Test.css";

export default class Sendfrom extends Component {
  render() {
    return (
      <div className="Send_from">
        <pre className="Send_from2">{this.props.message}</pre>
        <span className="Send_from3">{this.props.time}</span>
      </div>
    );
  }
}
