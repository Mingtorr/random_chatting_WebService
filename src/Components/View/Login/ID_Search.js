import React, { Component } from "react";
import "./ID_Search.css";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ID_Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      text2: "",
      open: false,
    };
  }

  sendEmail = (e) => {
    //전송 버튼 눌렀을 때
    e.preventDefault();

    const email = {
      sendEmail: this.state.email,
    };
    // console.log(email);
    fetch("api/serchID", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(email),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.boolean === false) {
          this.setState({
            open: true,
            text2: "등록 되어 있지 않아요",
          });
        } else {
          this.setState({
            open: true,
            text2: "ID/PW가 메일로 전송 되었습니다",
          });
        }
      });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  modalclose = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div className="id_search">
        <Dialog
          open={this.state.open}
          onClose={this.modalclose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text2}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <div className="id_search_title">
          email
          <input name="email" onChange={this.handleChange}></input>
          <span className="id_search_ackr">@changwon.ac.kr</span>
        </div>

        <div className="id_search_example">@ 앞에 만 쳐주세요</div>

        <div className="id_search_email_button">
          <Button onClick={this.sendEmail} style={{ fontSize: "20px" }}>
            전송
          </Button>
        </div>
      </div>
    );
  }
}

export default ID_Search;
