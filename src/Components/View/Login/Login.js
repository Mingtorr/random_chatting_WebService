import React, { Component } from "react";
import "./Login.css";

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
          alert("아이디 또는 비밀번호가 틀렸어요ㅠㅠ");
        } else {
          alert("로그인 성공");
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
          </div>
          <div>
            <button className="Signup_btn" onClick={this.singupBtn}>
              처음이신가요?
            </button>
          </div>
        </form>
      </div>
    );
  }
}
