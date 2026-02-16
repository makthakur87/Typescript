// 2. Looping/Iteration Statements: 
// for loop: allows you to execute a block of code a specified number of times. 
// Example:
    console.log("For Loop Output:");
    for (let i:number = 1; i < 6; i++) {
        console.log(i); // Output: 0 1 2 3 4 (the loop executes 5 times, printing the value of i each time)
    }

// while loop: allows you to execute a block of code as long as a specified condition is true. 
// Example: 
    let j:number = 1;
    console.log("While Loop Output:");
    while (j <= 5) {
        console.log(j); // Output: 0 1 2 3 4 (the loop executes as long as the condition j < 5 is true, printing the value of j each time)
        j++;
    }

// do-while loop: similar to the while loop, but guarantees that the block of code will be executed at least once. 
// Example:
    let k:number = 1
    console.log("Do-While Loop Output:");
    do {
        console.log(k); // Output: 0 1 2 3 4 (the loop executes at least once, and continues to execute as long as the condition k < 5 is true, printing the value of k each time)
        k++;
    } while (k < 6);

// 3. Jump Statements: 
// break statement: allows you to exit a loop or switch statement prematurely. 
// Example: for (let i = 0; i < 10; i++) { if (i === 5) { break; } console.log(i); }
    for (let i:number = 1; i <= 10; i++) {
        if (i === 5) {
            break; // Exit the loop when i is equal to 5
        }   
        console.log(i); // Output: 1 2 3 4 (the loop continues to execute until i is equal to 5, at which point it exits the loop)
    }
    
//continue statement: allows you to skip the current iteration of a loop and move to the next one. 
// Example: for (let i = 0; i < 10; i++) { if (i % 2 === 0) { continue; } console.log(i); }
    for (let i:number = 1; i <= 10; i++) {
        if (i === 5) {
            continue; // Exit the loop when i is equal to 5
        }
        console.log(i); // Output: 1 2 3 4 6 7 8 9 10 (the loop continues to execute, but skips the iteration when i is equal to 5)
    }