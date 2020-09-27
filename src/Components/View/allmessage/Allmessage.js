import React, { Component } from "react";
import "./Allmessage.css";
import plane from "./plane.png";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import Allview from "./allview";
import Allview2 from "./allview2";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Photos from "./photos.png";
const socket = io("http://localhost:3001");

export default class Allmessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: JSON.parse(localStorage.getItem("user")).user_id,
      userid: JSON.parse(localStorage.getItem("user")).user_realid,
      message: "",
      messages: [],
      member: 0,
      open: false,
    };
  }
  componentWillMount() {
    var user_realid = JSON.parse(localStorage.getItem("user")).user_realid;

    const box2 = {
      user_realid: user_realid,
    };
    fetch("api/Ben", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(box2),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.benTF === false) {
          alert("신고가 접수 되어 이용이 불가합니다");
          window.location.replace("/");
        }
      });
    fetch("api/allmatchGetMessage", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((res) => res.json())
      .then((json) => {
        json.map((row) => {
          const newrow = {
            nickname: row.waglegroup_nickname,
            message: row.waglegroup_message,
            userid: row.waglegroup_userid,
          };
          this.setState({
            messages: [...this.state.messages, newrow],
          });
        });
      });

    socket.emit("start join", this.state.nickname);
    socket.emit("allroomjoin", this.state.userid);
    socket.on("clientnum", (numb) => {
      this.setState({
        member: numb,
      });
    });
    socket.on("recieve allmessage", (post) => {
      this.setState({
        messages: [...this.state.messages, post],
      });
    });
    socket.on("successmatching", (matching_info) => {
      this.setState({
        open: true,
      });
    });
  }
  modalopen = (e) => {
    e.preventDefault();
    this.setState({
      open: true,
    });
  };
  modalclose = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
    });
  };
  onchage = (e) => {
    this.setState({
      message: e.target.value,
    });
  };
  onclickSend = (e) => {
    const post = {
      nickname: this.state.nickname,
      message: this.state.message,
      userid: this.state.userid,
    };
    socket.emit("send allmessage", post);
    this.setState({
      message: "",
    });
  };
  onclickDiscon = (e) => {
    socket.emit("disconnectallmessage", this.state.userid);
    window.location.replace("/main");
  };
  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.modalclose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title2">
            <img id="photos" src={Photos} width="30vw" height="30vw" />
            {"매칭 완료!"}
            <div className="photos"></div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              매칭이 완료 되었습니다.
              <br />
              메시지함으로 들어가세요.
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <div className="allmessage_main">
          <div className="allmessage_title">
            <div className="arrowbackdiv">
              <ArrowBackIcon
                style={{ fontSize: "50px", float: "left" }}
                onClick={this.onclickDiscon}
              />
            </div>
            <div className="arrowbackdiv2">와글 와글 채팅방</div>
          </div>
          <div className="allmessage_people">
            <div>참여자:{this.state.member}명</div>
          </div>
          <div className="allmessage_message_main">
            <ScrollToBottom className="scrollbottom2">
              {this.state.messages.map((message) => {
                if (message.nickname === this.state.nickname) {
                  return (
                    <Allview
                      nickname={message.nickname}
                      message={message.message}
                    />
                  );
                } else {
                  return (
                    <Allview2
                      nickname={message.nickname}
                      message={message.message}
                    />
                  );
                }
              })}
            </ScrollToBottom>
          </div>
          <div className="Input_test">
            <input value={this.state.message} onChange={this.onchage} />
            {this.state.message.trim() === "" ? (
              <button className="Btn_test">
                <img src={plane} width="25px" height="25px" />
              </button>
            ) : (
              <button onClick={this.onclickSend} className="Btn_test">
                <img src={plane} width="25px" height="25px" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
