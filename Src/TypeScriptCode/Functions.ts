// Function: A function is a reusable block of code that performs a specific task. It can take input parameters, execute a series of statements, and return a value. 
// Functions help to organize code, improve readability, and promote code reusability.
    // Example:
    function greet(name: string): string {
        return "Hello, " + name;
    }
    console.log("----- Function -----");
    console.log(greet("Alice")); // Output: Hello, Alice

// Types of Functions in TypeScript:
// 1. Named Function: A function that has a name and can be called by that name. Example: function add(a: number, b: number): number { return a + b; }
// Syntax: 
//  function functionName(parameters): returnType { // function body }

    // Example: 
    function add(a: number, b: number): number {
        return a + b;
    }
    console.log("----- Named Function Output -----");
    console.log(add(5, 3)); // Output: 8

    // Function with Rest Parameters: A function that can accept an indefinite number of arguments as an array.
    // Syntax:
    //  function functionName(...parameters): returnType { // function body }

    // Example:
    function sum(...numbers: number[]): number {
        return numbers.reduce((total, num) => total + num, 0); // Use reduce to sum all numbers in the array
    }
    console.log("----- Function with Rest Parameters Output -----");
    console.log(sum(10, 20, 30, 40, 50)); // Output: 15 (the sum of the numbers 1, 2, 3, 4, and 5 is 15)
    console.log(sum(10, 20)); // Output: 30 (the sum of the numbers 10 and 20 is 30)
    console.log(sum()); // Output: 0 (the sum of an empty array is 0)
    console.log(sum(5)); // Output: 5 (the sum of a single number is the number itself)

    // Example:
    function findElements(...elements: (number[] | string[])): any {
        elements.length; // Access the length of the elements array
        return elements; // Return the array of elements
    }
    console.log(5, 10, 15, "Mandy", "John", 3.15, 45.66); // Output: [5, 10, 15, "Mandy", "John", 3.15, 45.66] (the function accepts a variable number of arguments and returns them as an array)
    console.log(5, 10, 15, 3.15, 45.66);    // Output: [5, 10, 15, 3.15, 45.66] (the function accepts a variable number of arguments and returns them as an array)
    console.log("Mandy", "John"); // Output: ["Mandy", "John"] (the function accepts a variable number of arguments and returns them as an array)
    console.log(); // Output: [] (the function accepts a variable number of arguments and returns an empty array when no arguments are provided)

    // Function with Optional Parameters: A function that can have parameters that are not required when calling the function.
    // Syntax:
    //  function functionName(parameters, optionalParameter?: type): returnType { // function body }
    
    // Example:
    function greetPerson(name: string, greeting?: string): string {
        if (greeting) {
            return greeting + ", " + name; // If a greeting is provided, use it in the return message
        } else {
            return "Hello, " + name; // If no greeting is provided, use a default greeting
        }
    }
    console.log("----- Function with Optional Parameters Output -----");
    console.log(greetPerson("Bob")); // Output: Hello, Bob (the optional greeting parameter is not provided, so the default greeting is used)
    console.log(greetPerson("Bob", "Hi")); // Output: Hi, Bob (the optional greeting parameter is provided, so it is used in the return message)

    // Example:
    function displayDetails(id?:number, name?:string, mailid?:string): void {
        console.log("ID:", id, ", Name:", name, ", Mail ID:", mailid); // Output: ID: 1 Name: Alice Mail ID:
    }
    console.log("----- Function with Optional Parameters Output -----");
    displayDetails(1, "Alice", "tset@test.com"); // Output: ID: 1 Name: Alice Mail ID:
    displayDetails(2, "Bob"); // Output: ID: 2 Name: Bob Mail ID: undefined (the optional mailid parameter is not provided, so it is undefined)
    displayDetails(3); // Output: ID: 3 Name: undefined Mail ID: undefined (the optional name and mailid parameters are not provided, so they are undefined)
    displayDetails(); // Output: ID: undefined Name: undefined Mail ID: undefined (all parameters are optional, so they are all undefined when no arguments are provided)
    displayDetails(undefined, "Charlie"); // Output: ID: undefined Name: Charlie Mail ID: undefined (the optional id and mailid parameters are not provided, so they are undefined)
    displayDetails(undefined); // Output: ID: undefined Name: undefined Mail ID: undefined (the optional id and name parameters are not provided, so they are undefined)

    // Function with Default Parameters: A function that can have parameters with default values that are used when the parameter is not provided when calling the function.
    // Syntax:
    //  function functionName(parameters, defaultParameter: type = defaultValue): returnType { // function body }

    // Example:
    function greetWithDefault(name: string, greeting: string = "Hello"): string {
        return greeting + ", " + name; // Use the provided greeting or the default greeting in the return message
    }
    console.log("----- Function with Default Parameters Output -----");
    console.log(greetWithDefault("Charlie")); // Output: Hello, Charlie (the default greeting is used because the greeting parameter is not provided)
    console.log(greetWithDefault("Charlie", "Hi")); // Output: Hi, Charlie (the provided greeting is used instead of the default greeting)

    // Example:
    function calculateDiscount(price: number, discount: number = 20): number {
        return price - (price * discount / 100); // Calculate the discounted price using the provided discount or the default discount
    }
    console.log(calculateDiscount(100)); // Output: 80 (the default discount of 20% is applied to the price of 100)
    console.log(calculateDiscount(100, 10)); // Output: 90 (the provided discount of 10% is applied to the price of 100)    

