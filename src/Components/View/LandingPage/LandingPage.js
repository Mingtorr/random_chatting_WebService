import React, { Component } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Start from "../../Utils/Start/Start.js";

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      toggle: false,
      admin: false,
    };
  }

  onClick1 = (e) => {
    this.setState({
      count: 1,
      toggle: false,
    });
  };
  onClick2 = (e) => {
    this.setState({
      count: 2,
      toggle: false,
    });
  };
  onClick3 = (e) => {
    this.setState({
      count: 3,
      toggle: false,
    });
  };
  onClick4 = (e) => {
    this.setState({
      count: 4,
      toggle: false,
    });
  };
  onClick5 = (e) => {
    this.setState({
      count: 5,
      toggle: false,
    });
  };

  handleToggle = (e) => {
    this.setState({ toggle: !this.state.toggle });
  };

  toggleClose = (e) => {
    if (this.state.toggle === true) {
      this.setState({ toggle: false });
    }
  };
  componentDidMount() {
    if (localStorage.getItem("user") === null) {
      window.location.href = "/";
      alert("로그인해라");
    }
    // console.log(JSON.parse(localStorage.getItem("user")));
    // const user = JSON.parse(localStorage.getItem("user"));
    // user.user_nickname = "sex";
    // localStorage.setItem("user", JSON.stringify(user));
    // console.log(JSON.parse(localStorage.getItem("user")));
  }
  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  render() {
    return (
      <div classNanme="Container" onClick={this.toggleClose}>
        {/* 메시지 햄버거 */}
        <div className="Set_landing">
          <Link to="Signup">
            <MenuIcon style={{ fontSize: 50, color: "white", marginTop: 5 }} />
          </Link>

          <Link to="Update">
            <ChatBubbleOutlineIcon
              style={{ fontSize: 50, color: "white", marginTop: 10 }}
            />
          </Link>
        </div>

        {/* 제목 */}
        <div className="Title_landing">
          <text className="Title1_landing">창원대 과팅앱</text>
          <text className="Title2_landing">창남 창녀.</text>
          <text className="Title3_landing">우리... 할래요 ?</text>
        </div>

        <div className="Title_landing">
          <button className="Toggle_landing" onClick={this.handleToggle}>
            {this.state.count} : {this.state.count} 과팅 ▼
          </button>

          {this.state.toggle === false ? (
            <div />
          ) : (
            <div className="ToggleTitle_landing">
              <button onClick={this.onClick1} className="Toggle2_landing">
                1 : 1 과팅
              </button>
              <button onClick={this.onClick2} className="Toggle2_landing">
                2 : 2 과팅
              </button>
              <button onClick={this.onClick3} className="Toggle2_landing">
                3 : 3 과팅
              </button>
              <button onClick={this.onClick4} className="Toggle2_landing">
                4 : 4 과팅
              </button>
              <button onClick={this.onClick5} className="Toggle2_landing">
                5 : 5 과팅
              </button>
            </div>
          )}
        </div>
        <div className="Title_landing">
          <button onClick={this.logout}>로그아웃</button>
          <Start count={this.state.count} />
        </div>
      </div>
    );
  }
}
