import React, { Component } from "react";
import io from "socket.io-client";
import "./Test.css";
import Sendme from "./Sendme";
import Sendfrom from "./Sendfrom";
import queryStirng from "query-string";
import Dropmessage from "./drop";
import ScrollToBottom from "react-scroll-to-bottom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import plane from "./plane.png";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const socket = io("http://localhost:3001");

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realid: JSON.parse(localStorage.getItem("user")).user_realid,
      torealid: "",
      userid: JSON.parse(localStorage.getItem("user")).user_id,
      roomname: "",
      touserid: "",
      message: "",
      messages: [],
      premsg: [],
      open: false,
      open2: false,
    };
  }

  componentWillMount() {
    const { search } = window.location; // 문자열 형식으로 결과값이 반환된다.
    const queryObj = queryStirng.parse(search); // 문자열의 쿼리스트링을 Object로 변환

    this.setState({
      touserid: queryObj.touserid,
      roomname: queryObj.roomname,
    });
    const post = {
      _id: this.state.userid,
      touser: queryObj.touserid,
    };
    fetch("api/torealidcheck", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        json.map((user) => {
          if (
            user.message_realid === this.state.realid ||
            user.message_realid === null
          ) {
          } else {
            this.setState({
              torealid: user.message_realid,
            });
          }
        });
      });
    socket.on("dropmessage2", (post2) => {
      const row = {
        userid: post2.userid,
        touser: post2.touserid,
        roomname: post2.roomname,
        drop: 1,
        body: "상대방이 나갔습니다.",
      };

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
          var messagetime = [hour, min].join(" : ");
          messagetime = messagetime.concat("");
          const newrow = row;
          newrow.message_time = messagetime;

          this.setState({
            premsg: [...this.state.premsg, newrow],
          });

          return null;
        });
      });

    //event 발생
    socket.emit("roomjoin", queryObj.roomname);
    //on 받아오기
    socket.on("new message", (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
      if (message.realid === this.state.realid || message.realid === null) {
      } else {
        this.setState({
          torealid: message.realid,
        });
      }
    });
  }
  onchage = (e) => {
    this.setState({
      message: e.target.value,
    });
  };
  onchage2 = (e) => {
    this.setState({
      badguy_body: e.target.value,
    });
  };
  modalopen1 = (e) => {
    e.preventDefault();
    this.setState({
      open: true,
    });
  };
  modalclose1 = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
    });
  };
  modalopen2 = (e) => {
    e.preventDefault();
    this.setState({
      open2: true,
    });
  };
  modalclose2 = (e) => {
    e.preventDefault();
    this.setState({
      open2: false,
    });
  };
  onclick = () => {
    var sysdate = new Date();
    var hour = sysdate.getHours();
    var min = sysdate.getMinutes();
    var messagetime = [hour, min].join(" : ");
    messagetime = messagetime.concat("");

    this.setState({
      message: "",
    });
    const post_1 = {
      realid: this.state.realid,
      body: this.state.message,
      userid: this.state.userid,
      touser: this.state.touserid,
      roomname: this.state.roomname,
      time: messagetime,
    };
    const post_2 = {
      realid: this.state.realid,
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
  singoclick = (e) => {
    const post = {
      userid: this.state.userid,
      touserid: this.state.touserid,
      badguy_body: this.state.badguy_body,
      realid: this.state.realid,
      torealid: this.state.torealid,
      message: this.state.premsg,
      message2: this.state.messages,
    };

    fetch("api/singouser", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    }).then();
    this.setState({
      open2: true,
      open: false,
      badguy_body: "",
    });
  };
  render() {
    return (
      <div className="Container_test">
        {/* <div className="Title_Test">
          <ArrowBackIcon style={{ fontSize: "50px" }} onClick={this.goMcoll} />
          <span className="Chat_test">채팅방</span>
        </div> */}
        <Dialog
          open={this.state.open2}
          onClose={this.modalclose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              신고가 완료되었습니다.
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.open}
          onClose={this.modalclose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            <div className="singo_title_title">상대방 신고</div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>빠르게 즉각적으로 처리해드리겠습니다.</p>
              <div className="user_singo_div">
                <div className="user_singo_title">사유</div>
                <div className="user_singo_textarea">
                  <textarea
                    value={this.state.badguy_body}
                    onChange={this.onchage2}
                  />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="user_singo_button" onClick={this.singoclick}>
              신고하기
            </button>
          </DialogActions>
        </Dialog>
        <div className="message_table">
          <div className="Title_Test">
            <ArrowBackIcon
              style={{ fontSize: "50px" }}
              onClick={this.goMcoll}
            />
            <span className="Chat_test">채팅방</span>
            <span className="Chat_test2">
              <button onClick={this.modalopen1}>신고하기</button>
            </span>
          </div>
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
                  return <Sendme message={message.body} time={message.time} />;
                } else {
                  return (
                    <Sendfrom message={message.body} time={message.time} />
                  );
                }
              }
            })}
          </ScrollToBottom>
        </div>
        {/* cex  고쳐라 */}
        <div className="Input_test">
          <input value={this.state.message} onChange={this.onchage} />
          {this.state.message.trim() === "" ? (
            <button className="Btn_test">
              <img src={plane} width="25px" height="25px" />
            </button>
          ) : (
            <button onClick={this.onclick} className="Btn_test">
              <img src={plane} width="25px" height="25px" />
            </button>
          )}
        </div>
      </div>
    );
  }
}
