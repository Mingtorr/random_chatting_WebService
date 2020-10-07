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
      realid: JSON.parse(localStorage.getItem("user")).user_realid,
      open: false,
      open2: false,
      room_count: JSON.parse(localStorage.getItem("user")).room_count, //추가원영 수정
      progress: (
        <button className="Font2_start" onClick={this.onMatching}>
          {" "}
          매칭 시작!{" "}
        </button>
      ),
      max_room: 8, //최대 메시지함 갯수 8개
    };
  }

  componentWillMount() {
    const user = {
      userid: this.state._id,
      sex: this.state.sex,
      realid: this.state.realid,
    };

    fetch("api/onmatching", {
      //////////////////////원영수정//////////////////////////////////
      //매칭횟수가 넘어가면 제한거는 곳
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          room_count: json.room_count,
        });
        //////////////////원영 수정//////////////////////
        if (this.state.room_count > 0) {
          //0보다 크면 닉변 제한
          this.props.nickname_switch_false();
        }

        if (this.state.room_count < this.state.max_room) {
          //최대 메시지함 갯수
        } else {
          this.setState({
            progress: (
              <button className="Font_start">메시지함을 확인하세요</button>
            ),
          });
        }
        ////////////////////////////////////
      });

    fetch("api/CheckStart", {
      //매칭 테이블에 신청한게 있으면 매칭 취소버튼으로 변경
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
      //////////////////////원영수정 다중메시지///////////////
      //룸카운터를 새로 받아오지 않아 실행x
      let temp_cnt = this.state.room_count + 1;
      this.setState({
        room_count: temp_cnt,
      });
      //////////////////////원영 수정/////////////////
      if (this.state.room_count < this.state.max_room) {
        ///최대 메시지함 갯수
        this.setState({
          progress: (
            <button className="Font2_start" onClick={this.onMatching}>
              {" "}
              매칭 시작!{" "}
            </button>
          ),
          open: true,
        });
      } else {
        this.setState({
          progress: (
            <button className="Font_start">메시지함을 확인하세요</button>
          ),
          open: true,
        });
      }
      //////////////////////////
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
        <button className="Font2_start" onClick={this.onMatching}>
          {" "}
          매칭 시작!{" "}
        </button>
      ),
      open2: true, //매칭이 취소됨
    });
    if (this.state.room_count > 0) {
      this.props.nickname_switch_false();
    } else {
      this.props.nickname_switch_true();
    }

    // alert("매칭 취소");
    //modal로 바꾸기
    const post = {
      _id: this.state._id,
      sex: this.state.sex,
    };

    if (this.props.count === 1) {
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
    } else {
      fetch("api/StopMatchSame", {
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
    }
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
      realid: this.state.realid,
    };

    if (this.props.count === 1) {
      //이성친구
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
            //작성자
            //매칭테이블에 상대유저 아이디 없으면 계속 찾기
          } else {
            //신청자
            //매칭테이블에 상대방 있으면 매칭성공
            ///////////////////////////////원영수정////////////////////
            this.setState({
              room_count: json.room_count,
            });
            json.realid = userid.realid;
            this.props.nickname_switch_false();
            socket.emit("matchingtouser", json);

            if (json.room_count < this.state.max_room) {
              this.setState({
                progress: (
                  <button className="Font2_start" onClick={this.onMatching}>
                    {" "}
                    매칭 시작!{" "}
                  </button>
                ),
                open: true,
              });
            } else {
              this.setState({
                progress: (
                  <button className="Font_start">메시지함을 확인하세요</button>
                ),
                open: true,
              });
            }
            // if (this.state.sex === "M") {
            //   //남자일때 제한
            //   if (json.room_count < 3) {
            //     //최대 3개까지 매칭가능
            //     this.setState({
            //       progress: (
            //         <button className="Font2_start" onClick={this.onMatching}>
            //           {" "}
            //           매칭 시작!{" "}
            //         </button>
            //       ),
            //       open: true,
            //     });
            //   } else {
            //     this.setState({
            //       progress: (
            //         <button className="Font_start">
            //           메시지함을 확인하세요
            //         </button>
            //       ),
            //       open: true,
            //     });
            //   }
            // } else {
            //   //여자일때 제한
            //   if (json.room_count < 5) {
            //     //최대 5개까지 매칭가능
            //     this.setState({
            //       progress: (
            //         <button className="Font2_start" onClick={this.onMatching}>
            //           {" "}
            //           매칭 시작!{" "}
            //         </button>
            //       ),
            //       open: true,
            //     });
            //   } else {
            //     this.setState({
            //       progress: (
            //         <button className="Font_start">
            //           메시지함을 확인하세요
            //         </button>
            //       ),
            //       open: true,
            //     });
            //   }
            // }
          }
        });
    } else if (this.props.count === 2) {
      //동성친구
      fetch("api/CheckMatchingSame", {
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
            this.setState({
              room_count: json.room_count,
            });
            json.realid = userid.realid;
            this.props.nickname_switch_false();
            socket.emit("matchingtouser", json);

            if (json.room_count < this.state.max_room) {
              this.setState({
                progress: (
                  <button className="Font2_start" onClick={this.onMatching}>
                    {" "}
                    매칭 시작!{" "}
                  </button>
                ),
                open: true,
              });
            } else {
              this.setState({
                progress: (
                  <button className="Font_start">메시지함을 확인하세요</button>
                ),
                open: true,
              });
            }
          }
        });
    }
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
    ) : this.props.count == 2 ? (
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