// 2. Anonymous Function: A function that does not have a name and is often assigned to a variable acts as function name.
// Syntax:
//  let variableName = function(parameters): returnType { // function body }

    // Example:
    let mesg = function():string {
        return "Hello TyepScript";
    }
    console.log("----- Anonymous Function Output -----");
    console.log(mesg()); // Output: Hello TyepScript

    // Example:
    let multiply = function(a: number, b: number): number {
        return a * b;
    };
    console.log(multiply(5, 3)); // Output: 15

// 3. Arrow Function: A concise syntax for writing functions using the "=>" syntax.
// Syntax:
//  let variableName = (parameters): returnType => { // function body }

    // Example:
    let greetArrow = (): void => {    
        console.log("Hello, Dave");
    }
    console.log("----- Arrow Function Output -----");
    greetArrow(); // Output: Hello, Dave

    // Example:
    let divide = (a: number, b: number): number => {
        return a / b;
    };
    console.log(divide(10, 2)); // Output: 5

// Arrow function with optional parameters parameters
    // Example:
    let displayInfo = (id?: number, name?: string, mailId?:string): void => {
        console.log("ID:", id, ", Name:", name, ", Email:", mailId); 
    }
    console.log("----- Arrow Function with Optional Parameters Output -----");
    displayInfo(1, "Alice", "test@test.com"); // Output: ID: 1 , Name: Alice , Email:test@test.com
    displayInfo(2, "Bob"); // Output: ID: 2 , Name: Bob , Email:undefined (the optional mailId parameter is not provided, so it is undefined)
    displayInfo(3); // Output: ID: 3 , Name: undefined , Email:undefined (the optional name and mailId parameters are not provided, so they are undefined)
    displayInfo(); // Output: ID: undefined , Name: undefined , Email:undefined (all parameters are optional, so they are all undefined when no arguments are provided)
    displayInfo(undefined, "Charlie"); // Output: ID: undefined , Name: Charlie , Email:undefined (the optional id and mailId parameters are not provided, so they are undefined)
    displayInfo(undefined); // Output: ID: undefined , Name: undefined , Email:undefined (the optional id and name parameters are not provided, so they are undefined)  

// Arrow function with optional default parameters
    // Example:
    let discountPrice = (price: number, rate: number = 0.20): void => {
        let discountedPrice = price - (price * rate); // Calculate the discounted price using the provided rate or the default rate
        console.log("Discounted Price:", discountedPrice); // Output: Discounted Price: 80 (the default discount rate of 20% is applied to the price of 100)
    };
    console.log("----- Arrow Function with Default Parameters Output -----");
    discountPrice(100); // Output: Discounted Price: 80 (the default discount rate of 20% is applied to the price of 100)
    discountPrice(100, 0.10); // Output: Discounted Price: 90 (the provided discount rate of 10% is applied to the price of 100)

    // Example:
    let greetPersonArrow = (name: string, greeting: string = "Hello"): string => {
        return greeting + ", " + name; // Use the provided greeting or the default greeting in the return message
    };
    console.log(greetPersonArrow("Eve")); // Output: Hello, Eve (the default greeting is used because the greeting parameter is not provided)
    console.log(greetPersonArrow("Eve", "Hi")); // Output: Hi, Eve (the provided greeting is used instead of the default greeting)

