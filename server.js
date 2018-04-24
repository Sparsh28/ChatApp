var express = require("express")
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express()
var http = require("http").Server(app)
var io= require("socket.io")(http)
var conString = "mongodb://srakshadev_v:Srakshadev@ds147659.mlab.com:47659/chat_dev"
app.use(express.static(__dirname + '/public'));
//mongoose.Promise = global.Promise; 
mongoose.connect(conString);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on("connection", function(socket){
    console.log("Socket is connected...")
});

var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})
app.get("/chats", function(req, res){
    Chats.find({}, function(error, chats){
        res.send(chats)
    })
})
app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200) 
        //Emit the event
 		io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})
var server = http.listen(8080, function(){
    console.log("Well done, now I am listening on ", server.address().port)
})