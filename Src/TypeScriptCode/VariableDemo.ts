// Variable: is a container that holds data. It is a named storage location in memory that can hold a value of a specific type. 
// Variables are used to store and manipulate data in a program. 
// They can be declared using the var, let, or const keywords in TypeScript.

// Syntax: Keyword variableName: dataType = value;

// Example:
let personName: string = "John";
let age: number = 30;
let isStudent: boolean = true;

//declare without datatype
let country = "USA";

// declare with var keyword
var city: string = "New York";

//declare without datatype without var keyword
var state = "California";

// declare with const keyword   
const pi: number = 3.14;

// declare without datatype with const keyword
const gravity = 9.8;

// Example of using variables:
console.log("Name: " + personName);
console.log("Age: " + age);
console.log("Is Student: " + isStudent);
console.log("Country: " + country);
console.log("City: " + city);
console.log("State: " + state);
console.log("Pi: " + pi);
console.log("Gravity: " + gravity);

// run command to execute: tsx Day2/VariableDemo.ts

// what is the difference between var, let and const keywords in TypeScript?
// var: is function-scoped and can be redeclared and updated. It is hoisted to the top of its scope.
// let: is block-scoped and can be updated but not redeclared. It is not hoisted.
// const: is block-scoped and cannot be updated or redeclared. It must be initialized at the time of declaration. It is not hoisted.    

 /*
 var:   we don't use var in modern JS/TS. avoid var because of its function-scoped nature which can lead to unexpected behavior. Instead, use let and const for better readability and maintainability.
        var is function-scoped, let and const are block-scoped.

let:    is block-scoped, meaning it is only accessible within the block it is defined in (e.g., inside a loop or an if statement). use let when you need to reassign a variable's value.

const:  is also block-scoped, but it cannot be reassigned after its initial assignment. use const when you want to declare a variable that should not be reassigned, such as a constant value 
            or an object that should not be modified.
*/

// 1. Scope:
//     Accessibility of variables in different parts of the code. var is function-scoped, while let and const are block-scoped. 

    // var example: 
        function varScope() {
            if (true) {
                var msg = "Hello, var World!";
                console.log(msg); // Output: Hello, World!
            }
            console.log(msg); // Output: Hello, World! (var is function-scoped, so it is accessible outside the block)
        }
    
        varScope();
    
    // let example:
        function letScope() {
            if (true) { 
                let msg = "Hello, let World!";
                console.log(msg); // Output: Hello, let World!
            }
            // console.log(msg); // Error: msg is not defined (let is block-scoped, so it is not accessible outside the block)
        }

        letScope();

    // const example:
        function constScope() {
            if (true) {
                const msg = "Hello, const World!";
                console.log(msg); // Output: Hello, const World!
            }
            // console.log(msg); // Error: msg is not defined (const is block-scoped, so it is not accessible outside the block)
        }

        constScope();

    // var, let, const example:
        function variableScope() {
            if (true) {
                var num1 = 10;
                let num2 = 20;
                const num3 = 30;

                console.log(num1); // Output: 10
                console.log(num2); // Output: 20
                console.log(num3); // Output: 30
            }
            console.log(num1); // Output: 10 (var is function-scoped, so it is accessible outside the block)
            // console.log(num2); // Error: num2 is not defined (let is block-scoped, so it is not accessible outside the block)
            // console.log(num3); // Error: num3 is not defined (const is block-scoped, so it is not accessible outside the block)
        }

        variableScope();
           
