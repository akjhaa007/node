var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);
var http = require('http');
app.listen(3000);
console.log("App running...");
function response(req, res) {
    var file = "";
    if(req.url == "/"){
       file = __dirname + '/index.html';
    } else {
       file = __dirname + req.url;
    }
       fs.readFile(file,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Page or file not found');
            }
            res.writeHead(200);
            res.end(data);
        }
    );
 }

io.on("connection", function(socket){

    socket.on("send message", function(sent_msg, callback) {

      	sent_msg = "[ " + "                                                      Human"+ " ]: " + sent_msg;// "["+ postRequest()+ "]";
    
        postRequest().then((resp) => {
        	io.sockets.emit("update messages", sent_msg);
          
            console.log('in the calling method', resp)
            sent_msg = resp
            if(sent_msg !== undefined) {
                io.sockets.emit("update messages", sent_msg);
            } else {
                io.sockets.emit("update messages", {"text":"no message from server"});
            }
            
        })
          
        callback();
    });
});
function getCurrentDate(){
    var currentDate = new Date();
    var day = (currentDate.getDate()<10 ? '0' : '') + currentDate.getDate();
    var month = ((currentDate.getMonth() + 1)<10 ? '0' : '') + (currentDate.getMonth() + 1);
    var year = currentDate.getFullYear();
    var hour = (currentDate.getHours()<10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes()<10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds()<10 ? '0' : '') + currentDate.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
function postRequest() 
{
    var request = require("request");
        var options = { method: 'POST',
        url: 'http://16609b76.ngrok.io/webhooks/rest/webhook',
        headers:
        {
            'content-type': 'application/json' },
        body: { sender: 'peter', message: 'hey' },
         json: true };
         return new Promise((resolve,reject) => {
 request(options, function (error, response, body) {
        if(body) {
            resolve(body[0])
        } else {
            resolve("no output")
        }
}); 
})
}




