import React, { Component } from "react";
import "./Moddal.css";

export default class Explain extends Component {
  render() {
    return (
      <div className="Popup_modal">
        <div className="Popupinner_modal">
          <div className="Xbtn_modal">
            <button onClick={this.props.closeExp} className="Xbtn_modal2">
              X
            </button>
          </div>
          <div className="Span_exp">
            <span className="Style_exp">1. 로그인</span>
            <span className="Style_exp">2. 신청</span>
            <span className="Style_exp">3. sex</span>
          </div>
        </div>
      </div>
    );
  }
}
