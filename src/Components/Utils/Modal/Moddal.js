import React, { Component } from "react";
import "./Moddal.css";

export default class Moddal extends Component {
  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  goUp = (e) => {
    window.location.replace("/update");
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
          <div onClick={this.goUp}>
            <button className="Update_modal">회원 정보 수정</button>
          </div>
          <button className="Btn_modal" onClick={this.logout}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }
}
