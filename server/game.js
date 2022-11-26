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
        }]
    };
};


//updates the game State and returns if someone won
function gameLoop(state){
    if (!state) {
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];

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
