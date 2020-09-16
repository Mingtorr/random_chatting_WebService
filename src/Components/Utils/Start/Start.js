import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./Start.css";
import io from "socket.io-client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const socket = io();

export default class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: JSON.parse(localStorage.getItem("user")).user_id,
      sex: JSON.parse(localStorage.getItem("user")).user_sex,
      nick: JSON.parse(localStorage.getItem("user")).user_nickname,
      open: false,
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
          this.setState({
            progress: "매칭완료했음으로 더이상 매칭은 안됩니다.",
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
          this.setState({
            progress: (
              <CircularProgress
                color="secondary"
                style={{
                  width: "100px",
                  height: "100px",
                  zIndex: "1",
                  position: "relative",
                }}
              />
            ),
          });
        }
      });

    socket.on("successmatching", (matching_info) => {
      console.log("tlqkf");
      this.setState({
        progress: "매칭완료했음으로 더이상 매칭은 안됩니다.",
      });
      alert("매칭성공");
    });
    socket.emit("start join", this.state._id);
    socket.on("a123", (userid) => {
      alert("asdasdasd");
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
  onMatching = () => {
    this.setState({
      progress: (
        <CircularProgress
          color="secondary"
          style={{
            width: "100px",
            height: "100px",
            zIndex: "1",
            position: "relative",
          }}
        />
      ),
      open: true,
    });

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
        console.log(json);
        if (json.touserid === undefined) {
        } else {
          socket.emit("matchingtouser", json);
          alert("매칭완료");
          this.setState({
            progress: "매칭완료했음으로 더이상 매칭은 안됩니다.",
          });
        }
      });
  };
  componentDidMount() {}

  render() {
    //기존
    // const {count} = this.state;
    return this.props.count === 1 ? (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.modalclose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"매칭 주의사항"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              매칭을 하고 다른 페이지로 이동시 매칭이 취소되요 ㅠㅠ
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.modalclose} color="primary">
              나가기
            </Button>
          </DialogActions>
        </Dialog>
        <div className="start_progress">{this.state.progress}</div>
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
