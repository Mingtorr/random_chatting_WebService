const express = require("express");
const mysql = require("mysql");
const router = express.Router();
var http = require("http").createServer(router);
const io = require("socket.io")(http);

// nodemailer 모듈 요청
const nodemailer = require("nodemailer");
const { light } = require("@material-ui/core/styles/createPalette");
const { futimes } = require("fs");
const hbs = require("nodemailer-express-handlebars");
//mysql연결
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wagle",
});

router.post("/message_alldrop", (req, res) => {
  connection.query(
    " DELETE FROM wagle_message WHERE (message_userid=? and message_touserid=?) or (message_userid =? and message_touserid=?)",
    [req.body.userid, req.body.touserid, req.body.touserid, req.body.userid],
    function (err, rows, field) {}
  );
});

//메시지 보낼 때 아이디 TOUSER인지 FROMUSER 인지
router.post("/tomessage", (req, res) => {
  const _id = req.body._id;
  const msg = req.body.message;
  connection.query(
    "INSERT INTO wagle_message (message_userid, message_body) values (?, ?)",
    [_id, msg],
    function (err, rows, fiedl) {
      res.send();
    }
  );
});

//to_id불러오기
router.post("/callid", (req, res) => {
  const _id = req.body.res;
  connection.query(
    "SELECT room_touserid FROM wagle_room WHERE userid = ?",
    [_id],
    function (err, rows, field) {
      res.send(rows);
    }
  );
});

//메시지 저장
router.post("/message", (req, res) => {
  const _id = req.body.userid; //보내는 아이디
  const roomname = req.body.roomname;
  const _toid = req.body.touser;
  const body = req.body.body;

  connection.query(
    "INSERT INTO wagle_message (message_userid, message_touserid, message_body, message_roomname) VALUES (?, ?, ?, ?)",
    [_id, _toid, body, roomname],
    function (err, rows, field) {
      if (err) {
      }

      res.send();
    }
  );
});
router.post("/droproom", (req, res) => {
  connection.query(
    "select * from wagle_room where room_userid = ?",
    [req.body.userid],
    function (err, rows, field) {
      if (rows[0].room_drop === null) {
        connection.query(
          "DELETE FROM wagle_room WHERE room_userid=? and room_touserid=?",
          [req.body.userid, req.body.touserid],
          function (err, rows, field) {
            connection.query(
              'update wagle_room set room_drop=?, room_lastmessage = "상대방이 나갔습니다." ,room_lastuserid=? where room_userid = ? and room_touserid = ?',
              [1, req.body.userid, req.body.touserid, req.body.userid],
              function (err, rows, field) {
                res.send();
              }
            );
          }
        );
      } else {
        connection.query(
          "DELETE FROM wagle_room WHERE room_userid=? and room_touserid=?",
          [req.body.userid, req.body.touserid],
          function (err, rows, field) {
            connection.query(
              " DELETE FROM wagle_message WHERE (message_userid=? and message_touserid=?) or (message_userid =? and message_touserid=?)",
              [
                req.body.userid,
                req.body.touserid,
                req.body.touserid,
                req.body.userid,
              ],
              function (err, rows, field) {
                res.send();
              }
            );
          }
        );
      }
    }
  );
});

//최근 메시지 저장
router.post("/last", (req, res) => {
  const _id = req.body.userid;
  const roomname = req.body.roomname;

  const last = req.body.body;

  connection.query(
    "UPDATE wagle_room SET room_lastmessage = ?, room_lastuserid = ? WHERE room_roomname = ?",
    [last, _id, roomname],
    function (err, rows, field) {
      if (err) {
      }

      res.send();
    }
  );
});

//messageshow
router.post("/messageshow", (req, res) => {
  const _id = req.body._id;
  const touserid = req.body.touser;
  connection.query(
    "SELECT * FROM wagle_message where (message_userid = ? and message_touserid = ?) or (message_userid = ? and message_touserid = ?) order by message_time",
    [_id, touserid, touserid, _id],
    function (err, rows, field) {
      res.send(rows);
    }
  );
});

router.post("/message_collect", (req, res) => {
  const userid = req.body.userid;
  connection.query(
    "select * from wagle_room where room_userid = ?",
    [userid],
    function (err, rows, field) {
      res.send(rows);
    }
  );
});

