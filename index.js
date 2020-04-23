let app = require('express')();
const cors=require('cors');
app.use(cors());
const bodyparser = require('body-parser');
app.use(bodyparser.json());
let http = require('http').Server(app);
let io = require('socket.io')(http);
const mysql = require('mysql'); 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});   
    var sql = "insert into pp2 values(null,'"+socket.nickname+"','"+message.text+"',null)"
     connection.query(sql, [message.text], (err, rows, fields) => {
         if (!err)
           console.log('Inserted ');     
         else
          console.log(err);
     }) 
  });
});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});

var connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'chatapp2'
    
 });
 connection.connect((err) => {
     if (!err)
         console.log('DB connection succeded.');
     else
         console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
 });

 app.get('/tb1', (req, res) => {
     connection.query('SELECT * FROM pp2', (err, results) => {
         if (err)
          console.log(err);
         else
       
         res.send(results);
     })
 });

//  app.post('/tb2', (req, res) => {
//      let emp = req.body;
//      var sql = "insert into pp2 values(null,'"+req.body.messages+"','"+req.body.time+"')"
//      connection.query(sql, [emp.messages,emp.time], (err, rows, fields) => {
//          if (!err)
//            console.log('Inserted ');     
//          else
//           console.log(err);
//      })
//  });