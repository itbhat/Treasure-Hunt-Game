# Treasure-Hunt-Game
I created this game as a part of my assignment for my module of web programming at the University of Liverpool. It is an attempt by me to create a replica of the following github project: https://github.com/mingfeisun/Submarine-game

The JavaScript program implements a simple game that consists of three stages, setup, play and end. During the play stage the game proceeds in rounds. The game is played on a grid with 10 x 10 cells, surrounded by an insurmountable wall, and involves a treasure hunter, controlled by the user, who collects treasures that are placed on the grid.
The game always starts in the setup stage. During that stage the user is shown the grid and can place three different types of objects on the cells of the grid:
by clicking on a cell and typing a number between 5 and 8, a treasure is placed on a cell, the number indicates the value of the treasure;
by clicking on a cell and typing the letter "o", an obstacle is placed on a cell;
by clicking on a cell and typing the letter "h", the treasure hunter is placed on a cell.
There is no limit on the number of treasures and obstacles, but there is only one treasure hunter. If the user types a character that is not among 5 to 8, "o" and "h", an error message should be shown and nothing is placed on the grid. No cell can contain more than one object and once an object has been placed on a cell it cannot be changed. If the user tries to change the object placed on a cell, then an error message should be shown and nothing changes on the grid. If the user tries to place a second treasure hunter, then an error message should be shown and nothing changes on the grid.
In addition to the grid, there should be a button that allows the user to end the setup stage of the game. If the user tries to end the setup stage of the game without placing the treasure hunter, then an error message should be shown and the user remains in the setup stage. Otherwise the game continues with the play stage.
At the start and during the play stage, the user is again shown the grid, initially with all the objects that have been placed on the grid, plus additional status information:
The number of rounds already completed,
the number of treasures with value 5 still on the grid,
the number of treasures with value 6 still on the grid,
the number of treasures with value 7 still on the grid,
the number of treasures with value 8 still on the grid, and
the user's score.
Initially, the user's score is 0 and the number of rounds already completed is also 0. Whenever the number of rounds played, the number of treasures remaining on the grid or the user's score changes, then the status information shown by the program must be updated.
In addition, there must be a button that allows the user to end the play stage and to proceed to the end stage at any time.
While in the play stage, the game proceeds in rounds. During each round, the user can attempt to move the treasure hunter horizontally or vertically on the grid by typing one of the following four letters:
"a" attempts to move the treasure hunter one cell to the left,
"d" attempts to move the treasure hunter one cell to the right,
"w" attempts to move the treasure hunter one cell up,
"s" attempts to move the treasure hunter one cell down.
If the user types any other character, then an error message should be shown, the treasure hunter does not move, the round does not end, and the user can type another character. If the attempted move would result in the treasure hunter ending up outside the grid or on a cell occupied by an obstacle, then an error message should be shown, the treasure hunter does not move, the round does not end, and the user can type another character. Otherwise, the attempted move is successful and the treasure hunter changes cells.
If the treasure hunter ends up on a cell that contains a treasure, then two things happen. First, the treasure is removed from the grid, the number of treasures with the value of that treasure is reduced by 1, and the value of the treasure is added to the user's score. Second, the program places an additional obstacle on an empty cell randomly selected by the program. The round is then over and the number of rounds completed is incremented by 1.
If the treasure hunter ends up on an empty cell, then the round is simply over and the number of rounds completed is incremented by 1.
The play stage ends if one of the following conditions becomes true

the user ends the play stage (by pressing the button provided for that);
there are no treasures left on the grid;
the treasure hunter is not able to move.
Once the play stage has ended, the game is in the end stage. In the end stage the program computes a performance index as follows: If more than zero rounds have been completed during the play stage, then the performance index is the user's score divided by the number of rounds completed, rounded to two digits after the decimal point. If zero rounds have been completed during the play stage, then the performance index is 0. The program should then display a message showing the performance index and then stop. During the end tage the program should not react to any user input or actions.