//3001/Signup 포트로 보내기
router.post("/Signup", (req, res) => {
  //회원가입
  const _id = req.body._id;
  const mail = req.body.email;
  const pass = req.body.pass;
  const pass2 = req.body.pass2;
  const nickname = req.body.nick;
  const sex = req.body.sex;
  connection.query(
    "insert into user_info (user_id,user_password, user_nickname, user_email, user_sex) values (?,?,?,?,?)",
    [_id, pass, nickname, mail, sex],
    function (err, rows, fields) {
      if (err) {
        res.send(false);
      } else {
        res.send(true);
      }
    }
  );
});
router.post("/onmatching", (req, res) => {
  connection.query(
    "SELECT * FROM wagle_room WHERE room_userid =(?)",
    [req.body.userid],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        res.send(false); //중복 없음 사용가능
      } else {
        res.send(true); // 중복 있음 사용안됨
      }
    }
  );
});
//닉네임 중복검사 하는거
router.post("/CheckNick", (req, res) => {
  const checkingNick = req.body.check_Nick;
  connection.query(
    "SELECT user_nickname FROM user_info WHERE user_nickname =(?)",
    [checkingNick],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        res.send(true); //중복 없음 사용가능
      } else {
        res.send(false); // 중복 있음 사용안됨
      }
    }
  );
});
//ID 중복검사 하는거
router.post("/CheckId", (req, res) => {
  const checkingId = req.body.check_Id;
  connection.query(
    "SELECT user_id FROM user_info WHERE user_id =(?)",
    [checkingId],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        res.send(true); //중복 없음 사용가능
      } else {
        res.send(false); // 중복 있음 사용안됨
      }
    }
  );
});

router.post("/CheckStart", (req, res) => {
  if (req.body.sex === "M") {
    connection.query(
      "SELECT * FROM matching_table_m WHERE matching_userid = ?",
      [req.body.userid],
      function (err, rows, field) {
        if (rows[0] === undefined) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    );
  } else {
    connection.query(
      "SELECT * FROM matching_table_w WHERE matching_userid = ?",
      [req.body.userid],
      function (err, rows, field) {
        if (rows[0] === undefined) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    );
  }
});
//매칭테이블 확인
router.post("/CheckMatching", (req, res) => {
  if (req.body.sex === "M") {
    connection.query("SELECT * FROM matching_table_w", [], function (
      err,
      rows,
      fields
    ) {
      if (rows[0] === undefined) {
        //매칭할 여자가 없을때 남자는 값을 넣는다.
        //테이블 없음

        connection.query(
          "INSERT INTO matching_table_m (matching_userid) values (?)",
          [req.body.userid],
          function (err, rows, field) {
            const touserid = {
              touserid: undefined,
            };

            res.send(touserid); //생각
          }
        );
      } else {
        //매칭할 여자가 있을Eo
        const userm = req.body.userid;
        const userw = rows[0].matching_userid;
        connection.query(
          "INSERT INTO wagle_room (room_userid,room_touserid,room_roomname) values (?,?,?)",
          [userm, userw, userm + userw],
          function (err, rows, field) {
            connection.query(
              "delete from matching_table_w where matching_userid = ?",
              [userw],
              function (err, rows, field) {
                if (err) {
                }

                const match_info = {
                  userid: userm,
                  touserid: userw,
                  roomname: userm + userw,
                };
                res.send(match_info);
              }
            );
          }
        );
      }
    });
  } else {
    //여자일떄

    connection.query("SELECT * FROM matching_table_m", [], function (
      err,
      rows,
      fields
    ) {
      if (rows[0] === undefined) {
        //매칭할 남자가 없음 여자 값 넣음
        //테이블 없음

        connection.query(
          "INSERT INTO matching_table_w (matching_userid) values (?)",
          [req.body.userid],
          function (err, rows, field) {
            const touserid = {
              touserid: undefined,
            };

            res.send(touserid); //생각
          }
        );
      } else {
        //매칭할 남자가 있을Eo
        const userm = rows[0].matching_userid;
        const userw = req.body.userid;
        connection.query(
          "INSERT INTO wagle_room (room_userid,room_touserid,room_roomname) values (?,?,?)",
          [userw, userm, userm + userw],
          function (err, rows, field) {
            connection.query(
              "delete from matching_table_m where matching_userid = ?",
              [userm],
              function (err, rows, field) {
                if (err) {
                }

                const match_info = {
                  userid: userw,
                  touserid: userm,
                  roomname: userm + userw,
                };
                res.send(match_info);
              }
            );
          }
        );
      }
    });
  }
});
//로그인 하는 부분
router.post("/login", (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  const box = {};
  box.boolean = false;

  connection.query(
    "SELECT user_id FROM user_info WHERE user_id = (?)",
    [name],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        res.send(box);
      } else {
        connection.query(
          "SELECT user_id, user_password ,user_email,user_nickname, user_sex FROM user_info WHERE  user_id = (?) AND user_password =(?)",
          [name, pass],
          function (err, rows, fields) {
            if (rows[0] === undefined) {
              res.send(box);
            } else {
              box.user_id = rows[0].user_id;
              box.user_email = rows[0].user_email;
              box.user_nickname = rows[0].user_nickname;
              box.user_sex = rows[0].user_sex;
              box.boolean = true;
              res.send(box);
            }
          }
        );
      }
    }
  );
});

