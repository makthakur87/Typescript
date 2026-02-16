// Tuple: is a fixed length array where each element can have a different type.
// Tuples are declared using square brackets [] and specifying the type of each element in the tuple.
// It helps to represent a collection of values of different types as a single unit.

// Example:
    // Declaration - Tuples with 3 elements
    let person: [string, number, boolean] = ["Alice", 30, true];

    // Accessing tuple elements
    console.log(person[0]); // Output: Alice
    console.log(person[1]); // Output: 30
    console.log(person[2]); // Output: true
    console.log(person);    // Output: ["Alice", 30, true]

// Tuple with multiple values
    let user: [number, string, boolean, number, string] = [1, "John", true, 25, "Smith"];
    console.log(user); // Output: [1, "John", true, 25, "Smith"]

// Iterating over tuple using traditional for loop
    console.log("Iterating over tuple using ... for loop:");
    for (let i = 0; i < user.length; i++) {
        console.log(user[i]); // Output: 1    John    true    25    Smith
    }

// Iterating over tuple using for...in loop
    console.log("Iterating over tuple using for...in loop:");
    for (let index in user) {   // index is the index of the element in the tuple
        console.log(user[index]); // Output: 1    John    true    25    Smith
    }

// Iterating over tuple using for...of loop
    console.log("Iterating over tuple using for...of loop:");
    for (let element of user) { // element is the value of the element in the tuple
        console.log(element); // Output: 1    John    true    25    Smith
    }

// Tuple wiht optional elements
    let employee: [number, string, boolean?] = [101, "David"];
    console.log("tuple with optional elements:");
    console.log(employee); // Output: [101, "David"]

// Tuple Array: An array of tuples is a collection of tuples where each tuple can have different types of elements. 
// It is declared using square brackets [] and specifying the type of each element in the tuple.
    // Example:
    let students: [number, string, boolean][] = [
        [1, "Alice", true],
        [2, "Bob", false],
        [3, "Charlie", true]
    ];
    console.log("Tuple Array:");
    console.log(`lentgh: ${students.length}`); // Output: 3   
    console.log(students[0]); // Output: [1, "Alice", true]
    console.log(students); // Output: [[1, "Alice", true], [2, "Bob", false], [3, "Charlie", true]]

    // Example:
    let employees: [number, string, boolean][] = [
        [101, "David", true],
        [102, "Eve", false],
        [103, "Frank", true]
    ];
    console.log("Tuple Array:");
    console.log(`lentgh: ${employees.length}`); // Output: 3
    console.log(employees[2]); // Output: [101, "David", true]
    console.log(employees); // Output: [[101, "David", true], [102, "Eve", false], [103, "Frank", true]]