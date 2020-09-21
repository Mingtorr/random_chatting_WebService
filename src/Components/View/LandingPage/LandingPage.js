import React, { Component } from "react";
import "./LandingPage.css";
import MenuIcon from "@material-ui/icons/Menu";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import FiberNewRoundedIcon from "@material-ui/icons/FiberNewRounded";
import Start from "../../Utils/Start/Start.js";
import Moddal from "../../Utils/Modal/Moddal";
import io from "socket.io-client";
import Event from "./event.png";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Soju from "./soju.png";
const socket = io("http://localhost:3001");

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      toggle: false,
      admin: false,
      open: false,
      progress: "",
      newmessage: false,
      userid: JSON.parse(localStorage.getItem("user")).user_id,
      openEvent: false,
    };
  }

  handleOpen = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  onClick1 = (e) => {
    this.setState({
      count: 1,
      toggle: false,
    });
  };
  onClick2 = (e) => {
    this.setState({
      count: 1,
      toggle: true,
    });
  };
  onClick3 = (e) => {
    this.setState({
      count: 3,
      toggle: false,
    });
  };
  onClick4 = (e) => {
    this.setState({
      count: 4,
      toggle: false,
    });
  };
  onClick5 = (e) => {
    this.setState({
      count: 5,
      toggle: false,
    });
  };

  modalopenEvent = (e) => {
    e.preventDefault();
    this.setState({
      openEvent: true,
    });
  };
  modalcloseEvent = (e) => {
    e.preventDefault();
    this.setState({
      openEvent: false,
    });
  };

  handleToggle = (e) => {
    this.setState({ toggle: !this.state.toggle });
  };

  toggleClose = (e) => {
    if (this.state.toggle === true) {
      this.setState({ toggle: false });
    }
  };
  componentWillMount() {
    socket.emit("start join", this.state.userid);
    const userid = {
      userid: this.state.userid,
    };
    socket.emit("newmark", this.state.userid);

    socket.on("newmarking", (userid) => {
      this.setState({
        newmessage: true,
      });
    });

    if (localStorage.getItem("user") === null) {
      window.location.href = "/";
      alert("로그인해라");
    }
  }

  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  goMsg = (e) => {
    window.location.replace("/Message_collect");
  };

  render() {
    return (
      <div className="Container_landing" onClick={this.toggleClose}>
        {/* 메시지 햄버거 */}
        <div className="Set_landing">
          <button onClick={this.handleOpen} className="Btn_landing">
            <MenuIcon style={{ fontSize: 50, color: "white", marginTop: 5 }} />
          </button>
          {this.state.open ? (
            <Moddal closePopup={this.handleOpen.bind(this)} />
          ) : null}

          {this.state.newmessage ? (
            <div onClick={this.goMsg} style={{ paddingRight: "12%" }}>
              <ChatBubbleOutlineIcon
                style={{
                  fontSize: 50,
                  color: "white",
                  marginTop: 10,
                  position: "absolute",
                }}
              />
              <FiberNewRoundedIcon
                style={{
                  fontSize: 20,
                  color: "#f05052",
                  zIndex: "1",
                  position: "absolute",
                  marginTop: "10px",
                  marginLeft: "31px",
                  marginBottom: "40px",
                }}
              />{" "}
            </div>
          ) : (
            <div onClick={this.goMsg} style={{ paddingRight: "12%" }}>
              <ChatBubbleOutlineIcon
                style={{
                  fontSize: 50,
                  color: "white",
                  marginTop: 10,
                  position: "absolute",
                }}
              />{" "}
            </div>
          )}
        </div>

        {/* 제목 */}
        <div className="Title_landing">
          <span className="Title1_landing">창원대 과팅앱</span>
          <span className="Title2_landing">와글와글</span>
          <span className="Title3_landing">우리... 할래요 ?</span>
        </div>

        <div className="Title_landing">
          <button className="Toggle_landing" onClick={this.handleToggle}>
            {this.state.count} : {this.state.count} 과팅 ▼
          </button>

          {this.state.toggle === false ? (
            <div />
          ) : (
            <div className="ToggleTitle_landing">
              <button onClick={this.onClick1} className="Toggle2_landing">
                1 : 1 과팅
              </button>
              <button onClick={this.onClick2} className="Toggle2_landing">
                다중매칭은 준비중입니다.
              </button>
            </div>
          )}
        </div>
        <div className="Title_landing">
          <Start count={this.state.count} />
        </div>
        <Dialog
          open={this.state.openEvent}
          onClose={this.modalcloseEvent}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            <img src={Soju} width="30px" height="30px" />
            소주한병 쿠폰
            <img src={Soju} width="30px" height="30px" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              사용방법: <br />
              1. 사장님께 보여주고 소주받기!!" <br />
              2. 사장님께 감사인사 전하기!! <br />
              <br />
              주의사항: <br />
              1. 한 테이블당 한번만! <br />
              2. 쿠폰 양심껏 사용하기
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <div className="event_url" onClick={this.modalopenEvent}>
          <img src={Event} />
          <p>이벤트</p>
        </div>
      </div>
    );
  }
}
