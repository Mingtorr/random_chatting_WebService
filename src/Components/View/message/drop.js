import React from "react";
import "./Test.css";

export default class Dropmessage extends React.Component {
  render() {
    return (
      <div className="drop_message">
        <span className="drop_messagebody">{this.props.message}</span>
        <span className="drop_messagetime">{this.props.time}</span>
      </div>
    );
  }
}
