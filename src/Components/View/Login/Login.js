import React, { Component } from "react";
import "./Login.css";
import { json } from "body-parser";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name1: "",
      pass: "",
      success: false,
    };
  }

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
    fetch("http://localhost:3001/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.boolean === false) {
          alert("아이디 틀렸졍");
        } else {
          alert("성공");
          //자바스크립트 라우트
          //로그인 성공하면 localStorage에 저장하기
          window.localStorage.setItem("user", JSON.stringify(json));
          window.location.href = "/Main";
        }
      });
  };
  singupBtn = () => {
    window.location.href = "/Signup";
  };

  render() {
    return (
      <div className="White_login">
        {/* style  안주면 안먹혀 이유는 몰랑 */}
        <form
          style={{
            background: "white",
            width: "80vw",
            height: "35vh",
            borderRadius: "60px",
          }}
          className="Container_login"
          onSubmit={this.onSubmit}
        >
          <div className="Textbox_login">
            <div className="Textbox_login">
              <text className="Intro_login">창원대 과팅앱</text>
            </div>
            <div className="Textbox_login">
              <text className="Intro2_login">창남 창녀.</text>
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
            <input
              className="Btn_login"
              value="회원가입"
              type="button"
              onClick={this.singupBtn}
            />
          </div>
        </form>
      </div>
    );
  }
}
