// String: A string is a sequence of characters used to represent text. 
// In TypeScript, strings are defined using either single quotes (' '), double quotes (" "), or backticks (` `) for template literals.

// Example of string declaration
    let greeting: string = "Hello, World!";
    let uname: string = 'Alice';
    let message: string = `Welcome, ${uname}!`;

    console.log(greeting); // Output: Hello, World!
    console.log(uname); // Output: Alice
    console.log(message); // Output: Welcome, Alice!

// String concatenation
    let fullName: string = uname + " Smith";
    let welcomeMessage: string = greeting + " " + uname;

    console.log(fullName); // Output: Alice Smith
    console.log(welcomeMessage); // Output: Hello, World! Alice

// use of backticks for template literals
    let templateLiteralMessage: string = `Hello, ${uname}! Welcome to TypeScript.`;
    console.log(templateLiteralMessage); // Output: Hello, Alice! Welcome to TypeScript.

// String methods
// 1. length: Returns the length of the string  
    let lengthOfGreeting: number = greeting.length;
    console.log(`Length of greeting: ${lengthOfGreeting}`); // Output: Length of greeting: 13

// 2. toUpperCase() and toLowerCase(): Convert the string to upper or lower case
    let upperCaseGreeting: string = greeting.toUpperCase();
    console.log(`Upper case greeting: ${upperCaseGreeting}`); // Output: Upper case greeting: HELLO, WORLD!

    let lowerCaseGreeting: string = greeting.toLowerCase();
    console.log(`Lower case greeting: ${lowerCaseGreeting}`); // Output: Lower case greeting: hello, world!

//3. charAt(): Returns the character at a specified index
    let charAtIndex3: string = greeting.charAt(3);
    console.log(`Character at index 3: ${charAtIndex3}`); // Output: Character at index 3: l

// 4. indexOf(): Returns the index of the first occurrence of a specified substring
    let indexOfO: number = greeting.indexOf("o");
    console.log(`Index of 'o': ${indexOfO}`); // Output: Index of 'o': 4

// 5. substring(): Extracts a substring from the string based on specified indices
    let substringGreeting: string = greeting.substring(1, 5); // "Hello, World!" -> "ello"
    console.log(`Substring of greeting: ${substringGreeting}`); // Output: Substring of greeting: ello

// 6. includes(): Checks if a substring is present in the string
    let includesWorld: boolean = greeting.includes("World");
    console.log(`Does the greeting include 'World'? ${includesWorld}`); // Output: Does the greeting include 'World'? true

// 7. startsWith() and endsWith(): Check if the string starts or ends with a specified substring
    let startsWithHello: boolean = greeting.startsWith("Hello");
    console.log(`Does the greeting start with 'Hello'? ${startsWithHello}`); // Output: Does the greeting start with 'Hello'? true

    let endsWithExclamation: boolean = greeting.endsWith("!");
    console.log(`Does the greeting end with '!'? ${endsWithExclamation}`); // Output: Does the greeting end with '!'? true

// 8. replace(): Replaces a specified value with another value in the string
    let replacedGreeting: string = greeting.replace("World", "TypeScript");
    console.log(`Replaced greeting: ${replacedGreeting}`); // Output: Replaced greeting: Hello, TypeScript!

// 9. split(): Splits the string into an array of substrings based on a specified separator
    let splitGreeting: string[] = greeting.split(", ");
    console.log("Split greeting:", splitGreeting); // Output: Split greeting: Hello,World!

// 10. trim(): Removes whitespace from both ends of the string
    let stringWithWhitespace: string = "   Hello, World!   ";
    let trimmedString: string = stringWithWhitespace.trim();
    console.log("Untrimmed string:", stringWithWhitespace); // Output: Untrimmed string: '   Hello, World!   '
    console.log(`Trimmed string: '${trimmedString}'`); // Output: Trimmed string: 'Hello, World!'

// 11. concat(): Concatenates two or more strings and returns a new string
    let concatenatedString: string = greeting.concat(" ", uname);
    console.log("Concatenated string:", concatenatedString); // Output: Concatenated string: Hello, World! Alice

// 11. slice(): Extracts a section of the string and returns it as a new string
    let slicedGreeting: string = greeting.slice(0, 5); // "Hello, World!" -> "Hello"
    console.log(`Sliced greeting: ${slicedGreeting}`); // Output: Sliced greeting: Hello

// Template literals allow for multi-line strings and embedded expressions
    let multiLineString: string = `This is a
    multi-line string.`;
    let embeddedExpression: string = `The length of the greeting is ${greeting.length}.`;
    console.log(multiLineString); // Output: This is a
    // multi-line string.
    console.log(embeddedExpression); // Output: The length of the greeting is 13.   

// String interpolation with template literals
    let age: number = 30;
    let interpolatedString: string = `My name is ${uname} and I am ${age} years old.`;
    console.log(interpolatedString); // Output: My name is Alice and I am 30 years old.