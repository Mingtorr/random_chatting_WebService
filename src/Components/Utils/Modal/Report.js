import React, { Component } from "react";
import "./Moddal.css";
import HomeIcon from "@material-ui/icons/Home";

export default class Report extends Component {
  constructor(props) {
    super(props);
    const user_info = JSON.parse(localStorage.getItem("user"));
    this.state = {
      userid: user_info.user_id,
      badman: "",
      reason: "",
    };
  }

  handleChg = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  reportBad = () => {
    const report = {
      userid: this.state.userid,
      badman: this.state.badman,
      reason: this.state.reason,
    };

    let length = this.state.reason;

    if (this.state.badman === "" || this.state.reason === "") {
      alert("입력해 주세요");
    } else if (length.length >= 200) {
      alert("200자를 초과 했어요");
    } else {
      fetch("api/Badman", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(report),
      });
      window.location.replace("/main");
      alert("신고접수완료");
    }
  };

  goMain = () => {
    window.location.replace("/main");
  };
  render() {
    return (
      <div className="Report_one">
        <span className="Report_rep">비매너 유저 신고</span>
        <span className="Report_plz">
          {" "}
          노력하는 창대 학생 개발팀이 되겠습니다
          <br /> 여러분의 신고에 끊임없는 피드백 수정이 <br />
          이루어질 예정입니다 감사합니다
        </span>

        <div className="Report_form">
          {/* <div className="Xbtn_modal">
            <button onClick={this.goMain} className="Xbtn_modal2">
              X
            </button>
          </div> */}

          <div className="Span_rep2">
            <span className="Style_exp">유저 아이디</span>
            <input
              placeholder="신고할 대상의 닉네임"
              name="badman"
              onChange={this.handleChg}
            />
          </div>
          <span className="Style_exp">신고 사유</span>
          <div className="report_input">
            <textarea
              placeholder="최대 300자까지 가능해요."
              name="reason"
              onChange={this.handleChg}
            />
          </div>
        </div>
        <div className="Report_footer">
          <button onClick={this.reportBad} className="Report_button">
            접수하기
          </button>
          <HomeIcon
            className="Home_footer"
            onClick={this.goMain}
            style={{ fontSize: 50 }}
          />
        </div>
      </div>
    );
  }
}
