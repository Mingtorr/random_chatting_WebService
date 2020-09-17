import React, { Component } from "react";
import io from "socket.io-client";
import "./Test.css";
import Sendme from "./Sendme";
import Sendfrom from "./Sendfrom";
import queryStirng from "query-string";
import Dropmessage from "./drop";
import ScrollToBottom from "react-scroll-to-bottom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const socket = io();

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: JSON.parse(localStorage.getItem("user")).user_id,
      roomname: "",
      touserid: "",
      message: "",
      messages: [],
      premsg: [],
    };
  }

  componentWillMount() {
    const { search } = window.location; // 문자열 형식으로 결과값이 반환된다.
    const queryObj = queryStirng.parse(search); // 문자열의 쿼리스트링을 Object로 변환
    console.log(queryObj.roomname);
    this.setState({
      touserid: queryObj.touserid,
      roomname: queryObj.roomname,
    });
    const post = {
      _id: this.state.userid,
      touser: queryObj.touserid,
    };
    socket.on("dropmessage2", (post2) => {
      const row = {
        userid: post2.userid,
        touser: post2.touserid,
        roomname: post2.roomname,
        drop: 1,
        body: "상대방이 나갔습니다.",
      };
      console.log("시바바바ㅏ바밥바바바바바바바바" + row);
      this.setState({
        messages: [...this.state.messages, row],
      });
    });
    fetch("api/messageshow", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        json.map((row) => {
          const newtime = new Date(row.message_time);
          var hour = newtime.getHours();
          var min = newtime.getMinutes();
          var messagetime = [hour, min].join("시");
          messagetime = messagetime.concat("분");
          const newrow = row;
          newrow.message_time = messagetime;
          console.log(newrow);
          this.setState({
            premsg: [...this.state.premsg, newrow],
          });
          console.log(this.state.premsg);
          return null;
        });
      });
    console.log("시발라마 제발 되라" + queryObj.roomname);
    //event 발생
    socket.emit("roomjoin", queryObj.roomname);
    //on 받아오기
    socket.on("new message", (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
      console.log(this.state.messages);
    });
  }
  onchage = (e) => {
    this.setState({
      message: e.target.value,
    });
    console.log(this.state.message);
  };

  onclick = () => {
    var sysdate = new Date();
    var hour = sysdate.getHours();
    var min = sysdate.getMinutes();
    var messagetime = [hour, min].join("시");
    messagetime = messagetime.concat("분");
    console.log(messagetime);
    this.setState({
      message: "",
    });
    const post_1 = {
      body: this.state.message,
      userid: this.state.userid,
      touser: this.state.touserid,
      roomname: this.state.roomname,
      time: messagetime,
    };
    const post_2 = {
      body: this.state.message,
      userid: this.state.userid,
      touser: this.state.touserid,
      roomname: this.state.roomname,
    };
    fetch("api/message", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post_2),
    }).then();
    socket.emit("send message", post_1);
    fetch("api/last", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post_2),
    }).then();
  };
  goMcoll = (e) => {
    window.location.replace("/Message_collect");
  };
  render() {
    return (
      <div className="Container_test">
        <div className="Title_Test">
          <ArrowBackIcon style={{ fontSize: "50px" }} onClick={this.goMcoll} />
          <span className="Chat_test">채팅방</span>
        </div>
        <div className="message_table">
          <ScrollToBottom className="scrollbottom">
            {this.state.premsg.map((message) => {
              if (message.message_drop === 1) {
                return (
                  <Dropmessage
                    message={message.message_body}
                    time={message.message_time}
                  />
                );
              } else {
                if (this.state.userid === message.message_userid) {
                  return (
                    <Sendme
                      message={message.message_body}
                      time={message.message_time}
                    />
                  );
                } else {
                  return (
                    <Sendfrom
                      message={message.message_body}
                      time={message.message_time}
                    />
                  );
                }
              }
            })}
            {this.state.messages.map((message) => {
              if (message.drop === 1) {
                return (
                  <Dropmessage message={message.body} time={message.time} />
                );
              } else {
                if (this.state.userid === message.userid) {
                  console.log(message);
                  return <Sendme message={message.body} time={message.time} />;
                } else {
                  console.log(message);
                  return (
                    <Sendfrom message={message.body} time={message.time} />
                  );
                }
              }
            })}
          </ScrollToBottom>
        </div>

        <div className="Input_test">
          <input value={this.state.message} onChange={this.onchage} />
          <button onClick={this.onclick} className="Btn_test">
            입력
          </button>
        </div>
      </div>
    );
  }
}
