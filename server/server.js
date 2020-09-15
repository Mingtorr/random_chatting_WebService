const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
var http = require("http").createServer(app);
const io = require("socket.io")(http);
const route = require("./routes/index");
// nodemailer 모듈 요청
const nodemailer = require("nodemailer");
const { light } = require("@material-ui/core/styles/createPalette");
const { futimes } = require("fs");
//mysql연결
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wagle",
});

connection.connect();
//bodyparser및 cors 사용
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());
app.use("/api", route);
io.on("connection", function (socket) {
  // 소켓을 연결하는 부분
  //socket이랑 연결된 부분
  socket.on("dropmessage", (post2) => {
    const newmessage = "상대방이 나갔습니다.";
    connection.query(
      "insert into wagle_message (message_userid,message_touserid,message_body,message_roomname,message_drop) values (?,?,?,?,?)",
      [post2.userid, post2.touserid, newmessage, post2.roomname, 1],
      function (err, rows, field) {
        io.to(post2.roomname).emit("dropmessage2", post2);
      }
    );
  });
  socket.on("messageroomjoin", (userid) => {
    console.log("message room 참가" + userid);
    socket.join(userid);
  });
  socket.on("roomjoin", (roomname) => {
    console.log("방참가" + roomname);
    //io.to(방)으로 조인 'room1'
    socket.join(roomname);
  });
  socket.on("roomout", (post) => {
    console.log("roomout");
    io.to(post.touserid).emit("roomout2", post);
  });
  socket.on("send message", (message) => {
    console.log("sendmessage" + message);
    console.log("방이름" + message.roomname);
    //io 전체에 new message라는것을 보냄 but to('')는 특정 방에 보내는것
    io.to(message.roomname).emit("new message", message);
    io.to(message.touser).emit("new messageroom", message);
  });

  //sql문에 매칭 추가
  socket.on("start", (_id, nick, sex) => {
    console.log("start : " + _id + " " + nick + " " + sex); //
    if (sex === "M") {
      connection.query(
        "INSERT INTO matching_table_m (matching_userid, matching_nickname) values(?,?)",
        [_id, nick],
        // "UPDATE user_info SET user_matching =? WHERE user_id =?",
        // "SELECT * FROM user_info WHERE user_id =(?)",
        function (err, rows, fields) {
          if (err) {
            console.log("남자테이블 입력 에러" + err);
          } else {
            socket.emit("apply");
            console.log("남자 매칭을 시작합니다");
          }
          //매칭 등록 emit 하는 부분
        }
      );
    } else if (sex === "F") {
      connection.query(
        "INSERT INTO matching_table_w (matching_userid, matching_nickname) values(?,?)",
        [_id, nick],
        // "UPDATE user_info SET user_matching =? WHERE user_id =?",
        // "SELECT * FROM user_info WHERE user_id =(?)",
        function (err, rows, fields) {
          if (err) {
            console.log("여자테이블 입력 에러" + err);
          } else {
            socket.emit("apply");
            console.log("여자 매칭을 시작합니다");
          }
          //매칭 등록 emit 하는 부분
        }
      );
    } else {
      console.log("테이블 입력 실패");
    }
  });

  socket.on("matching", (_id, sex) => {
    console.log("서버:매칭 시작" + _id + sex);

    if (sex === "M") {
      //사용자가 남자일때
      //1. 본인테이블 검색
      connection.query(
        "SELECT * FROM matching_table_m WHERE matching_userid = (?)",
        [_id],
        function (err, rows, fields) {
          if (rows === undefined) {
            socket.emit("apply");
          } else if (rows[0].matching_womanid === null) {
            // 내 테이블에 신청한 여자가 없을때
            connection.query("SELECT * FROM matching_table_w", function (
              err,
              rows,
              fields
            ) {
              if (err) {
                console.log("여자 테이블 검색 실패");
              } else if (rows[0] === undefined) {
                //여자테이블에 신청자가 없다
                socket.emit("apply");
              } else {
                const matchingw = rows[0].matching_userid;
                console.log(matchingw + "이년이랑 매칭 성공");
                //여자 테이블에 신청자가 있을때 남자테이블에 여자아이디, 여자테이븛에 남자 아아디 입력
                connection.query(
                  "UPDATE matching_table_w SET matching_manid = (?) WHERE matching_userid =(?)",
                  [_id, rows[0].matching_userid],
                  function (err, rows, field) {
                    connection.query(
                      "UPDATE matching_table_m SET matching_womanid = (?) WHERE matching_userid =(?)",
                      [matchingw, _id],
                      function (err, rows, field) {
                        console.log("1");
                        socket.emit("matching_success");
                      }
                    );
                  }
                );
              }
            });
          } else if (rows[0].matching_womanid != null) {
            console.log("남자쪽 매칭 성공");
            console.log("2");
            socket.emit("matching_success");
          }
        }
      );
    } else {
      //사용자가 여자일 때
      //1.본인 테이블 검색
      connection.query(
        "SELECT * FROM matching_table_w WHERE matching_userid = (?)",
        [_id],
        function (err, rows, fields) {
          if (rows === undefined) {
            socket.emit("apply");
          } else if (rows[0].matching_manid === null) {
            // 내 테이블에 신청한 남자가 없을때 남자 테이블 검색
            connection.query("SELECT * FROM matching_table_m", function (
              err,
              rows,
              fields
            ) {
              if (err) {
                console.log("남자 테이블 검색 실패");
              } else if (rows[0] === undefined) {
                //남자테이블에 신청자가 없다
                socket.emit("apply");
              } else {
                const matchingm = rows[0].matching_userid;
                //남자 테이블에 신청자가 있을때 남자테이블에 여자아이디, 여자테이블에 남자 아아디 입력
                connection.query(
                  "UPDATE matching_table_m SET matching_wonmanid = (?) WHERE matching_userid =(?)",
                  [_id, rows[0].matching_userid],
                  function (err, rows, fields) {
                    connection.query(
                      "UPDATE matching_table_w SET matching_manid = (?) WHERE matching_userid =(?)",
                      [matchingm, _id],
                      function (err, rows, field) {
                        socket.emit("matching_success");
                      }
                    );
                  }
                );
              }
            });
          } else if (rows[0].matching_manid != null) {
            console.log("여자쪽 매칭 성공");
            socket.emit("matching_success");
          }
        }
      );
    }
  });

  socket.on("room_join", (_id, sex) => {
    if (sex === "M") {
      connection.query(
        "SELECT * FROM matching_table_m WHERE matching_userid =(?)",
        [_id],
        function (err, rows, fields) {
          if (err) {
            console.log("룸 만들다 err");
          } else {
            console.log(rows[0]);
            // console.log(rows[0].womanid);
            if (rows[0] === undefined) {
            } else {
              const room_name = rows[0].matching_userid.concat(
                rows[0].matching_womanid
              );
              const womanid = rows[0].matching_womanid;
              socket.join((room_name, womanid), () => {
                console.log(room_name + " 남자: 접속완료");
                connection.query(
                  "INSERT INTO wagle_room (room_userid, room_touserid, room_roomname) values (?,?,?)",
                  [_id, womanid, room_name],
                  function (err, rows, fields) {
                    console.log(_id + womanid + room_name);
                    if (err) {
                      console.log("err");
                    }
                    connection.query(
                      "DELETE FROM matching_table_m WHERE matching_userid =(?)",
                      [_id],
                      function (err, rows, field) {}
                    );
                  }
                );
              });
            }
          }
        }
      );
    } else {
      connection.query(
        "SELECT * FROM matching_table_w WHERE matching_userid =(?)",
        [_id],
        function (err, rows, fields) {
          if (err) {
            console.log("룸 만들다 err");
          } else {
            if (rows[0] === undefined) {
            } else {
              const room_name = rows[0].matching_manid.concat(
                rows[0].matching_userid
              );
              socket.join(room_name, () => {
                console.log(room_name + " 여자: 접속완료");
                connection.query(
                  "INSERT INTO wagle_room (room_userid, room_touserid, room_roomname) values (?,?,?)",
                  [_id, rows[0].matching_manid, room_name],
                  function (err, rows, fields) {
                    connection.query(
                      "DELETE FROM matching_table_w WHERE matching_userid =(?)",
                      [_id],
                      function (err, rows, fields) {
                        console.log("매칭 테이블 삭제");
                      }
                    );
                  }
                );
              });
            }
          }
        }
      );
    }
  });
});
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
