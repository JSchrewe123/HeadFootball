module.exports = {
    createGameState,
    gameLoop,
    getNewDownVelocity,
}

function createGameState() {
    return {
        players: [{
            position: {
                x: 100,
                y: 100,
            },
            velocity: {
                x: 0,
                y: 0,
            },
    
            size: 100,
            colour: 'red',
            mass: 1,
        },{
            position: {
                x: 400,
                y: 100,
            },
            velocity: {
                x: 0,
                y: 0,
            },
    
            size: 100,
            colour: 'blue', 
            mass: 1,           
        }],
        ball: {
            position: {
                x: 200,
                y: 200,
            },
            velocity: {
                x: 5,
                y: 0,
            },
    
            size: 25,
            mass: 1,
            bounce: 0.9,
        },
    };
};


//updates the game State and returns if someone won
function gameLoop(state){
    if (!state) {
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    const ball = state.ball;

    if (playerOne.velocity.x >= 0) {
        if (playerOne.position.x < 1024 - playerOne.size) {
            playerOne.position.x += playerOne.velocity.x;   
        }   
    } else {
        if (playerOne.position.x > 0) {
            playerOne.position.x += playerOne.velocity.x;   
        }         
    }
    playerOne.position.y += playerOne.velocity.y;

    if (playerTwo.velocity.x >= 0) {
        if (playerTwo.position.x < 1024 - playerTwo.size) {
            playerTwo.position.x += playerTwo.velocity.x;   
        }   
    } else {
        if (playerTwo.position.x > 0) {
            playerTwo.position.x += playerTwo.velocity.x;   
        }         
    }
    playerTwo.position.y += playerTwo.velocity.y;

    //gravity
    if (playerOne.position.y + playerOne.size + playerOne.velocity.y < 500) {
        playerOne.velocity.y += 0.5;
    } else {
        playerOne.velocity.y = 0;
    }

    if (playerTwo.position.y + playerTwo.size + playerTwo.velocity.y < 500) {
        playerTwo.velocity.y += 0.5;
    } else {
        playerTwo.velocity.y = 0;
    }

    //ball
    ball.position.x += ball.velocity.x;

    //floor
    if(ball.position.y + ball.size + ball.velocity.y <= 500){
        ball.velocity.y += 0.5;
    } else {
        // ball.position.y = 500 - ball.size;
        // if (ball.velocity.y < 5) {
        //     ball.velocity.y = 0;
        // } else {
        //     ball.velocity.y = -ball.velocity.y * ball.bounce;
        // }
        // ball.velocity.y = Math.round(-ball.velocity.y * ball.bounce);
        ball.velocity.y = -ball.velocity.y * ball.bounce;
    }
    ball.position.y += ball.velocity.y;

    //ceiling
    // if(ball.position.y - ball.size >= 0){
    //     ball.position.y = ball.size;
    //     ball.velocity.y *= -1 * ball.bounce;
    // }

    //bounce sides
    if(ball.position.x -ball.size <= 0 || ball.position.x + ball.size + ball.velocity.x >= 1024){
        ball.velocity.x *= -1 * ball.bounce;
        // if(ball.velocity.x > 0){
        //     ball.position.x = ball.size;
        // }else{
        //     ball.position.x = 1024 - ball.size;
        // }
    }

    //handling collisions with playerOne
    // if(collision(ball, playerOne)){
    //     resolveCollision(playerOne, ball);
    // }

    //no winning implemented so always just continue    
    return false;
};

function getNewDownVelocity(key, state, playerNumber) {

    let player = state.players[playerNumber - 1];

    switch (key) {
        case 'ArrowRight':
            return ['x',5];   
        case 'ArrowLeft':
            return ['x',-5];   
        case 'ArrowUp':
            if (player.position.y + player.size == 500){
                return ['y',-17];
            }
    }
}

// function collision(ball, playerOne) {
//     let a;
//     let x;
//     let y;

//     a = playerOne.size + ball.size;
//     x = player.position.x - this.position.x;
//     y = player.position.y - this.position.y;

//     if (a > Math.sqrt((x * x) + (y * y))) {
//     return true;
//     } else {
//     return false;
//     }
  
// }
