const app = require("express")();
const httpServer = require("http").createServer(app);
const options =  {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  };
const io = require("socket.io")(httpServer, options);
const cors  = require("cors")

app.use(cors())

httpServer.listen(3000, () => console.log("Woza"));


io.on("connection", socket => {
    console.log(`socket.id`, socket.id)
    socket.on("welcome", payload => {
        console.log(`payload`, payload)
        socket.emit("user logged in", { name:"captain"})
    })

    socket.on("make-call", payload =>{
        console.log(`Making a call to ${payload.user}`)
        socket.emit("call-waiting", { wait: true })
        console.log('waiting')
        socket.broadcast.emit("receiving-call", { from: payload.caller })
    })

    socket.on("ignore-call", payload =>{
        socket.broadcast.emit("call-ignored", payload)
        console.log("Call ignored...")
    })

    socket.on("answer-call", payload => {
        socket.broadcast.emit("call-answered", { answer:true, caller:"some caller"})
        console.log(`call answered by ${payload}`)
    })

    socket.on("end-call", () => {
        socket.emit("call-ended")
    })
    
});
