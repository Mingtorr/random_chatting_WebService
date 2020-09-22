import React from "react";
import "./Singo.css";
import HomeIcon from "@material-ui/icons/Home";

class Singo extends React.Component {
  constructor(props) {
    super(props);

    const user_info = JSON.parse(localStorage.getItem("user"));
    this.state = {
      userid: user_info.user_id,
      badman: "",
      reason: "",
    };
  }

  home = (e) => {
    window.location.replace("/main");
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value, // input 태그에 연결돼 있는 친군데
    }); // 입력 시 이름에 맞는 state 값이 초기화 된다
  };

  reportBad = () => {
    const report = {
      userid: this.state.userid,
      badman: this.state.badman,
      reason: this.state.reason,
    };

    let length = this.state.reason;

    if (this.state.badman.trim() === "" || this.state.reason.trim() === "") {
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

  render() {
    return (
      <div className="Singo_page">
        <header>비매너유저신고</header>
        <body className="Singo_body">
          <span>
            {" "}
            빠르고 정확하게 비매너유저를 처리하겠습니다.
            <br /> 신중한 신고 감사합니다. <br />
            신고가 빠른 시간내에 이루어질 예정입니다 감사합니다
          </span>
          <article>
            <div className="Singo_article">
              <form>
                <div className="first_input">
                  <span>비매너유저</span>
                  <input
                    type="text"
                    name="badman"
                    placeholder="비매너유저입력"
                    onChange={this.onChange}
                  ></input>
                </div>

                <div className="second_input">
                  <div>내용</div>
                  <div>
                    <textarea
                      name="reason"
                      placeholder="최대 200자까지 가능해요"
                      onChange={this.onChange}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </article>
        </body>
        <footer>
          <button onClick={this.reportBad}>제출</button>

          <HomeIcon
            className="Home_footer"
            onClick={this.home}
            style={{ fontSize: 50 }}
          />
        </footer>
      </div>
    );
  }
}

export default Singo;
