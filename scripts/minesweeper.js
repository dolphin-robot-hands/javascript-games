var minesweeper = function() {
  var board = [];
  var size = 9;
  var mine = "💣";
  var flag = 'U+1F6A9';

  //render board
  function render() {
    //reset board
    $('#minesweeper').empty();
    var table = $('<table>');
    for( var y = 0; y < size; y++) {
      var row = $('<tr>');
      table.append(row);
      for( var x = 0; x < size; x++) {
        var contents = board[x][y][0];
        var state = board[x][y][1];
        var index = board[x][y][2];
        // add cell info to the dom
        var cell = $('<td>').attr('id',"i"+index).attr('class',state).html(contents).attr("data-changed",0);

        row.append(cell);
      }
    }
    $('#minesweeper').append(table);
  };

  function checkBoard(x, y) {
    var counter = 0;
    var mineCounter = 0;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (board[i][j][0] === mine ) {
          mineCounter +=1;
        }
        var square = String("#i"+i+"_"+j);

        if (board[i][j][0] != mine && $(square).attr("class") !== "hidden") {
          counter += 1;
        }
      }
      if(counter === ((size*size)-mineCounter)) {
        $(".endgame").text("YOU WIN!!!!")
      }
    }

  };

  // set all board spaces to blank
  function resetBoard() {
    var content = "";
    var cellState = "hidden";
    for (var i = 0; i < size; i++) {
      board[i] = [];
      for (var j = 0; j < size; j++) {
        var index = i+"_"+j
        board[i][j] = [content, cellState, index];
      }
    }
  };

  function seedBoard() {
    //randomly seeds mines
    for ( var i = 0; i < size; i++) {
      var x = Math.floor(Math.random()*(size));
      var y = Math.floor(Math.random()*(size));
      board[x][y][0] = mine;
    }
    // generate numbers
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
      //loop through nearby cells to count mines
        var minecount = 0;
        var cellList = adjacentCells(i,j);

        for (var q = 0; q < cellList.length; q++) {
          //check if nearby cell is a mines
          var a = cellList[q][0]
          var b = cellList[q][1]
          if (board[a][b][0] === mine) {
            minecount += 1;
          }
        }
        //add numbers
        if (board[i][j][0] !== mine && minecount !== 0) {
          board[i][j][0] = minecount;
        }
      }
    }
  }

  //return an array of the coordinates of all touching cells
  function adjacentCells(i,j) {
    var cells = []
    for (var k = -1; k < 2; k++) {
      for (var l = -1; l < 2; l++) {
        //check if cell exists and it's not the target cell
        var a = i+k;
        var b = j+l;
        if ( a > -1 && a < size && b > -1 && b < size &&!(k === i && l === j))  {
          cells.push([a,b])
        }
      }
    }
    return cells;
  }

  function revealBlanks(x,y) {

    var cellList = adjacentCells(parseInt(x),parseInt(y));

    for (var q = 0; q < cellList.length; q++) {
      //check if nearby cell is a mines
      var a = cellList[q][0]
      var b = cellList[q][1]
      var square = String("#i"+a+"_"+b);
      var count = 0
      var count = parseInt($(square).attr("data-changed"));
      $(square).attr("class","").attr("data-changed",1 + count);
      if (board[a][b][0] === "" & $(square).attr("data-changed") < 2) {
        revealBlanks(a,b);
      }
    }
  }

  function ismine($clicked) {
    $clicked.attr('class', '');
    $("td:contains('💣')").attr('class', '').css('background-color','red');
    $(".endgame").text("YOU LOSE!!!!")
    $("td").click(false);
  }

  function isblank(x,y) {
    revealBlanks(x,y)
  }

  function isnumber($cell) {
    $cell.attr('class', '');
  }

  return {
    initiate: function() {
                resetBoard();
                seedBoard();
                render();
              },

    clicked: function($cellClicked) {
                var x = $cellClicked.attr('id').slice(1,2);
                var y = $cellClicked.attr('id').slice(3,4);

                if ($cellClicked.attr('class') === "hidden") {
                  if ($cellClicked.html() === "💣" ) {
                    ismine($cellClicked);
                  }
                  if ($cellClicked.html() === "" ) {
                    isblank(x,y);
                  }
                  else {
                    isnumber($cellClicked);
                  }
                }
                checkBoard();
              },

    rightClicked: function($cellClicked) {
                    if ($cellClicked.hasClass("hidden"))  {
                      if($cellClicked.html() === "🚩"){
                        var x = parseInt($cellClicked.attr('id').slice(1,2));
                        var y = parseInt($cellClicked.attr('id').slice(3,4));
                        var cellContent = board[x][y][0];

                        $cellClicked.html(cellContent).attr('class','hidden');
                      }
                      else {
                        $cellClicked.html("🚩").attr('class','hidden flag');
                      }
                    }
    }
  };
};

$(document).ready( function() {
  minesweeper = new minesweeper();
  minesweeper.initiate();

  $( 'table').on('click', 'td', function() {
    minesweeper.clicked($(this));
  });

  $('table').on("contextmenu", 'td', function(e){
    minesweeper.rightClicked($(this));
    return false;
  });

  $('.newgame').click( function() {
    // not sure why calling initiate doesn't work???
    location.reload();
  });

});
