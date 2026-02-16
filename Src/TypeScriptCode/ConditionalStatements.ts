import promptSync from 'prompt-sync';
const prompt = promptSync();

// Statements
// 1. Condtional/Decision-Making Statements: 
// if-else statement: allows you to execute different blocks of code based on a condition. 
// Example: 
    let ageAA:number = parseInt(prompt("Enter your age:")); // Prompt the user to enter their age
    if (ageAA >= 18) { 
        console.log("You are an adult."); 
    } else { 
        console.log("You are a minor."); 
    }
// Output: You are an adult. (The condition age >= 18 is true, so the first block of code is executed)

    let score:number = 10;
    if (score % 2 === 0) { 
        console.log(`The ${score} is even.`); 
    } else { 
        console.log(`The ${score} is odd.`); 
    }

    const nameInput = prompt("Enter your name:"); // Prompt the user to enter their name
    if (nameInput) { // Check if the user entered a name (not null or empty)
        console.log(`Hello, ${nameInput.toUpperCase()}!`); // Greet the user with their name   
    } else {
        console.log("Hello, Guest!"); // Greet the user as Guest if no name was entered
    }

// switch statement: allows you to execute different blocks of code based on the value of a variable.
// Example: 
    let dayOfWeek:number = parseInt(prompt("Enter a day of the week:")); // Prompt the user to enter a day of the week
    switch (dayOfWeek) { 
        case 1: 
            console.log("Monday");
            break;
        case 2: 
            console.log("Tuesday");
            break;
        case 3: 
            console.log("Wednesday");
            break;
        case 4: 
            console.log("Thursday");
            break;
        case 5: 
            console.log("Friday");
            break;
        case 6: 
            console.log("Saturday");
            break;
        case 7: 
            console.log("Sunday");
            break;
        default: 
            console.log("Invalid day of the week");
    }

// Switch include expression:
    let number1:number = parseInt(prompt("Enter a number:")); // Prompt the user to enter a number
    let number2:number = parseInt(prompt("Enter another number:")); // Prompt the user to enter another number
    switch (number1 - number2) {
        case 0:
            console.log("The numbers are equal.");
            break;
        case 5:
            console.log("The difference is 5.");
            break;
        case 10:
            console.log("The difference is 10.");
            break;
        default:
            console.log("The difference is neither 0, 5, nor 10.");
    }

// Switch with expression:
    let xum: number = parseInt(prompt("Enter a number:")); // Prompt the user to enter a number
    let yum: number = parseInt(prompt("Enter another number:")); // Prompt the user to enter another number
    let operation: string = prompt("Enter an operation (+, -, *, /):"); // Prompt the user to enter an operation
    let result: number;
    switch (operation) { 
        case '+':   
            result = xum + yum;
            console.log(`The sum of ${xum} and ${yum} is: ${result}`);
            break;
        case '-':
            result = xum - yum;
            console.log(`The difference of ${xum} and ${yum} is: ${result}`);
            break;      
        case '*':           
            result = xum * yum;
            console.log(`The product of ${xum} and ${yum} is: ${result}`);
            break;
        case '/':
            if (yum !== 0) { // Check for division by zero
                result = xum / yum;
                console.log(`The quotient of ${xum} and ${yum} is: ${result}`);
            } else {
                console.log("Error: Division by zero is not allowed.");
            }
            break;  
        default:
            console.log("Invalid operation");
    }

