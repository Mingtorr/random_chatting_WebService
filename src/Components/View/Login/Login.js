import React, { Component } from "react";
import "./Login.css";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { DialogTitle } from "@material-ui/core";
import ID_Search from "./ID_Search";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name1: "",
      pass: "",
      success: false,
      open: false,
      open2: false,
    };
  }
  modalopen1 = (e) => {
    e.preventDefault();
    this.setState({
      open: true,
    });
  };
  modalclose1 = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
    });
  };
  handleName = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const post = {
      name: this.state.name1,
      pass: this.state.pass,
    };
    fetch("api/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.boolean === false) {
          this.setState({
            open: true,
            text1: "아이디 또는 비밀번호가 틀렸어요",
          });
        } else {
          this.setState({
            open: true,
            text1: "로그인 성공",
          });
          //자바스크립트 라우트
          //로그인 성공하면 localStorage에 저장하기
          json.onmatching = false;
          window.localStorage.setItem("user", JSON.stringify(json));
          window.location.replace("/Main");
        }
      });
  };
  singupBtn = (e) => {
    e.preventDefault();
    window.location.replace("/Signup");
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

  render() {
    return (
      <div className="White_login">
        <Dialog
          open={this.state.open}
          onClose={this.modalclose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text1}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.open2}
          onClose={this.modalclose2}
          aria-labelledy="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>ID/PW 찾기</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ID_Search />
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <form className="Container_login" onSubmit={this.onSubmit}>
          <div className="Textbox_login">
            <div className="Textbox_login">
              <text className="Intro_login">창원대 과팅앱</text>
            </div>
            <div className="Textbox_login">
              <text className="Intro2_login">와글와글</text>
            </div>
          </div>

          <div className="Text_login">
            <label for="name">아이디 </label>
            <input
              type="text"
              id="name"
              name="name1"
              value={this.state.name1}
              onChange={this.handleName}
              className="Input_login"
            />
          </div>

          <div className="Text_login">
            <label for="pass">비밀번호 </label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={this.state.pass}
              onChange={this.handleName}
              className="Input_login"
            />
          </div>

          <div>
            <button className="Btn_login" type="submit">
              로그인
            </button>
          </div>
          <div>
            <button className="Signup_btn" onClick={this.singupBtn}>
              처음이신가요?
            </button>
            <button className="Signup_btn" onClick={this.modalopen2}>
              ID/PW 찾기
            </button>
          </div>
        </form>
      </div>
    );
  }
}
