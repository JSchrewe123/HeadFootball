const io = require("socket.io")(3000, {
    cors: {
        origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    },
});

const { createGameState, gameLoop, getNewDownVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');

//for each player it contains the lobby they are in 1 -> 1
let lobbies = {};
let states = {};

//when connecting
io.on('connection', socket => {
    console.log("new connection: " + socket.id);
    socket.on("sendMessage", (msg) => {
        // sends the message back to all other sockets in the room
        socket.to(lobbies[socket.id]).emit("newMsg", msg);
        // console.log(msg);
    });

    //joining Room
    socket.on("joinRoom", room => {
        // checking if the room exists and then joining the user to that room
        if (!Object.values(lobbies).includes(room)) {
            socket.emit("roomNoExists");
            return; 
        }

        let count = 0;
        Object.values(lobbies).forEach(element => {
            if (element === room){
                count += 1;
            }
        });

        if (count > 1){
            socket.emit("roomFull");
            return;
        } 

        socket.emit("successJoinRoom", room);
        socket.join(room);
        lobbies[socket.id] = room;
        socket.number = 2;

        //start the game
        startGameInterval(room);

        socket.broadcast.to(room).emit("removeWait");

    });

    //creating new Room
    socket.on("createRoom", (cb) => {
        // creates a new room and adds the user to it
        let roomId = generateRoomID(socket.id);
        lobbies[socket.id] = roomId;
        socket.join(roomId);
        socket.emit("createdRoom", roomId);
        socket.number = 1;
        const state = createGameState();
        states[roomId] = state;
        // console.log(lobbies[socket.id]);
    });


    //handling pressing buttons
    socket.on("keydown", handleKeyDown);

    function handleKeyDown(key){

        if (!lobbies[socket.id]) {
            return;
        }
        let room = lobbies[socket.id];
        let state = states[room];
        let playerNumber = socket.number;
        let newVelocity = getNewDownVelocity(key, state, playerNumber);

        if (newVelocity) {
            if (newVelocity[0] === 'x') {
                states[room].players[socket.number - 1].velocity.x = newVelocity[1];
            } else if (newVelocity[0] === 'y'){
                states[room].players[socket.number - 1].velocity.y = newVelocity[1];         
            }
        }

    };

    socket.on("keyup", handleKeyUp);

    function handleKeyUp(key){

        if (!lobbies[socket.id]) {
            return;
        }

        let room = lobbies[socket.id];
        states[room].players[socket.number - 1].velocity.x = 0;

    };

    //handling creating Game
    socket.on("createGame",(clientId) => {
        let room = lobbies[clientId];
        const state = createGameState();
        states[room] = state;

        startGameInterval(room);
    });

});

function startGameInterval(room){
    const intervalId = setInterval(() => {

        let state = states[room];
        const winner = gameLoop(state);

        if(!winner){
            io.to(room).emit("newState", JSON.stringify(state));
        } else {
            io.to(room).emit("gameOver");
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
};

function generateRoomID(clientName){
    roomId = clientName.slice(0, (clientName.length/2));
    return roomId;
};

console.log("server listening on port 3000");
