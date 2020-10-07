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
import { Button } from "@material-ui/core";
import { json } from "body-parser";

const socket = io("http://localhost:3001");

export default class LandingPage extends Component {
  constructor(props) {
    super(props);

    if (localStorage.getItem("user") === null) {
      window.location.href = "/";
      alert("로그인해라");
    }

    this.state = {
      arrow_text: "1 : 1 과팅",
      count: 1,
      toggle: false,
      admin: false,
      open: false,
      progress: "",
      newmessage: false,
      userid: JSON.parse(localStorage.getItem("user")).user_id, // 임마가 닉네암
      changeid: "", //임마가 변경할 닉네임
      realid: JSON.parse(localStorage.getItem("user")).user_realid, // 임마는 id
      openEvent: false,
      openEvent2: false,
      openEvent3: false,
      openEvent4: false,
      openEvent5: false,
      openEvent6: false,
      use: false,
      caution: false,
      change_nickname_switch: true,
      noti: "",
    };
  }

  nickname_switch_true = () => {
    this.setState({
      change_nickname_switch: true,
    });
  };

  nickname_switch_false = () => {
    this.setState({
      change_nickname_switch: false,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

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
      arrow_text: "1 : 1 과팅",
    });
  };
  onClick2 = (e) => {
    this.setState({
      count: 2,
      toggle: false,
      arrow_text: "동성 친구",
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
  modalopenEvent5 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent5: true,
    });
  };
  modalcloseEvent5 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent5: false,
    });
  };

  check = (re, what, message) => {
    if (re.test(what)) {
      return true;
    }
    this.setState({
      openEvent6: true,
      changeNickText: message,
    });

    return false;
  };

  modalopenEvent6 = (e) => {
    e.preventDefault();

    var re = /^[a-zA-z가-힣]{2,8}$/;

    if (
      !this.check(
        re,
        this.state.changeid,
        "닉네임은 2~8자의 '영문' '한글' 로만 입력가능합니다."
      )
    ) {
      return false;
    } else {
      const user_id = {
        userid: this.state.userid,
        changeid: this.state.changeid,
      };

      fetch("api/updateuserid", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user_id),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            //닉네임 변경 성공
            //로컬에 저장해야함

            const update_info = JSON.parse(localStorage.getItem("user"));
            update_info.user_id = this.state.changeid;
            localStorage.setItem("user", JSON.stringify(update_info));

            this.setState({
              openEvent6: true,
              changeNickText: "닉네임 변경되었습니다.!",
            });
            window.location.replace("/Main");
          } else {
            this.setState({
              openEvent6: true,
              changeNickText: "이미 사용중인 닉네임 입니다.",
            });
          }
        });
    }
    //로컬스토리지 저장해야됨

    // window.location.replace("/Main");
  };
  modalcloseEvent6 = (e) => {
    e.preventDefault();
    this.setState({
      openEvent6: false,
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
    var user_realid = JSON.parse(localStorage.getItem("user")).user_realid;

    const box2 = {
      user_realid: user_realid,
    };
    // console.log(email);
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
    const box = {
      userid: this.state.userid,
    };

    fetch("api/notification", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(box),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          noti: json.message,
        });
      });
  }

  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  goMsg = (e) => {
    window.location.replace("/Message_collect");
  };
  goMsg2 = (e) => {
    window.location.replace("/allmessage");
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
            <span className="Title4_landing2" onClick={this.goMsg2}>
              와글채팅
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
        <div className="notification_div">{this.state.noti}</div>
        <div className="Title_landing">
          <span className="Title1_landing">창원대 매칭앱</span>
          <span className="Title2_landing">와글와글</span>
          <span className="Title3_landing">우리 친구할래요 ?</span>
        </div>
        {/* 휘제변경 */}
        <div className="Title_landing">
          <button className="Toggle_landing" onClick={this.handleToggle}>
            {this.state.arrow_text} ▼
          </button>

          {this.state.toggle === false ? (
            <div />
          ) : (
            <div className="ToggleTitle_landing">
              <button onClick={this.onClick1} className="Toggle2_landing">
                1 : 1 과팅
              </button>
              <button onClick={this.onClick2} className="Toggle2_landing">
                동성 친구
              </button>
            </div>
          )}
        </div>
        <div className="Title_landing">
          <Start
            count={this.state.count}
            nickname_switch_true={this.nickname_switch_true}
            nickname_switch_false={this.nickname_switch_false}
          />
        </div>
        {this.state.change_nickname_switch ? ( //true면 닉변가능 cnt 1이상이면 false
          <div className="Title_landing">
            <button
              className="nickname_change_btn"
              onClick={this.modalopenEvent5}
            >
              닉네임 변경
            </button>
          </div>
        ) : (
          <div></div>
        )}
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
          open={this.state.openEvent6}
          onClose={this.modalcloseEvent6}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent id="sibal">
            <DialogContentText id="alert-dialog-description">
              {this.state.changeNickText}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openEvent5}
          onClose={this.modalcloseEvent5}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>닉네임 변경하기</DialogTitle>
          <DialogContent id="sibal">
            <DialogContentText id="alert-dialog-description">
              <div>
                <div className="change_nickname">
                  <label style={{ color: "#f05052" }}>현재 닉네임</label>
                </div>

                <div className="change_nickname2">{this.state.userid}</div>
              </div>
              <div className="change_nickname3">
                <label style={{ color: "#f05052" }}>바꿀 닉네임</label>
                <input
                  className="name_change_input"
                  type="text"
                  name="changeid"
                  value={this.state.changeid}
                  onChange={this.handleChange}
                />
              </div>
              <div className="change_nickname_button">
                <Button
                  onClick={this.modalopenEvent6}
                  style={{ fontSize: "18px" }}
                >
                  변경
                </Button>
              </div>
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
            넌술포차 이벤트
            <img src={Soju} width="30px" height="30px" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              기간 : 09/23 ~ 27
              <br />
              장소 : 창원대 앞 넌술포차 <br />
              대상 : 어플 사용자 누구나 <br />
              <br />
              사용방법 <br />
              1. 넌술포차를 간다 !<br />
              2. 이 화면을 보여준다 !<br />
              3. 소주한병을 받아서 마신다 ! <br />
              {/* 1. 사장님께 보여주고 소주받기!!" <br />
              2. 사장님께 감사인사 전하기!! <br />
              <br />
              주의사항: <br />
              1. 한 테이블당 한번만! <br />
              2. 쿠폰 양심껏 사용하기 */}
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
              <br />
              5. 와글채팅방은 모두가 다같이 즐기는 채팅방입니다.
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
              <br />
              4. 닉네임 변경은 메세지함을 비운후 가능합니다.
              <br />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <div className="event_url" onClick={this.modalopenEvent}>
          <span>Event</span>
        </div>
      </div>
    );
  }
}
