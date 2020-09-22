import React, { Component } from "react";
import "./Test.css";

export default class Sendme extends Component {
  render() {
    return (
      <div className="Sendme_con">
        <pre className="Sendme_in">{this.props.message}</pre>
        <span className="Sendme_in2">{this.props.time}</span>
      </div>
    );
  }
}
