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
import Heart from "./heart.png";
import Triangle from "./triangle.png";
import Explain from "../../Utils/Modal/Explain";
import Caution from "../../Utils/Modal/Caution";

const socket = io();

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
      openEvent2: false,
      openEvent3: false,
      openEvent4: false,
      use: false,
      caution: false,
    };
  }

  handleUse = () => {
    this.setState({
      use: !this.state.use,
    });
  };

  handleCau = () => {
    this.setState({
      caution: !this.state.caution,
    });
  };

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
  modalopenEvent2 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent2: true,
    });
  };
  modalcloseEvent2 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent2: false,
    });
  };
  modalopenEvent3 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent3: true,
    });
  };
  modalcloseEvent3 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent3: false,
    });
  };
  modalopenEvent4 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent4: true,
    });
  };
  modalcloseEvent4 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent4: false,
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
          <div className="Title_use">
            <span className="Title4_landing" onClick={this.modalopenEvent2}>
              설명서
            </span>
            <span className="Title4_landing" onClick={this.modalopenEvent3}>
              주의사항
            </span>
          </div>

          <div className="Title_usee">
            <button onClick={this.modalopenEvent4} className="Btn_landing">
              <MenuIcon
                style={{ fontSize: 50, color: "white", marginTop: 5 }}
              />
            </button>

            {this.state.newmessage ? (
              <div onClick={this.goMsg}>
                <ChatBubbleOutlineIcon
                  style={{
                    fontSize: 50,
                    color: "white",
                    marginTop: 10,
                  }}
                />
                <FiberNewRoundedIcon
                  style={{
                    fontSize: 30,
                    color: "#f05052",
                    zIndex: "1",
                    position: "absolute",
                    marginTop: "20px",
                    marginLeft: "-41px",
                    marginBottom: "40px",
                  }}
                />{" "}
              </div>
            ) : (
              <div onClick={this.goMsg}>
                <ChatBubbleOutlineIcon
                  style={{
                    fontSize: 50,
                    color: "white",
                    marginTop: 10,
                  }}
                />{" "}
              </div>
            )}
          </div>
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
          open={this.state.openEvent4}
          onClose={this.modalcloseEvent4}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent id="sibal">
            <DialogContentText id="alert-dialog-description">
              <Moddal />
            </DialogContentText>
          </DialogContent>
        </Dialog>
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
        <Dialog
          open={this.state.openEvent2}
          onClose={this.modalcloseEvent2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {" "}
            <img src={Heart} width="20px" height="20px" />
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;설명서 &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              1. 매칭을 누른다.
              <br />
              <br />
              2. 매칭이 되면 우측상단의 메시지함 버튼을 누른다.
              <br />
              <br />
              3. 자유로운 채팅을 즐긴다.
              <br />
              <br />
              4. 다음 매칭을 즐기려면 메시지함을 삭제한다.
              <br />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openEvent3}
          onClose={this.modalcloseEvent3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {" "}
            <img src={Triangle} width="20px" height="20px" />
            &nbsp;&nbsp;&nbsp;&nbsp; 주의사항 &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              1. 화면 내 버튼만 사용해서 이동해야합니다.
              <br />
              <br />
              2. 카카오톡 브라우저로 접속하면 느려요.
              <br />
              ex) 삼성 인터넷, 사파리 등을 권장드립니다.
              <br />
              <br />
              3. 모바일 접속을 권장드립니다.
              <br />
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
