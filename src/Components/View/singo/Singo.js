import React from "react";
import "./Singo.css";
import HomeIcon from "@material-ui/icons/Home";

class Singo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: false,
      content: false,
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

  onSubmit = (e) => {
    // 데이터에 대해 서버와 얘기하고 결과를 알려준다
    e.preventDefault();
    const data = {
      title: this.state.title,
      content: this.state.content, // 현재 id state값을 data.id에 넣는다
    };

    let length = this.state.content;

    if (this.state.title.trim() === "" || this.state.content.trim() === "") {
      alert("제목이나 내용을 입력해 주세요");
    } else if (length.length >= 200) {
      alert("200자를 초과 했어요");
    } else {
      fetch("api/Singo", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // json화 해버리기
      });

      //   this.setState({
      //     title: "",
      //     content: "",
      //   });

      alert("제출 되었습니다 감사합니다");
    }
  };

  render() {
    return (
      <div className="Singo_page">
        <header>불편사항신고</header>
        <body className="Singo_body">
          <span>
            {" "}
            노력하는 창원대 창업동아리 WESIX가 되겠습니다
            <br /> 여러분의 신고에 끊임없는 피드백 수정이 <br />
            이루어질 예정입니다 감사합니다
          </span>
          <article>
            <div className="Singo_article">
              <form>
                <div className="first_input">
                  <span>제목</span>
                  <input
                    type="text"
                    name="title"
                    placeholder="살살써주세요"
                    onChange={this.onChange}
                  ></input>
                </div>

                <div className="second_input">
                  <div>내용</div>
                  <div>
                    <textarea
                      name="content"
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
          <button onClick={this.onSubmit}>제출</button>

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
