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
  var numClients = {};
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
  socket.on("allroomjoin", (userid) => {
    // 전체방 접속
    socket.join("allmatchingroom");
    if (io.sockets === undefined) {
    } else {
      var clients = io.sockets.adapter.rooms["allmatchingroom"].sockets;

      //to get the number of clients

      var numClients =
        typeof clients !== "undefined" ? Object.keys(clients).length : 0;

      io.to("allmatchingroom").emit("clientnum", numClients);
    }
  });

  socket.on("send allmessage", (post) => {
    //DB에 메시지를 저장한다.
    connection.query(
      "INSERT INTO waglegroup_mes (waglegroup_nickname, waglegroup_message, waglegroup_userid) VALUES (?,?,?)",
      [post.nickname, post.message, post.userid],
      function (err, rows, fields) {
        if (err) {
          console.log("전체 채팅방 메시지 저장에 에러");
          console.log(err);
        }
      }
    );

    io.to("allmatchingroom").emit("recieve allmessage", post);
  });
  socket.on("disconnectallmessage", (userid) => {
    socket.leave("allmatchingroom");
    if (io.sockets === undefined) {
    } else {
      if (io.sockets === undefined) {
      } else if (io.sockets.adapter.rooms["allmatchingroom"] === undefined) {
      } else {
        var clients = io.sockets.adapter.rooms["allmatchingroom"].sockets;
        var numClients =
          typeof clients !== "undefined" ? Object.keys(clients).length : 0;

        io.to("allmatchingroom").emit("clientnum", numClients);
      }
    }
  });

  socket.on("matchingtouser", (matching_info) => {
    //////////////////원영 수정////////////////////////
    const lastmessage = "매칭이 성공적으로 되었습니다.";

    // 매칭
    connection.query(
      "INSERT INTO wagle_room (room_userid,room_touserid,room_lastmessage, room_roomname) values (?,?,?,?)",
      [
        matching_info.touserid,
        matching_info.userid,
        lastmessage,
        matching_info.roomname,
      ],
      function (err, rows, field) {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "SELECT * FROM user_info WHERE user_id =(?)",
            [matching_info.touserid],
            function (err, rows, fields) {
              if (err) {
                console.log("상태방 매칭 카운터 찾는데 에러" + err);
              } else {
                let room_count = rows[0].room_count;
                room_count++;
                connection.query(
                  "UPDATE user_info SET room_count = ? WHERE user_id =(?)",
                  [room_count, matching_info.touserid],
                  function (err, rows, fields) {
                    if (err) {
                      console.log("소켓 카운터 증가 에러: " + err);
                    } else {
                      const username = matching_info.touserid + "start";

                      io.to(username).emit("successmatching", matching_info); // 먼저 등록한 사람한테 소켓 emit

                      io.to(matching_info.touserid + "start").emit(
                        "newmarking",
                        username
                      );
                      io.to(matching_info.userid + "start").emit(
                        "newmarking",
                        username
                      );
                    }
                  } // 닉네임으로 카운터 변경
                );
              }
            }
          );
        }
      }
    );
  });
  //////////////////////////////////////////////////////

  socket.on("start join", (userid) => {
    console.log("스타트 룸 방 참가" + userid);
    socket.join(userid + "start");
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
    //io 전체에 new message라는것을 보냄 but to('')는 특정 방에 보내는것

    io.to(message.roomname).emit("new message", message);
    io.to(message.touser).emit("new messageroom", message);
    io.to(message.touser + "start").emit("newmarking", message.userid);
  });
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
