import React, { Component } from "react";
import "./Allmessage.css";

export default class Allview2 extends React.Component {
  render() {
    return (
      <div className="Allview_main">
        <div className="Allview_name">{this.props.nickname}</div>
        <div className="Allview_body2">
          <span> {this.props.message}</span>
        </div>
      </div>
    );
  }
}
