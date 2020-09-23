import React, { Component } from "react";
import "./Test.css";

export default class Sendme extends Component {
  render() {
    return (
      <div className="Sendme_con">
        <span className="Sendme_in">{this.props.message}</span>
        <span className="Sendme_in2">{this.props.time}</span>
      </div>
    );
  }
}
