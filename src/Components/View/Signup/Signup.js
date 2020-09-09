import React, { Component } from "react";
import "./Signup.css";
import { json } from "body-parser";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      pass: "",
      pass2: "",
      email: "",
      nickname: "",
      sex: "",
      checked_id: false, // ID 중복검사
      checked_nick: false,
      checked_email: false, // 메일 인증 확인
      authNum: "", //보낸 인증번호
      authCheckNum: "", // 사용자가 적은 인증번호
      sendEmailClick: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  sendEmail = () => {
    this.setState({
      sendEmailClick: true,
    });
    const email = {
      sendEmail: this.state.email,
    };
    // console.log(email);
    fetch("http://localhost:3001/Sendmail", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(email),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json === true) {
          alert("이미 가입된 메일입니다.");
        } else {
          alert("인증 메일이 전송되었습니다.");
          console.log(json);
          this.setState({
            authNum: json,
          });
        }
      });
  };
  // 인증메일을 확인한다.
  authEmail = () => {
    if (this.state.authNum.toString() === this.state.authCheckNum.toString()) {
      alert("인증성공");
      this.setState({
        checked_email: true,
      });
    } else {
      alert("인증실패");
    }
  };

  check = (re, what, message) => {
    if (re.test(what)) {
      return true;
    }
    alert(message);
    return false;
  };

  checkId = () => {
    var re = /^[a-zA-Z0-9]{4,12}$/; //아이디는 4~12자의 영문 대소문자와 숫자로만 입력
    if (
      !this.check(
        re,
        this.state._id,
        "아이디는 4~12자의 영문 대소문자와 숫자로만 입력가능합니다."
      )
    ) {
      return false;
    } else {
      const checkId = {
        check_Id: this.state._id,
      };
      fetch("http://localhost:3001/CheckId", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(checkId),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            alert("사용가능한 아이디 입니다.");
            this.setState({
              checked_id: true,
            });
          } else {
            alert("이미 사용중인 아이디 입니다.");
          }
        });
    }
  };
  //닉네임 중복검사
  checkNick = () => {
    var re = /^[a-zA-z가-힣0-9]{2,8}$/;
    if (
      !this.check(
        re,
        this.state.nickname,
        "닉네임은 2~8자의 영문 한글 숫자로만 입력가능합니다."
      )
    ) {
      return false;
    } else {
      const checkNick = {
        check_Nick: this.state.nickname,
      };
      fetch("http://localhost:3001/CheckNick", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(checkNick),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            alert("사용가능한 닉네임 입니다.");
            this.setState({
              checked_nick: true,
            });
          } else {
            alert("이미 사용중인 닉네임 입니다.");
          }
        });
    }
  };

  onSubmit = (e) => {
    e.preventDefault(); //이벤트 발생시 새로고침을 안하게 한다.
    if (!this.state.checked_id) {
      alert("아이디 중복검사를 해주세요");
    } else if (!(this.state.pass === this.state.pass2)) {
      alert("비밀번호가 일지하지 않습니다.");
    } else if (!this.state.checked_nick) {
      alert("닉네임 중복검사를 해주세요");
    } else if (!this.state.checked_email) {
      alert("메일 인증을 해주세요");
    } else {
      const user_info = {
        _id: this.state._id,
        pass: this.state.pass,
        pass2: this.state.pass2,
        email: this.state.email,
        nick: this.state.nickname,
        sex: this.state.sex,
      };
      fetch("http://localhost:3001/Signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user_info),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json) {
            alert("회원가입 성공");
            window.location.href = "/";
          } else {
            alert("회원가입 실패");
          }
        });
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
            <text className="Intro2_sign">창남 창녀.</text>
          </div>
          <div className="Text_sign">
            <label for="name">아이디 </label>
            <input
              type="text"
              id="name"
              name="_id"
              value={this.state._id}
              onChange={this.handleChange}
              className="Input_sign"
            />
            <input
              type="button"
              value="중복확인"
              onClick={this.checkId}
              className="Double_sign"
            />
          </div>

          <div className="Text_sign">
            <label for="pass">비밀번호 </label>
            <input
              type="password"
              id="pass"
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
              id="pass2"
              name="pass2"
              value={this.state.pass2}
              onChange={this.handleChange}
              className="Input_sign"
            />
          </div>

          <div className="Text_sign">
            <label for="nickname">닉네임 </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={this.state.nickname}
              onChange={this.handleChange}
              className="Input_sign"
            />
            <input
              type="button"
              value="중복확인"
              onClick={this.checkNick}
              className="Double_sign"
            />
          </div>
          <div className="Text_sign">
            <label for="nickname">성별 </label>
            <input
              type="radio"
              name="sex"
              value="M"
              onChange={this.handleChange}
            />{" "}
            남
            <input
              type="radio"
              name="sex"
              value="F"
              onChange={this.handleChange}
            />{" "}
            여
          </div>

          <div className="Text_sign">
            <label for="email">학교 이메일 </label>
            <input
              type="text"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="Input_sign"
            />
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              @changwon.ac.kr&nbsp;
            </span>
            <input
              type="button"
              value="전송"
              onClick={this.sendEmail}
              className="Double_sign"
            />
          </div>
          {this.state.sendEmailClick ? (
            <div className="Text_sign">
              <label for="authCheckNum">인증번호 </label>
              <input
                type="text"
                id="authCheckNum"
                name="authCheckNum"
                value={this.state.authCheckNum}
                onChange={this.handleChange}
                className="Input_sign"
              />
              <input
                type="button"
                value="인증"
                onClick={this.authEmail}
                className="Double_sign"
              />
            </div>
          ) : (
            <div></div>
          )}

          <div>
            <button className="Btn_sign" type="submit">
              회원가입
            </button>
          </div>
        </form>
      </div>
    );
  }
}