// Arrow function with rest parameters
    // Example:
    let sumArrow = (...nums: (number | string)[]): number => {
        return nums.length; // Return the number of arguments passed to the function
    };
    console.log("----- Arrow Function with Rest Parameters Output -----");
    console.log(sumArrow(1, 2, 3, 4, 5)); // Output: 5 (the function counts the number of arguments passed to it, which is 5)
    console.log(sumArrow("a", "b", "c")); // Output: 3 (the function counts the number of arguments passed to it, which is 3)
    console.log(sumArrow()); // Output: 0 (the function counts the number of arguments passed to it, which is 0 when no arguments are provided)
    console.log(sumArrow(10, "hello", 3.45)); // Output: 3 (the function counts the number of arguments passed to it, which is 3 regardless of their types)

// 4. lambda Function: A function that is defined without a name and is often used as an argument to higher-order functions. 
// Syntax:
//  (parameters): returnType => { // function body }

    // Example: 
    let numbers: number[] = [1, 2, 3, 4, 5];
    let squaredNumbers: number[] = numbers.map(x => x * x);
    console.log("----- Lambda Function Output -----");
    console.log(squaredNumbers); // Output: [1, 4, 9, 16, 25] (each element in the numbers array is squared using the lambda function x => x * x)

// 5. Recursive Function: A function that calls itself in order to solve a problem.
// Syntax:
//  function functionName(parameters): returnType { // base case if (condition) { return value; } // recursive case return expression involving functionName(parameters); }

    // Example:
    function factorial(n: number): number {
        if (n === 0) {
            return 1; // Base case: factorial of 0 is 1
        } else {
            return n * factorial(n - 1); // Recursive case: n! = n * (n-1)!
        }
    }
    console.log("----- Recursive Function Output -----");
    console.log(factorial(5)); // Output: 120 (5! = 5 * 4 * 3 * 2 * 1 = 120)



// 6. Generator Function: A function that can be paused and resumed, allowing it to generate a sequence of values over time.
// Syntax:
//  function* functionName(parameters): Generator<yieldType, returnType, nextType> { // function body }

    // Example:
    function* fibonacciGenerator(): Generator<number, void, unknown> {
        let a = 0, b = 1;
        while (true) {
            yield a; // Yield the current value of a
            [a, b] = [b, a + b]; // Update a and b to the next two numbers in the Fibonacci sequence
        }
    }

    const fibGen = fibonacciGenerator();
    console.log("----- Fibonacci Generator Output -----");
    console.log(fibGen.next().value); // Output: 0 (the first value generated by the Fibonacci generator is 0)
    console.log(fibGen.next().value); // Output: 1 (the second value generated by the Fibonacci generator is 1)
    console.log(fibGen.next().value); // Output: 1 (the third value generated by the Fibonacci generator is 1)
    console.log(fibGen.next().value); // Output: 2 (the fourth value generated by the Fibonacci generator is 2)
    console.log(fibGen.next().value); // Output: 3 (the fifth value generated by the Fibonacci generator is 3)     
    console.log(fibGen.next().value); // Output: 5 (the fifth value generated by the Fibonacci generator is 5) 

