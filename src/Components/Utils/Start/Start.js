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

const socket = io("http://localhost:3001");

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
    setInterval(
      socket.on("apply", () => {
        setInterval(
          socket.emit("matching", this.state._id, this.state.sex),
          3000
        );
      }),
      3000
    );
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
          style={{ width: "100px", height: "100px", zIndex: "-3" }}
        />
      ),
      open: true,
    });
    socket.emit("start", this.state._id, this.state.nick, this.state.sex);

    socket.on("matching_success", () => {
      console.log("매칭성공");
      socket.emit("room_join", this.state._id, this.state.sex);
      this.setState({
        progress: (
          <button className="Font_start" onClick={this.onMatching}>
            {" "}
            매칭 시작!{" "}
          </button>
        ),
      });
      alert("매칭성공");
      socket.disconnect();
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
