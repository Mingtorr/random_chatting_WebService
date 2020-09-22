import React, { Component } from "react";
import "./Start.css";
import io from "socket.io-client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Photos from "./photos.png";
const socket = io("http://localhost:3001");

export default class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: JSON.parse(localStorage.getItem("user")).user_id,
      sex: JSON.parse(localStorage.getItem("user")).user_sex,
      nick: JSON.parse(localStorage.getItem("user")).user_nickname,
      open: false,
      open2: false,
      progress: (
        <button className="Font_start" onClick={this.onMatching}>
          {" "}
          매칭 시작!{" "}
        </button>
      ),
    };
  }

  componentWillMount() {
    const user = {
      userid: this.state._id,
      sex: this.state.sex,
    };
    fetch("api/onmatching", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json === true) {
          this.props.nickname_switch_false();
          this.setState({
            progress: (
              <button className="Font_start">메시지함을 확인하세요</button>
            ),
          });
        } else {
        }
      });
    fetch("api/CheckStart", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json) {
        } else {
          this.props.nickname_switch_false();
          this.setState({
            progress: (
              <div className="Progress_start">
                <CircularProgress
                  color="secondary"
                  style={{
                    width: "100px",
                    height: "100px",
                    zIndex: "1",
                    position: "relative",
                  }}
                />
                <button className="Font2_start" onClick={this.stopMathing}>
                  매칭취소
                </button>
              </div>
            ),
          });
        }
      });

    socket.on("successmatching", (matching_info) => {
      this.props.nickname_switch_false();
      this.setState({
        progress: <button className="Font_start">메시지함을 확인하세요</button>,
        open: true,
      });
    });
    socket.emit("start join", this.state._id);
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

  stopMathing = () => {
    this.setState({
      progress: (
        <button className="Font_start" onClick={this.onMatching}>
          {" "}
          매칭 시작!{" "}
        </button>
      ),

      open2: true,
    });
    this.props.nickname_switch_true();
    // alert("매칭 취소");
    //modal로 바꾸기
    const post = {
      _id: this.state._id,
      sex: this.state.sex,
    };
    fetch("api/StopMatch", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json === false) {
        } else {
        }
      });
  };

  onMatching = () => {
    this.setState({
      progress: (
        <div className="Progress_start">
          <CircularProgress
            color="secondary"
            style={{
              width: "100px",
              height: "100px",
              zIndex: "1",
              position: "relative",
            }}
          />
          <button className="Font2_start" onClick={this.stopMathing}>
            매칭취소
          </button>
        </div>
      ),
    });

    this.props.nickname_switch_false();

    const userid = {
      userid: this.state._id,
      sex: this.state.sex,
    };
    fetch("api/CheckMatching", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userid),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.touserid === undefined) {
        } else {
          this.props.nickname_switch_false();
          socket.emit("matchingtouser", json);
          this.setState({
            open: true,
            progress: (
              <button className="Font_start">메시지함을 확인하세요</button>
            ),
          });
        }
      });
  };
  componentDidMount() {}

  render() {
    return this.props.count === 1 ? (
      <div className="matching_dialog">
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
              <br /> 오른쪽 상단의 메시지함으로 들어가세요.
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.open2}
          onClose={this.modalclose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              매칭이 취소 되었습니다.
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <div className="start_progress">{this.state.progress}</div>
      </div>
    ) : (
      <div>
        <button className="Font2_start"> 매칭 찾기! </button>
      </div>
    );
  }
}