// callback function: A function that is passed as an argument to another function and is executed after some operation is completed.
    // Example:
    // function that takes callback function as an parameter
    function greetcallback(name: string, callback:(message:string)  => void): void {
        const message = "Hello, " + name; // Create a greeting message using the provided name
        callback("Welcome to callback TypeScript!"); // Call the callback function with the greeting message
    }
    console.log("----- Callback Function Output -----");
    function showMessage(message: string): void {
        console.log("Message:", message); 
    }
    showMessage("Welcome to TypeScript!"); // Output: Message: Welcome to TypeScript! (the showMessage function is called with the message "Welcome to TypeScript!")
    greetcallback("Alice", showMessage); 

    // Example:
    function fetchData(callback: (data: string) => void): void {
        setTimeout(() => {
            const data = "Data fetched from server";
            callback(data); // Call the callback function with the fetched data
        }, 1000); // Simulate a delay of 1 seconds
    }
    fetchData((data: string) => {   
        console.log(data); // Output: Data fetched from server (the callback function is called with the fetched data after a delay of 2 seconds)
    });

// overloaded function: A function that has multiple signatures, allowing it to be called with different sets of parameters.
    // Example:
    function getInformation(id: number): string;
    function getInformation(name: string): string;

    function getInformation(value: number | string): string {
        if (typeof value === "number") {
            return `ID: ${value}`; // If the value is a number, return it as an ID
        } else if (typeof value === "string") {
            return `Name: ${value}`; // If the value is a string, return it as a Name
        } else {
            return `Invalid input ${value}`; // If the value is neither a number nor a string, return an error message
        }
    }
    console.log(" ");
    console.log("----- Overloaded Function Output -----");
    console.log(getInformation(123));
    console.log(getInformation("Alice"));

    // Example:
    function addition(a: number, b: number): number;
    function addition(a: number, b: number, c: number): number;

    function addition(a: number, b:number, c?:number): number {
        if (c !== undefined) {
            return a + b + c; // If the third parameter is provided, return the sum of all three numbers
        } 
        return a + b; // If the third parameter is not provided, return the sum of the first two numbers
    }
    console.log(addition(5, 10)); // Output: 15 (the addition function is called with two parameters, so it returns the sum of those two numbers)
    console.log(addition(5, 10, 15)); // Output: 30 (the addition function is called with three parameters, so it returns the sum of all three numbers)
    
    // Example:
    function processInput(input:string): string;
    function processInput(input:number): number;

    function processInput(input: string | number): string | number {
        if (typeof input === "string") {
            return `Processed string: ${input}`; // If the input is a string, return a processed string message
        } else if (typeof input === "number") {
            return input * 2; // If the input is a number, return the number multiplied by 2
        } else {
            return `Invalid input: ${input}`; // If the input is neither a string nor a number, return an error message
        }
    }
    console.log(processInput("Hello")); // Output: Processed string: Hello (the processInput function is called with a string, so it returns a processed string message)
    console.log(processInput(10)); // Output: 20 (the processInput function is called with a number, so it returns the number multiplied by 2)
    console.log(processInput(true)); // Output: Invalid input: true (the processInput function is called with a boolean, which is not a valid input, so it returns an error message)

    // Example:
    function greetInfo(name: string): string;
    function greetInfo(age: number): string;
    function greetInfo(isMarried: boolean): string;

    function greetInfo(value: string | number | boolean): string {
        if (typeof value === "string") {
            return `Hello, ${value}`; // If the value is a string, return a greeting message with the name
        } else if (typeof value === "number") {
            return `You are ${value} years old`; // If the value is a number, return a message with the age
        } else if (typeof value === "boolean") {
            return value ? "You are married" : "You are not married"; // If the value is a boolean, return a message indicating marital status
        } else {
            return `Invalid input: ${value}`; // If the value is none of the expected types, return an error message
        }
    }
    console.log(greetInfo("Alice"));
    console.log(greetInfo(30));
    console.log(greetInfo(true));
    console.log(greetInfo(false));
    console.log(greetInfo(undefined)); // Output: Invalid input: undefined (the greetInfo function is called with an undefined value, which is not a valid input, so it returns an error message)

    // Example:
    function display(value: string): void;
    function display(value: number): void;

    function display(value: any): void {
        console.log("Value:", value); // Output: Value: Hello (the display function can be called with either a string or a number, and it will log the value to the console)
    }
    display("Hello"); // Output: Value: Hello (the display function is called with a string argument)
    display(123); // Output: Value: 123 (the display function is called with a number argument)
