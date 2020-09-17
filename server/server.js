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
  socket.on("matchingtouser", (matching_info) => {
    console.log(matching_info.touserid);
    connection.query(
      "INSERT INTO wagle_room (room_userid,room_touserid,room_roomname) values (?,?,?)",
      [matching_info.touserid, matching_info.userid, matching_info.roomname],
      function (err, rows, field) {
        console.log("여자도 완료");
        const username = matching_info.touserid + "start";
        console.log(username);
        io.to(username).emit("successmatching", matching_info);
      }
    );
  });
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
    console.log("sendmessage" + message);
    console.log("방이름" + message.roomname);
    //io 전체에 new message라는것을 보냄 but to('')는 특정 방에 보내는것
    console.log(message.userid + "ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ123213213123123");
    io.to(message.roomname).emit("new message", message);
    io.to(message.touser).emit("new messageroom", message);
    io.to(message.touser + "start").emit("newmarking", message.userid);
  });
  socket.on("newmark", (userid) => {
    console.log("newmark");
    connection.query(
      "SELECT * FROM wagle_room WHERE room_userid = (?)",
      [userid],
      function (err, rows, fields) {
        if (err) {
          console.log(err);
          console.log("newmessage 찾기 err");
        } else if (rows[0] === undefined) {
        } else if (rows[0].room_lastuserid === userid) {
          console.log("new가 아닐때");
          //new가 아닐때
        } else {
          console.log(
            "new가 맞을때 rows[0].room_touserid: " + rows[0].room_touserid
          );
          // io.to(userid + "start").emit("newmarking");
          socket.emit("newmarking");
          io.to(rows[0].room_touserid + "start").emit(
            "newmarking",
            rows[0].room_touserid
          );
          // 상대방한테 emit
        }
      }
    );
  });
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
