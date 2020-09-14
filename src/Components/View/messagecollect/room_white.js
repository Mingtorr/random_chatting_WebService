import React, { Component } from "react";
import "./message_collect.css";
import io from "socket.io-client";

const socket = io("http://localhost:3001/");
export default class Messageroom extends React.Component {
  constructor(props) {
    super(props);
    this.setState = {
      name: "",
      body: "",
    };
  }
  componentWillMount() {}

  onClick = (e) => {
    window.location.href =
      "/message?touserid=" +
      `${this.props.name}` +
      "&roomname=" +
      `${this.props.roomname}`;
  };
  dropclick = (e) => {
    const post = {
      userid: this.props.userid,
      touserid: this.props.name,
    };
    const post2 = {
      userid: this.props.userid,
      touserid: this.props.name,
      roomname: this.props.roomname,
    };
    socket.emit("dropmessage", post2); //123213213213213213213213213213
    socket.emit("roomout", post);
    fetch("http://localhost:3001/droproom", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    }).then(window.location.reload(true));
  };
  render() {
    return (
      <div className="messagewhite">
        <div className="messageroom_main" onClick={this.onClick}>
          <div className="messageroom_img"></div>
          <div className="messageroom_body">
            <div className="messageroom_body_name">{this.props.name}</div>
            <div className="messageroom_body_main">{this.props.body}</div>
          </div>
        </div>
        <div className="messageroom_button">
          <button onClick={this.dropclick}>x</button>
        </div>
      </div>
    );
  }
}
