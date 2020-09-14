import React, { Component } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import "./message_collect.css";
import Messageroom_click from "./room_red";
import Messageroom_white from "./room_white";

const socket = io("http://localhost:3001/");

export default class Message_collect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: JSON.parse(localStorage.getItem("user")).user_id,
      messageroom: [],
    };
  }

  componentWillMount() {
    socket.emit("messageroomjoin", this.state.userid);
    const post = {
      userid: this.state.userid,
    };
    fetch("http://localhost:3001/message_collect", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        this.setState({
          messageroom: json,
        });
      });
    socket.on("roomout2", (post) => {
      const index = this.state.messageroom.findIndex(
        (x) => x.room_touserid === post.userid
      );
      console.log(index);
      if (index === -1) {
        fetch("http://localhost:3001/message_alldrop", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(post),
        });
      } else {
        const row = this.state.messageroom;
        row[index].room_lastmessage = "상대방이 나갔습니다.";
        row[index].room_lastuserid = post.userid;
        this.setState({
          messageroom: row,
        });
      }
    });
    socket.on("new messageroom", (post) => {
      console.log(post.userid);
      const index = this.state.messageroom.findIndex(
        (x) => x.room_touserid === post.userid
      );
      console.log(index);
      if (index === -1) {
        fetch("http://localhost:3001/message_alldrop", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(post),
        });
      } else {
        const row = this.state.messageroom;
        row[index].room_lastmessage = post.body;
        row[index].room_lastuserid = post.userid;
        this.setState({
          messageroom: row,
        });
      }
    });
  }

  render() {
    return (
      <div className="messagerow_main">
        <div className="messagerow_title">메시지 보관함</div>
        <div className="messagerow_scroll">
          <ScrollToBottom className="chat_scroll">
            {this.state.messageroom.map((messageroom) => {
              if (messageroom.room_lastuserid === this.state.userid) {
                return (
                  <Messageroom_white
                    userid={this.state.userid}
                    roomname={messageroom.room_roomname}
                    name={messageroom.room_touserid}
                    body={messageroom.room_lastmessage}
                  />
                );
              } else {
                return (
                  <Messageroom_click
                    userid={this.state.userid}
                    roomname={messageroom.room_roomname}
                    name={messageroom.room_touserid}
                    body={messageroom.room_lastmessage}
                  />
                );
              }
            })}
          </ScrollToBottom>
        </div>
      </div>
    );
  }
}
