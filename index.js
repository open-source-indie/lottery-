//imports & libraries
const prompt = require('prompt-sync')();

//global variables(capitalize)
const ROWS = 3;
const COLS = 3;

//create an object 
const SYMBOLS_COUNT = {
    //keys mapped with different values
    A : 2,
    B : 4,
    C : 6,
    D : 8,
};

const SYMBOL_VALUES = {
    //multiplier values
    A : 5,
    B : 4,
    C : 4,
    D : 2,
};

const deposit = () => {
    //infinite loop until user enters a valid amount
  while(true){  
    //ask the user to deposit money
    const depositAmount = prompt("Enter deposit amount: ");
    //convert the amount to a number
    const numberDepositAmount = parseFloat(depositAmount);
    //ensure that the amount is a number and if not, ask the user to repeat
    //also check that the amount is valid
    if (isNaN(numberDepositAmount) || numberDepositAmount <=0) {
        console.log("Invalid deposit amount, try again!");
    } 
    // break the loop if the amount is valid
     else {
        return numberDepositAmount;
    }
  }
};
//ask the number of lines user will bet on
const getNumberOfLines = () => {
    while(true){  
        //ask the user to deposit money
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        //convert the amount to a number
        const NumberOfLines = parseFloat(lines);
        //ensure that the amount is a number and if not, ask the user to repeat
        //also check that the amount is valid
        if (isNaN(NumberOfLines) || NumberOfLines <=0 || NumberOfLines > 3 ) {
            console.log("Invalid number of lines, try again!");
        } 
        // break the loop if the amount is valid
         else {
            return NumberOfLines;
        };
      };
};

//fn to get total bet and ensure bet doesn't exceed balance
const getBet = (balance, lines) => {
    while(true){  
        //ask the user to deposit money
        const bet = prompt("Enter the bet per line: ");
        //convert the amount to a number
        const NumberBet = parseFloat(bet);
        //ensure that the amount is a number and if not, ask the user to repeat
        //also check that the amount is valid
        if (isNaN(NumberBet) || NumberBet <=0 || NumberBet > balance / lines ) {
            console.log("Invalid bet, try again or deposit more money!");
        } 
        // break the loop if the amount is valid
         else {
            return NumberBet;
        };
    };
};
 
//create a spin
//generate a reel depending on the symbols inside an array
//remove each value after use, don't change the array but you can manipulate it
const spin = () => {
    //loop through
    const symbols = [];
    for ( const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for ( let i = 0; i < count; i++) {
        //insert symbol into array using push
            symbols.push(symbol);
        };
    };
    //create nested arrays/for loop & set loops and set it to stop when matched
    const reels = [];
    for ( let i = 0; i < COLS; i++) {
        reels.push([]);
        //run arrays like elements
        const reelSymbols = [...symbols];
            for ( let j = 0; j < ROWS; j++) {
                // 0-1
              //generate & select a random array depending on the betting line(also round down not up to the nearest whole number)
              const randomIndex = Math.floor(Math.random() * reelSymbols.length);
              const selectedSymbol = reelSymbols[randomIndex];
              //push to current reel
              reels[i].push(selectedSymbol);
              //remove the selected symbol so as not to be selected again
              reelSymbols.splice(randomIndex, 1);
            };
            };
            return reels;
};

//arrange and show the winners
const transpose = (reels) => {
    //new rows
    const rows = [];
    //for loop according to number of rows
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        };
    };
    return rows
};

//print rows, output  
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol]of row.entries()) {
            rowString += symbol
            //check the position of the and see whether to  insert the pipe
            if (i != row.length - 1) {
                rowString += " | "
            };
        };
        console.log(rowString);
    };
};

//check according to how the user bets
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        //check similarity
        const symbols = rows[row];
        let allSame = true;
        //check if user won
        for (const symbol of symbols) {
            //stop if not similar and exit loop
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
};

const game = () => {
    //use let to adjust the amount
    let balance = deposit();
    console.log(balance);
    //make a loop to continue playing
    while (true) {
    //show the balance before and after playing
    console.log ("You have a balance of sh." + balance);
    //after entering the deposit amount
    const NumberOfLines = getNumberOfLines(); 
    const bet = getBet(balance, NumberOfLines);
    //deduct amount
    balance -= bet * NumberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, NumberOfLines);
    //add the winning amount to user
    balance += winnings;
    console.log("Congratulations, You won, sh." + winnings.toString());
    //ask user if to continue & stop if low balance
    if (balance <= 0) {
        console.log("Sorry, you ran out of money!" + "Your balance is sh. " + balance + " Kindly deposit to continue winning.");
        break;
    }
    const playAgain = prompt("Do you want to continue winning? (1 for Yes , 2 for No)");
    //check user input
    if (playAgain != "1") break;
    };
};
game();
