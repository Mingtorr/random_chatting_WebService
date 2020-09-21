import React, { Component } from "react";
import "./Moddal.css";

export default class Caution extends Component {
  render() {
    return (
      <div className="Popup_modal">
        <div className="Popupinner_modal">
          <div className="Xbtn_modal">
            <button onClick={this.props.clouseCau} className="Xbtn_modal2">
              X
            </button>
          </div>
          <div>
            <text className="Title_mod">주의사항</text>
          </div>
          <div className="Span_exp">
            <span className="Style_exp3">
              1. 화면 내 버튼만 사용해서 이동해야합니다.
            </span>
            <span className="Style_exp3">
              2. 카카오톡 브라우저로 접속하면 느려요.
              <br />
              ex) 삼성 인터넷, 사파리 등을 권장드립니다.
            </span>
            <span className="Style_exp3">3. 모바일 접속을 권장드립니다.</span>
          </div>
        </div>
      </div>
    );
  }
}