// 2. Declaration/Value Assignment:
    // var:     var can be declared without initialization, and its value can be reassigned later.

    // var example:
        var x;
        console.log(x); // Output: undefined (var can be declared without initialization)
        x = 30;
        console.log(x); // Output: 30 (var can be reassigned)

        var message = "Hello, var!";
        console.log(message); // Output: Hello, var! (var can be reassigned)

        var message: string = "Hello, var World!";
        console.log(message); // Output: Hello, var World!  

    // let:     let can be declared without initialization, but must be initialized before use. Its value can be reassigned later.

    // let example:
        let y;
        console.log(y); // Output: undefined (let can be declared without initialization)
        y = 40;
        console.log(y); // Output: 40 (let can be reassigned)

        let greet = "Hi, let there!";
        console.log(greet); // Output: Hi, let there!

        let greeting: string = "Hi, let value there!";
        console.log(greeting); // Output: Hi, let value there!

    // const:   const must be initialized at the time of declaration, and its value cannot be reassigned later.

    // const example:
        // const z; // Error: const declarations must be initialized (const must be initialized at the time of declaration)

        const z = 50;
        console.log(z); // Output: 50 (const must be initialized at the time of declaration)

        // z = 60; // Error: Assignment to constant variable. (const cannot be reassigned)

        const value = 9.8;
        console.log(value); // Output: 9.8

        const piValue: number = 3.14;
        console.log(piValue); // Output: 3.14

// 3. Redeclaration:
    // var:     var can be redeclared and updated within its scope.

    // var example:
        var city = "New York";
        var city = "Los Angeles"; // Redeclaration of var is allowed
        console.log(city); // Output: Los Angeles (var can be redeclared and updated)

    // let:     let cannot be redeclared within the same scope, but its value can be updated.

    // let example:
        let fruit = "Apple";
        // let fruit = "Banana"; // Error: Identifier 'fruit' has already been declared (let cannot be redeclared within the same scope)
        fruit = "Banana";
        console.log(fruit); // Output: Banana (let can be updated)

    // const:   const cannot be redeclared or updated within the same scope.

    // const example:
        const color = "Red";
        // const color = "Blue"; // Error: Identifier 'color' has already been declared (const cannot be redeclared within the same scope)
        // color = "Blue"; // Error: Assignment to constant variable. (const cannot be updated)
        console.log(color); // Output: Red (const cannot be redeclared or updated)

// 4. Re-initialization/Re-assignment:]
    // var:     var can be re-initialized and reassigned.

    // var example:
        var count = 1;
        count = 2; // Re-assignment of var is allowed
        count = 3; // Re-initialization of var is allowed
        count = 4; // Re-assignment of var is allowed
        console.log(count); // Output: 2 (var can be re-assigned)

    // let:     let can be reassigned but not re-initialized.

    // let example:
        let score = 10;
        score = 20; // Re-assignment of let is allowed
        score = 30; // Re-assignment of let is allowed
        score = 40; // Re-assignment of let is allowed
        console.log(score); // Output: 20 (let can be re-assigned)

    // const:   const cannot be reassigned or re-initialized.

    // const example:
        const maxScore = 100;
        // maxScore = 200; // Error: Assignment to constant variable. (const cannot be re-assigned)
        console.log(maxScore); // Output: 100 (const cannot be re-assigned)

// 5. Hoisting:
    // var:     var declarations are hoisted to the top of their scope and initialized with undefined.

    // var example:
        console.log(hoistedVar); // Output: undefined (var declarations are hoisted and initialized with undefined)
        var hoistedVar = "I am var hoisted!";
        console.log(hoistedVar); // Output: I am var hoisted!

    // let:     let declarations are hoisted to the top of their block scope but are not initialized.

    // let example:
        // console.log(hoistedLet); // Error: Cannot access 'hoistedLet' before initialization (let declarations are hoisted but not initialized)
        let hoistedLet = "I am let hoisted!";
        console.log(hoistedLet); // Output: I am let hoisted!

    // const:   const declarations are hoisted to the top of their block scope but are not initialized.

    // const example:
        // console.log(hoistedConst); // Error: Cannot access 'hoistedConst' before initialization (const declarations are hoisted but not initialized)
        const hoistedConst = "I am const hoisted!";
        console.log(hoistedConst); // Output: I am const hoisted!
