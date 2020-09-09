import React, { Component } from "react";
import "./Update.css";

export default class Update extends Component {
  constructor(props) {
    super(props);
    const user_info = JSON.parse(localStorage.getItem("user"));

    this.state = {
      _id: user_info.user_id,
      pass: "",
      pass2: "",
      email: "",
      nickname: user_info.user_nickname,
      update_nickname: "",
      gender: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  //변경할 닉네임을 서버로 보냄

  check = (re, what, message) => {
    if (re.test(what)) {
      return true;
    }
    alert(message);
    return false;
  };

  chageNickname = () => {
    var re = /^[a-zA-z가-힣0-9]{2,8}$/;
    if (
      !this.check(
        re,
        this.state.update_nickname,
        "닉네임은 2~8자의 영문 한글 숫자로만 입력가능합니다."
      )
    ) {
      return false;
    } else {
      const upNickname = {
        preNick: this.state.nickname,
        nick: this.state.update_nickname,
      };
      console.log(this.state.nickname);
      console.log(this.state.update_nickname);
      fetch("http://localhost:3001/Update_nick", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(upNickname),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            const update_info = JSON.parse(localStorage.getItem("user"));
            update_info.user_nickname = this.state.update_nickname;
            localStorage.setItem("user", JSON.stringify(update_info));

            console.log(JSON.parse(localStorage.getItem("user")));
            this.setState({
              user_nickname: JSON.parse(localStorage.getItem("user"))
                .user_nickname,
            });
            console.log("state의 닉네임: " + this.state.user_nickname);
            alert("닉네임이 변경되었습니다.");
          } else {
            alert("이미 사용중인 닉네임 입니다.");
          }
        });
    }
  };
  updatePassword = () => {
    if (this.state.pass === "") {
      alert("변경할 비밀번호를 입력해주세요");
    } else if (this.state.pass === this.state.pass2) {
      const password = {
        _id: this.state._id,
        pass: this.state.pass,
      };
      fetch("http://localhost:3001/Update_password", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(password),
      }).then(alert("비밀번호가 변경되었습니다."));
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  render() {
    return (
      <div className="White_sign">
        <form className="Container_sign" onSubmit={this.onSubmit}>
          <div className="Textbox_sign" style={{ marginTop: "15px" }}>
            <text className="Intro_sign">창원대 과팅앱</text>
          </div>
          <div className="Textbox_sign">
            <text className="Intro2_sign">회원정보수정</text>
          </div>
          <div className="Text_sign">
            <label for="name">아이디 </label>
            <span>{this.state._id}</span>
          </div>
          <div className="Text_sign">
            <label for="pass">비밀번호 </label>
            <input
              type="password"
              name="pass"
              value={this.state.pass}
              onChange={this.handleChange}
              className="Input_sign"
            />
          </div>
          <div className="Text_sign">
            <label for="pass2">비밀번호 확인 </label>
            <input
              type="password"
              name="pass2"
              value={this.state.pass2}
              onChange={this.handleChange}
              className="Input_sign"
            />
            <input
              type="button"
              value="변경"
              onClick={this.updatePassword}
              className="Double_sign"
            />
          </div>
          <div className="Text_sign">
            <label for="nickname">닉네임 </label>
            <span style={{ marginLeft: "15px" }}>{this.state.nickname}</span>

            <input
              name="update_nickname"
              onChange={this.handleChange}
              className="Input_sign"
            />
            {/* 버튼 누를때 마다 새로고침됨 state 값 변경된 곳만 새로 고침 우째하는지 몰라서 걍씀 */}
            <button onClick={this.chageNickname} className="Double_sign">
              수정
            </button>
            {/* <input //닉네임 수정버튼 서버로 변경할 닉네임을 보낸다.
              type="button"
              value="수정"
              onClick={this.chageNickname}
              className="Double_sign"
            /> */}
          </div>
          <div className="Text_sign">
            <label for="email">학교 이메일 </label>
            <input className="Input_sign" />
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              @changwon.ac.kr&nbsp;
            </span>
          </div>
          {/* {this.state.sendEmailClick ? (
            <div className="Text_sign">
              <label for="authCheckNum">인증번호 </label>
              <input className="Input_sign" />
              <input className="Double_sign" />
            </div>
          ) : (
            <div></div> */}
          {/* )} */}
          <div>
            <button className="Btn_sign" type="submit">
              확인
            </button>
          </div>
        </form>
      </div>
    );
  }
}