//닉네임 업데이트하기
router.post("/Update_nick", (req, res) => {
  const nick = req.body.nick;
  const preNick = req.body.preNick;
  connection.query(
    "SELECT user_nickname FROM user_info WHERE user_nickname = (?)",
    [nick],
    function (err, rows, fields) {
      //중복된 닉네임이 없음 닉네임 변경 진행
      if (rows[0] === undefined && !err) {
        connection.query(
          "UPDATE user_info SET user_nickname =(?) WHERE user_nickname =(?)",
          [nick, preNick]
        );

        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});

router.post("/Update_password", (req, res) => {
  const pass = req.body.pass;
  const user_id = req.body._id;

  connection.query(
    "UPDATE user_info SET user_password =(?) WHERE user_id =(?)",
    [pass, user_id],
    function (err, rows, fields) {
      if (err) {
      } else {
      }
    }
  );
});

//sql문에 매칭 취소
router.post("/StopMatch", (req, res) => {
  const _id = req.body._id;
  const sex = req.body.sex;

  if (sex === "M") {
    connection.query(
      "DELETE FROM matching_table_m WHERE matching_userid = ?",
      [_id],
      function (err, rows, fields) {
        if (err) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    );
  } else {
    connection.query(
      "DELETE FROM matching_table_w WHERE matching_userid = ?",
      [_id],
      function (err, rows, fields) {
        if (err) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    );
  }
});

router.post("/test", (req, res) => {
  console.log("이메일 보내기 접속 확인");
});

router.post("/Sendmail", (req, res) => {
  const email = req.body.sendEmail;
  var authNum = Math.floor(Math.random() * 1000000) + 100000;
  if (authNum > 1000000) {
    authNum = authNum - 100000;
  }

  let emailParam = {
    // toEmail: email + "@changwon.ac.kr", //gmail.com -> changwon.ac.kr로 수정하기
    toEmail: "dnjsdud2257@gmail.com",
    subject: "와글와글 회원가입 인증 메일입니다.",
    text: "인증번호는 " + authNum + "입니다.",
  };

  connection.query(
    "SELECT user_email FROM user_info WHERE user_email = (?)",
    [email],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        //중복된 메일 없음 메일 발송
        mailSender.sendGmail(emailParam);
        res.send(authNum.toString());
      } else {
        //중복된 메일이 있음
        res.send(true);
      }
    }
  );
});

var mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    console.log(param);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 465,
      auth: {
        user: "waglewagle20@gmail.com",
        pass: "changwon@0",
      },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: "express-handlebars",
        viewPath: "../server/",
      })
    );
    // 메일 옵션
    var mailOptions = {
      from: "waglewagle20@gmail.com",
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      text: param.text, // 메일 내용
      // html:
      //   '<div style ="background-image:url("background.jpg");width: 434px; height: 609; background-repeat: no-repeat; display: flex; > <div style= "display: flex; flex-direction: column"><span style="font-size: 16px; color: #f05052">창원대 과팅앱</span><span style="font-size: 40px; color: #f05052">와글와글</span> </div> <div style ="display: flex; flex-direction: column; justify-content:center; align-item:center; margin-top: 90px;"><span style="font-size: 20px; color: #f05052">인증번호는 123123입니다.</span></div> </div>',
      // html: '<img src = "background.jpg"/>',
      template: "main",
    };
    // 메일 발송
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

module.exports = router;
