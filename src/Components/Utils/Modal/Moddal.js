import React, { Component } from "react";
import "./Moddal.css";
import Explain from "./Explain";

export default class Moddal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explain: false,
    };
  }

  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  goUp = (e) => {
    window.location.replace("/update");
  };

  changeExp = (e) => {
    this.setState({
      explain: !this.state.explain,
    });
  };

  render() {
    return (
      <div className="Popup_modal">
        <div className="Popupinner_modal">
          <div className="Xbtn_modal">
            <button onClick={this.props.closePopup} className="Xbtn_modal2">
              X
            </button>
          </div>
          <button className="Btn_modal" onClick={this.changeExp}>
            설명서
          </button>
          {this.state.explain ? (
            <Explain closeExp={this.changeExp.bind(this)} />
          ) : null}

          {/* <div onClick={this.goUp}>
            <button className="Btn_modal">회원 정보 수정</button>
          </div> */}
          <button className="Btn_modal" onClick={this.logout}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }
}
