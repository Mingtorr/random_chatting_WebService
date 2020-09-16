import React from "react";
import "./message_collect.css";
import io from "socket.io-client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
const socket = io();

export default class Messageroom_click extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      body: "",
      open: false,
    };
  }
  componentWillMount() {}
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
  onClick = (e) => {
    e.preventDefault();
    window.location.replace(
      "/message?touserid=" +
        `${this.props.name}` +
        "&roomname=" +
        `${this.props.roomname}`
    );
  };
  dropclick = (e) => {
    e.preventDefault();
    const post = {
      userid: this.props.userid,
      touserid: this.props.name,
    };
    const post2 = {
      userid: this.props.userid,
      touserid: this.props.name,
      roomname: this.props.roomname,
    };
    socket.emit("dropmessage", post2); //123213213213213213213213213213
    socket.emit("roomout", post);
    fetch("api/droproom", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    }).then(window.location.reload(true));
  };

  render() {
    return (
      <div className="messagered">
        <Dialog
          open={this.state.open}
          onClose={this.modalclose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"방을 나가시겠습니까?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              상대방이 슬퍼하질도몰라요 다시 생각해보세요 ㅠㅠ
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.dropclick} color="primary">
              나가기
            </Button>
            <Button onClick={this.modalclose} color="primary" autoFocus>
              되돌아가기
            </Button>
          </DialogActions>
        </Dialog>
        <div className="messageroom_main_click" onClick={this.onClick}>
          <div className="messageroom_img"></div>
          <div className="messageroom_body">
            <div className="messageroom_body_name_click">{this.props.name}</div>
            <div className="messageroom_body_main_click">{this.props.body}</div>
          </div>
        </div>
        <div className="messageroom_button">
          <button onClick={this.modalopen}>x</button>
        </div>
      </div>
    );
  }
}
