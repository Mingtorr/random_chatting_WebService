import React, { Component } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default class SocketIo2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: [],
      id: "1",
    };
  }
  componentWillMount() {
    socket.emit("room", this.state.id);
    socket.emit("start", false);
    socket.on("show message", (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
    });
  }
  onchange = (e) => {
    this.setState({
      message: e.target.value,
    });
    console.log(this.state.message);
  };
  onkeydown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      const user = {
        message: this.state.message,
        id: this.state.id,
      };
      socket.emit("send message", user);
      this.setState({
        message: "",
      });
    }
  };
  render() {
    return (
      <div>
        {this.state.messages.map((message, index) => {
          return <div>{message}</div>;
        })}
        <input
          onChange={this.onchange}
          value={this.state.message}
          onKeyDown={this.onkeydown}
        />
      </div>
    );
  }
}
