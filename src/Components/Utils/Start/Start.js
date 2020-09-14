import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./Start.css";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: JSON.parse(localStorage.getItem("user")).user_id,
      sex: JSON.parse(localStorage.getItem("user")).user_sex,
      nick: JSON.parse(localStorage.getItem("user")).user_nickname,
    };
  }

  componentWillMount() {
    setInterval(
      socket.on("apply", () => {
        setInterval(
          socket.emit("matching", this.state._id, this.state.sex),
          3000
        );
      }),
      3000
    );
  }

  onMatching = () => {
    socket.emit("start", this.state._id, this.state.nick, this.state.sex);

    socket.on("matching_success", () => {
      console.log("매칭성공");
      socket.emit("room_join", this.state._id, this.state.sex);
      alert("매칭성공");
      socket.disconnect();
    });
  };
  componentDidMount() {}

  render() {
    //기존
    // const {count} = this.state;
    return this.props.count === 1 ? (
      <div>
        <button className="Font_start" onClick={this.onMatching}>
          {" "}
          매칭 시작!{" "}
        </button>
      </div>
    ) : (
      <div>
        <button className="Font2_start"> 매칭 찾기! </button>
      </div>
    );

    //기존
    // count === 5 ?
    // <div>
    //     <Link to ="#">
    //         <button onClick={() => this.update(count)} className = "Font">{count} : {count} 과팅</button>
    //     </Link>
    // </div>
    // :
    // <div>
    //     <Link to ="#">
    //         <button onClick={() => this.modify(count + 1)} className = "Font">{count} : {count} 과팅</button>
    //     </Link>
    // </div>
  }
}
