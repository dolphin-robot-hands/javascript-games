// SNAKE

var gameOn = false;
var score = 0;
// sets and renders the game grid
var grid = {
   x: 30,
   y: 30,
   render: function() {
     var table = $('<table>');
     for( var y = 0; y < this.y; y++) {
       var row = $('<tr>');
       table.append(row);
       for( var x = 0; x < this.x; x++) {
         coordinate = "x"+x+"y"+y;
         var cell = $('<td>').attr('id',coordinate).text("");
         row.append(cell);
       }
     }
     $('#grid').append(table);
   },
   reset: function() {
     $('td').attr("class","none");
   }
};

  // manipulates and renders the snake
var snake = {
  direction: 'right',
  state: [[19,19]],
  lastState: [[19,19]],
  reset: function() {
    this.state = [[19,19]];
  },
  //renders snake
  render: function() {
    this.lastState = $.extend(true,[],this.state);
    changeCell(this.state,"empty");
    switch(this.direction) {
      case 'right':
        this.state["0"]["0"] += 1;
        break;
      case 'left':
        this.state["0"]["0"] -= 1;
        break;
      case 'down':
        this.state["0"]["1"] += 1;
        break;
      case 'up':
        this.state["0"]["1"] -= 1;
        break;
    }
    //set new following sections
    for(var i=1; i<this.state.length; i++) {
      this.state[i] = $.extend(true,[],this.lastState[i-1]);
    }
    changeCell(this.state,"snake");

    headId = "#x"+this.state[0]["0"]+"y"+this.state[0]["1"];
    $(headId).attr('class','snakehead');

    //var head = this.state[0];
    //changeCell(head, "redsnake");
    //console.log(head);
  },
  //adds cells to snake
  grow: function() {
    score += 1;
    var newElement = []
    switch(this.direction) {
      case 'right':
        newElement = [(this.state["0"]["0"] - 1),(this.state["0"]["1"])];
        newElement2 = [newElement[0] - 1,newElement[1]];
        newElement3 = [newElement2[0] - 1,newElement2[1]];
        break;
      case 'left':
        newElement = [(this.state["0"]["0"] + 1),(this.state["0"]["1"])];
        newElement2 = [newElement[0] + 1,newElement[1]];
        newElement3 = [newElement2[0] + 1,newElement2[1]];
        break;
      case 'down':
        newElement = [(this.state["0"]["0"]),(this.state["0"]["1"] - 1)];
        newElement2 = [newElement[0],newElement[1] - 1];
        newElement3 = [newElement2[0],newElement2[1] - 1];
        break;
      case 'up':
        newElement = [(this.state["0"]["0"]),(this.state["0"]["1"] + 1)];
        newElement2 = [newElement[0],newElement[1] + 1];
        newElement3 = [newElement2[0],newElement2[1] + 1];
        break;
    }
    this.state.push(newElement,newElement2,newElement3);
  }
};

// manipulates and renders the food
var food = {
  location: [[3,3]],
  render: function() {
    this.location = [[getRandomIntInclusive(0,grid.x-1),getRandomIntInclusive(0,grid.y-1)]];
    changeCell(this.location, "food");
  }
}

//control movement of snake
$(document).keydown(function(key) {
  switch (key.which) {
    case 37:    //left arrow key
      if (!(snake.direction === "right" && snake.state.length > 1)) {
        snake.direction = "left";
      }
      break;
    case 38:    //up arrow key
      if (!(snake.direction === "down" && snake.state.length > 1)) {
        snake.direction = "up";
      }
      break;
    case 39:    //right arrow key
      if (!(snake.direction === "left" && snake.state.length > 1)) {
        snake.direction = "right";
      }
      break;
    case 40:    //down arrow key
      if (!(snake.direction === "up" && snake.state.length > 1)) {
        snake.direction = "down";
      }
      break;
  }
});

//random number generator
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//changes the color of board cells
function changeCell(cell,cellClass) {
  for(var i = 0; i < cell.length; i++) {
    positionId = "#x"+cell[i]["0"]+"y"+cell[i]["1"];
    $(positionId).attr('class',cellClass);
  }
}

function reset() {
  gameOn = false;
  score = 0;
  grid.reset();
  snake.reset();
  snake.render();
  food.render();
}

function newGame(){
  var loopID = setInterval(function(){loop()}, 100);
  function stopLoop() {
    clearInterval(loopID);
  }
  //game logic
  function loop() {
    $('.score').html('<h1>'+score+'</h1>');
    snake.render();
    //hit edge
    if(snake.state[0][0] < 0 || snake.state[0][1] < 0 ||
       snake.state[0][0] > grid.x-1 || snake.state[0][1] > grid.y-1) {
      reset();
      stopLoop();
    }
    //eat food
    if(snake.state[0][0]===food.location[0][0]&&
       snake.state[0][1]===food.location[0][1]) {
      food.render();
      snake.grow();
    }
    //hit self
    for (var i=1; i<snake.state.length; i++) {
      if(snake.state[0][0]===snake.state[i][0]&&
        snake.state[0][1]===snake.state[i][1]) {
           reset();
           stopLoop();
      }
    }
  }
}

//set game board and begin when a key is pressed
$(document).ready( function() {
  //initiate board
    grid.render();
    snake.render();
    food.render();
  //start game by pressing a key
  $(document).keydown(function(key) {
    if(!gameOn) {
      gameOn = true;
      newGame();
    }
  });
});
