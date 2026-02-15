// Typescript is a statically typed superset of JavaScript that adds optional types, classes, interfaces, and other features to JavaScript. 
// It provides type safety and helps catch errors during development. TypeScript code is transpiled to JavaScript, which can run in any environment that supports JavaScript.
let data = 10;
data = "Ten"; 
console.log(data); // Output: Ten (TypeScript allows dynamic typing, but it is recommended to use static types for better code quality and maintainability)

let data1: number = 10;
// data1 = "Ten"; // Error: Type 'string' is not assignable to type 'number'. (TypeScript enforces static typing, so you cannot assign a string to a variable declared as a number)
console.log(data1); // Output: 10

// Type safety is a key feature of TypeScript, which helps catch errors at compile time and improves code quality. 
// By using static types, developers can catch type-related errors early in the development process, leading to more robust and maintainable code.
let num1: string = "10";
let num2: number = 20;

let result = num1 + num2;
console.log(result); // Output: 1020 (TypeScript allows concatenation of a string and a number, but it is recommended to use explicit type conversions to avoid unexpected results)

let num3: number = 10;
let num4: number = 20;

let result1 = num3 + num4;
console.log(result1); // Output: 30 (TypeScript ensures that both num1 and num2 are of type number, allowing for safe arithmetic operations)


/* 
Datatypes in TypeScript:
1. Primitive Types (Built-in types):
    - number: represents numeric values. Example: let age: number = 30;
    - string: represents textual data. Example: let name: string = "John";
    - boolean: represents true or false values. Example: let isStudent: boolean = true;
    - null: represents the absence of a value. Example: let emptyValue: null = null;
    - undefined: represents an uninitialized variable. Example: let uninitializedValue: undefined = undefined;
    - any: represents any type of value. Example: let randomValue: any = "Hello";
    - union: represents a value that can be of multiple types. Example: let value: string | number = "Hello";
    - void: represents the absence of a value. Example: function greet(): void { console.log("Hello!"); }
    - symbol: represents a unique identifier. Example: let uniqueId: symbol = Symbol("id");
    - literal types: represents a specific value. Example: let direction: "up" | "down" | "left" | "right" = "up";

2. Non Primitive Types (Object):
    - object: represents a non-primitive type that can hold multiple values. Example: let person: object = { name: "John", age: 30 };
    - array: represents a collection of values of the same type. Example: let numbers: number[] = [1, 2, 3];
    - class: represents a blueprint for creating objects with properties and methods. 
        Example: class Person { name: string; age: number; constructor(name: string, age: number) { this.name = name; this.age = age; }}
    - interface: represents a contract for the shape of an object. Example: interface Person { name: string; age: number; }
    - function: represents a reusable block of code that performs a specific task. Example: function greet(name: string): string { return "Hello, " + name; }
    - tuple: represents an array with a fixed number of elements of different types. Example: let personInfo: [string, number] = ["John", 30];
    - enum: represents a set of named constants. Example: enum Color { Red, Green, Blue };
    - never: represents a value that never occurs. Example: function throwError(): never { throw new Error("An error occurred"); }
*/

// 1. Primitive Types: 
// number type: represents both integer and floating-point numbers. Example: let age: number = 30;
        let age1: number = 30;
        let price = 25.50;
        let bigNumber = 858454857485;
        let bigNumber1: bigint = 9007199254740991n; // BigInt literal with 'n' suffix
        console.log("Age:", age1); // Output: 30
        console.log("Price:", price); // Output: 25.5
        console.log("Big Number:", bigNumber); // Output: 9007199254740991n    
        console.log("Big Int Number:", bigNumber1); // Output: 9007199254740991n (BigInt can handle larger integers than number type)

        console.log(typeof age1); // Output: number
        console.log(typeof price); // Output: number
        console.log(typeof bigNumber); // Output: number
        console.log(typeof bigNumber1); // Output: bigint (BigInt is a separate type from number in TypeScript)

// 2. string type: represents textual data. we can use ' ', " ", and ` `. Example: let name: string = "John";
        let firstName: string = "John";
        let lastnmae:string = 'Kennedy';

        console.log("Hello, ", firstName, lastnmae, "!"); // Output: Hello, John Kennedy !
        console.log("Hello, " + firstName + " " + lastnmae + "!"); // Output: Hello, John Kennedy! (String concatenation)
                
        let msg: string = `Hello, ${firstName} ${lastnmae}!`; // Template literal with interpolation
        console.log(msg); // Output: Hello, John Kennedy!

// 3. boolean type: represents true or false values. Example: let isStudent: boolean = true;
        let isStudnt: boolean = true;
        let isEmployed: boolean = false;

        console.log("Is Student??", isStudnt); // Output: Is Student?? true
        console.log("Is Employed??", isEmployed); // Output: Is Employed?? false

// 4. null type: represents the absence of a value. Example: let emptyValue: null = null;
        let emptyValue: null = null;
        console.log("Empty Value:", emptyValue); // Output: Empty Value: null

// 5. undefind type: represents an uninitialized variable. Example: let uninitializedValue: undefined = undefined;
        let uninitializedValue: undefined = undefined;
        console.log("Uninitialized Value:", uninitializedValue); // Output: Uninitialized Value: undefined

        let priceTag: number | undefined;
        console.log("Price Tag:", priceTag); // Output: Price Tag: undefined (uninitialized variable has the value undefined)
        
// 6. any type: represents any type of value. Example: let randomValue: any = "Hello";
        let randomValue: any = "Hello";
        console.log(typeof randomValue); // Output: string (the current type of randomValue is string)
        randomValue = 123; // any type can hold any type of value
        console.log(typeof randomValue); // Output: number (the current type of randomValue is number)
        randomValue = true; // any type can hold any type of value
        console.log("Random Value:", randomValue); // Output: Random Value: true
        console.log(typeof randomValue); // Output: boolean (the current type of randomValue is boolean)

// 7. union type: represents a value that can be of multiple types. Example: let value: string | number = "Hello";
        let id: string | number | boolean;

        id = "12345"; // id can be a string
        console.log("ID:", id); // Output: ID: 12345

        id = 12345; // id can be a number
        console.log("ID:", id); // Output: ID: 12345

        id = true; // id can be a boolean
        console.log("ID:", id); // Output: ID: true\

// 8. void type: represents the absence of a value. Example: function greet(): void { console.log("Hello!"); }
        function show(): void {
            console.log("Weclome"); // Output: Weclome (the function does not return any value, so the return type is void)
        }
        console.log("message is:", show()); // Output: Sum: undefined (the function does not return any value, so it returns undefined by default)

        function sum1(): number {
            return (10 + 20); // Output: 30
        }
       
        console.log("Sum1:", sum1()); // Output: Sum1: 30 (the function returns a number, so the return type is number, not void)

        function sum(x: number, y: number): number {
            return (x + y); // Output: 30
        }

        let sumResult: number = sum(10, 20);
        console.log("Sum:", sumResult); // Output: Sum: 30 (the function takes two numbers as parameters and returns their sum, so the return type is number, not void)

// 9. symbol type: represents a unique identifier. Example: let uniqueId: symbol = Symbol("id");
        let uniqueId: symbol = Symbol("id");
        console.log("Unique ID:", uniqueId); // Output: Unique ID: Symbol(id)
        console.log(typeof uniqueId); // Output: symbol (the type of uniqueId is symbol)