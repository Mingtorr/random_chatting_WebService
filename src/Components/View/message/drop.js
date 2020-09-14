import React, { Component } from "react";
import "./Test.css";

export default class Dropmessage extends React.Component {
  render() {
    return (
      <div className="drop_message">
        <span className="Send_from2">{this.props.message}</span>
        <span className="Send_from3">{this.props.time}</span>
      </div>
    );
  }
}
