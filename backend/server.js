import express from "express"
import http from "http"
import { Server } from "socket.io"
import { ACTIONS } from "./SocketEvents.js";
import axios from "axios";
import { stdin } from "process";

const app = express();
const server = http.createServer(app)
const io = new Server(server)

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return { socketId, username: userSocketMap[socketId] }
    })
}

io.on('connection', (socket) => {
    console.log('user connected ', socket.id);


    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {

        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                newUser: username,
                socketId: socket.id
            });
        })
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        io.to(roomId).emit(ACTIONS.CODE_CHANGE,{code})
        
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        //console.log("Here",code)
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
    })

    socket.on(ACTIONS.SYNC_LANG,({socketId,language})=>{
        console.log("Here",language)
        io.to(socketId).emit(ACTIONS.LANG_CHANGE,{language})
    })

    socket.on(ACTIONS.LANG_CHANGE,({roomId,language})=>{
        io.to(roomId).emit(ACTIONS.LANG_CHANGE,{language})
    })


    socket.on(ACTIONS.COMPILE_CODE,async ({code,language,version,roomId,input})=>{
        const response = await axios.post("https://emkc.org/api/v2/piston/execute",{
            language,
            version,
            files:[
                {
                    content:code
                }
            ],
            stdin:input
        })
        console.log("Here",response)
        io.to(roomId).emit(ACTIONS.CODE_RESPONSE, { response: response.data });
    })

    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                leavingUser:userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })


})



const PORT = 5000
server.listen(PORT, (req, res) => {
    console.log(`Server listening on PORT ${PORT}`)
})