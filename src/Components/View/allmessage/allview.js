import React, { Component } from "react";
import "./Allmessage.css";

export default class Allview extends React.Component {
  render() {
    return (
      <div className="Allview_main">
        <div className="Allview_name">{this.props.nickname}</div>
        <div className="Allview_body">
          <span> {this.props.message}</span>
        </div>
      </div>
    );
  }
}
