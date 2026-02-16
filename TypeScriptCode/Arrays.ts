// Arrays: An array is a data structure that can hold a fixed number of values of the same type.
// Array is a special type of variable that stores multiple values.
// The values can be of same type or different data types.
// Arrays are declared using square brackets [] or generic 'Array<T>' type

// Example:
// Using square brackets
    // Declaration
    let numbers: number[] = [];
    let names: string[] = [];

    // Initialization/assignment
    numbers = [6, 7, 8, 9, 10]; 
    names = ["David", "Eve", "Frank"];
    
    console.log(numbers); // Output: [6, 7, 8, 9, 10]
    console.log(names); // Output: ["David", "Eve", "Frank"]

    // Declaration/Assingnment
    let numbers1: number[] = [1, 2, 3, 4, 5];
    let names1: string[] = ["Alice", "Bob", "Charlie"];

    console.log(numbers1); // Output: [1, 2, 3, 4, 5]
    console.log(names1); // Output: ["Alice", "Bob", "Charlie"]

// Using generic 'Array<T>' type
    let fruits: Array<string> = ["Apple", "Banana", "Cherry"];
    let numData: Array<number> = [1, 2, 3, 4, 5];
    let strData: Array<string> = ["Hello", "World"];
    let data: Array<string | number> = ["John", 101, "Smith", 102, "Peter", 103, "Scott", 104];
    let mixedData: Array<any> = ["John", 101, true, "Smith", 102, false, "Peter", 103, null, undefined];

// Accessing array elements
    console.log(numbers[0]); // Output: 6
    console.log(names[1]);   // Output: Eve
    console.log(fruits[2]);  // Output: Cherry
    console.log(fruits);    // Output: ["Apple", "Banana", "Cherry"]
    console.log(numData);   // Output: [1, 2, 3, 4, 5]
    console.log(strData);   // Output: ["Hello", "World"]
    console.log(data);      // Output: ["John", 101, "Smith", 102, "Peter", 103, "Scott"] 
    console.log(mixedData); // Output: ["John", 101, true, "Smith", 102, false, "Peter", 103, null, undefined]

// Iterating over arrays using traditional for loop
    console.log("");
    console.log("Iterating over array using ... for loop:");
    console.log(`total elments: ${fruits.length}`); // Output: 3
    for (let i = 0; i < fruits.length; i++) {
        console.log(fruits[i]);  // Output: Apple    Banana    Cherry
    }
    
// Iterating over arrays using for...in loop
    console.log("Iterating over array using for...in loop:");
    for (let index in data) {   // index is the index of the element in the array
        console.log(data[index]); // Output: John    101    Smith    102    Peter    103    Scott
    }

// Iterating over arrays using for...of loop
    console.log("Iterating over array using for...of loop:");
    for (let element of mixedData) { // element is the value of the element in the array
        console.log(element); // Output: John    101    true    Smith    102    false    Peter    103    null    undefined
    }

// Modifying array elements
    numbers[0] = 10;
    names[1] = "David";
    fruits[2] = "Orange";
    console.log("After modifying array elements:");
    console.log(numbers); // Output: [10, 2, 3, 4, 5]
    console.log(names); // Output: ["Alice", "David", "Charlie"]
    console.log(fruits); // Output: ["Apple", "Banana", "Orange"]

// Pass an Array to a Function
    // search an element in an array using function
    function searchElement( arr: number[], ele: number): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === ele) {   // if the element is found in the array, return true
                return true;
            }
        }
        return false; // if the element is not found in the array, return false
    }   
    console.log("Pass an Array to a Function:");
    console.log(searchElement(numbers, 10)); // Output: true
    console.log(searchElement(numbers, 5)); // Output: false

    // Example:
    function printArray(arr: string[]): void {
        console.log("Pass an Array to a Function:");
        for (let element of arr) {
            console.log(element);
        }
    }
    printArray(names); // Output: Array elements:    Alice    David    Charlie

    // Example: A function takes an array and returns array
    function capitalizeWords(arr: string[]): string[] {
        let result: string[] = [];
        for(let i = 0; i < arr.length; i++) {
            result[i] = arr[i].toUpperCase(); // Convert each element to uppercase
        }
        return result; // Return the modified array
    }
    console.log("Pass an Array to a Function:");
    console.log(capitalizeWords(names)); // Output: ["ALICE", "DAVID", "CHARLIE"]

// Array methods
    let numbers2: number[] = [1, 2, 3, 4, 5];
    let fruits2: string[] = ["Apple", "Banana", "Cherry", "Mango"];

    console.log("Using array methods:");
    console.log(`size of numbers array: ${numbers2.length}`); // Output: 5
    console.log(`size of fruits array: ${fruits2.length}`); // Output: 4

    // 1. push() - Adds one or more elements to the end of an array and returns the new length of the array.
    numbers2.push(6, 7, 8); // Adds 6, 7, 8 to the end of the array
    console.log(`After push():${numbers2}`); // Output: [1, 2, 3, 4, 5, 6, 7, 8]

    // 2. pop() - Removes the last element from an array and returns that element. This method changes the length of the array.
    let lastFruit = fruits2.pop(); // Removes the last element ("Mango") from the array
    console.log(`After pop():${fruits2}`); // Output: ["Apple", "Banana", "Cherry"]
    console.log(`Removed element: ${lastFruit}`); // Output: Mango

    // 3. shift() - Removes the first element from an array and returns that removed element. This method changes the length of the array.
    let firstFruit = fruits2.shift(); // Removes the first element ("Apple") from the array
    console.log(`After shift():${fruits2}`); // Output: ["Banana", "Cherry"]
    console.log(`Removed element: ${firstFruit}`); // Output: Apple

    // 4. unshift() - Adds one or more elements to the beginning of an array and returns the new length of the array.
    fruits2.unshift("Orange", "Blueberries", "Kiwi"); // Adds "Eve" to the beginning of the array
    console.log(`After unshift():${fruits2}`); // Output: ["Eve", "Banana", "Cherry"]
    
    // 5. concatenate() - Used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.
    let moreNumbers: number[] = [9, 10];
    let allNumbers = numbers2.concat(moreNumbers); // Merges numbers2 and moreNumbers into a new array
    console.log(`After concatenate():${allNumbers}`); // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    // 6. slice() - Returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included). The original array will not be modified.
    let slicedNumbers = allNumbers.slice(2, 7); // Returns a new array containing elements from index 2 to 6
    console.log(`After slice():${slicedNumbers}`); // Output: [3, 4, 5, 6, 7]

    // 7. splice() - Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
    // splice(start: number, deleteCount?: number, ...items: T[]): T[]
    fruits2.splice(1, 1); // Removes 1 element at index 1 (removes "Blueberries" from the array)
    console.log(`After splice():${fruits2}`); // Output: ["Orange", "Kiwi", "Banana", "Cherry"]

    fruits2.splice(2, 2, "Grapes", "Pineapple"); // Removes 2 elements at index 2 (removes "Banana" and "Cherry") and adds "Grapes" and "Pineapple" at index 2
    console.log(`After splice():${fruits2}`); // Output: ["Orange", "Kiwi", "Grapes", "Pineapple"]

    fruits2.splice(1, 0, "Strawberry", "Raspberry"); // Adds "Strawberry" and "Raspberry" at index 1 without removing any elements
    console.log(`After splice():${fruits2}`); // Output: ["Orange", "Strawberry", "Raspberry", "Kiwi", "Grapes", "Pineapple"]

    // 8. indexOf() - Returns the first index at which a given element can be found in the array, or -1 if it is not present.
    // syntax: indexOf(searchElement: T, fromIndex?: number): number
    let index = fruits2.indexOf("Grapes"); // Returns the index of "Grapes" in the array
    console.log(`Index of "Grapes": ${index}`); // Output: 4

    let notFoundIndex = fruits2.indexOf("Mango"); // Returns -1 since "Mango" is not in the array
    console.log(`Index of "Mango": ${notFoundIndex}`); // Output: -1

    let indexFrom = fruits2.indexOf("Kiwi", 3); // Returns the index of "Kiwi" starting from index 3
    console.log(`Index of "Kiwi" from index 3: ${indexFrom}`); // Output: 3 (since "Kiwi" is at index 3, it will be found when starting the search from index 3)

    let indexFrom2 = fruits2.indexOf("Kiwi", 2); // Returns the index of "Kiwi" starting from index 2
    console.log(`Index of "Kiwi" from index 2: ${indexFrom2}`); // Output: 3 (since "Kiwi" is at index 3, it will be found when starting the search from index 2)

    // 9. includes() - Determines whether an array includes a certain value among its entries, returning true or false as appropriate.
    // syntax: includes(searchElement: T, fromIndex?: number): boolean
    let hasGrapes = fruits2.includes("Grapes"); // Returns true since "Grapes" is in the array
    console.log(`Does the array include "Grapes"? ${hasGrapes}`); // Output: true

    let hasMango = fruits2.includes("Mango"); // Returns false since "Mango" is not in the array
    console.log(`Does the array include "Mango"? ${hasMango}`); // Output: false

    let hasKiwiFrom3 = fruits2.includes("Kiwi", 3); // Returns true since "Kiwi" is in the array and the search starts from index 3
    console.log(`Does the array include "Kiwi" from index 3? ${hasKiwiFrom3}`); // Output: true

    let hasKiwiFrom4 = fruits2.includes("Kiwi", 4); // Returns false since "Kiwi" is in the array but the search starts from index 4
    console.log(`Does the array include "Kiwi" from index 4? ${hasKiwiFrom4}`); // Output: false

    // 10. toString() - Returns a string representing the specified array and its elements.
    let fruitsString = fruits2.toString(); // Converts the array to a string
    console.log(`fruit as an array: ${fruits2}`); // Output: ["Orange", "Strawberry", "Raspberry", "Kiwi", "Grapes", "Pineapple"]
    console.log(`Array as string: ${fruitsString}`); // Output: "Orange,Strawberry,Raspberry,Kiwi,Grapes,Pineapple"

    let numbersString = numbers2.toString(); // Converts the array to a string
    console.log(`number as an array: ${numbers2}`); // Output: [1, 2, 3, 4, 5, 6, 7, 8]
    console.log(`Array as string: ${numbersString}`); // Output: "1,2,3,4,5,6,7,8"

    let myArray:string[] = ['w','e','l','c','o','m','e'];
    console.log(`myArray as an array: ${myArray}`); // Output: ['w','e','l','c','o','m','e']
    console.log(`myArray as string: ${myArray.toString()}`); // Output: "w,e,l,c,o,m,e"

// Arrays Advanced Method
// 1. forEach(): method executes  a function once for each element in the array. 
//      - Does NOT return a new array
//      - Used primarily for side effects (logging, updating external variables, etc.)
//      - Cannot break out of the loop early
//      - The callback function receives three parameters: element, index, and array
 
// Syntax:
//      array.forEach(function(element, index, array))
//      - element: The current element being processed in the array
//      - index (optional): The index of the current element being processed in the array
//      - array (optional): The array forEach() was called upon, current element belongs to.

// @returns void - This method does not return a value
  
    // Example:
    console.log("");
    console.log("Using forEach() method:");
    const numbers3 = [1, 2, 3, 4, 5];
    numbers3.forEach((num) => {
        console.log(num); // Output: 1, 2, 3, 4, 5
    });

    // Example:
    const fruits3 = ["Apple", "Banana", "Cherry"];
    fruits3.forEach((fruit, index) => {
        console.log(`${index}: ${fruit}`); // Output: 0: Apple    1: Banana    2: Cherry
    }); 

    // Example:
    const mixedData2: Array<string | number> = ["John", 101, "Smith", 102, "Peter", 103];
    mixedData2.forEach((item, index, arr) => {
        console.log(`Index: ${index}, Item: ${item}, Array: ${arr}`); 
        // Output: Index: 0, Item: John, Array: John,101,Smith,102,Peter,103    
        // Index: 1, Item: 101, Array: John,101,Smith,102,Peter,103    
        // Index: 2, Item: Smith, Array: John,101,Smith,102,Peter,103    
        // Index: 3, Item: 102, Array: John,101,Smith,102,Peter,103    
        // Index: 4, Item: Peter, Array: John,101,Smith,102,Peter,103    
        // Index: 5, Item: 103, Array: John,101,Smith,102,Peter,103
    });

    // Example:
    fruits3.forEach((fruit, index) => {
        if (fruit === "Banana") {
            console.log("Found Banana!"); // Output: Found Banana!
            return; // This will only exit the current iteration of the forEach loop, not the entire loop
        }   
        console.log(fruit); // Output: Apple    Cherry
        console.log(`${index}: ${fruit}`); // Output: 0: Apple    Found Banana!    2: Cherry
    });

// 2. map(): method creates a new array populated with the results of calling a provided function on every element in the calling array.
//      - Returns a new array with the results of calling a provided function on every element in the calling array.
//      - Does NOT modify the original array
//      - The callback function receives three parameters: element, index, and array

// Syntax:
//      let newArray = array.map(function(element, index, array))
//      - element: The current element being processed in the array
//      - index (optional): The index of the current element being processed in the array
//      - array (optional): The array map() was called upon, current element belongs to.

// @returns A new array with each element being the result of the callback function.

    // Example:
    console.log("");
    console.log("Using map() method:");
    const numbers4 = [1, 2, 3, 4, 5];
    const squareNumbers = numbers4.map(function(num) { return num * num; }); // This will return a new array with the same elements as numbers4 since the callback function does not modify the elements}
    const squaredNumbers = numbers4.map((num) => num * num);
    console.log(squareNumbers); // Output: [1, 4, 9, 16, 25]
    console.log(squaredNumbers); // Output: [1, 4, 9, 16, 25]
    console.log("original array:", numbers4); // Output: [1, 2, 3, 4, 5] (original array is unchanged)

    // Example:
    const fruits4 = ["Apple", "Banana", "Cherry"];
    const upperCaseFruits = fruits4.map((fruit) => fruit.toUpperCase());
    console.log(upperCaseFruits); // Output: ["APPLE", "BANANA", "CHERRY"]
    console.log("original array:", fruits4); // Output: ["Apple", "Banana", "Cherry"] (original array is unchanged)
    
// 3. filter(): method creates a new array with all elements that pass/satisfy the test implemented by the provided function.
//      - Returns a new array with all elements that pass the test implemented by the provided function.
//      - Does NOT modify the original array
//      - The callback function receives three parameters: element, index, and array

// Syntax:
//      let newArray = array.filter(function(element, index, array))
//      - element: The current element being processed in the array
//      - index (optional): The index of the current element being processed in the array
//      - array (optional): The array filter() was called upon, current element belongs to.

    // Example:
    console.log("");
    console.log("Using filter() method:");
    const numbers5 = [1, 2, 3, 4, 5];
    const evenNumbers = numbers5.filter((num) => num % 2 === 0);
    console.log(evenNumbers); // Output: [2, 4]
    console.log("original array:", numbers5); // Output: [1, 2, 3, 4, 5] (original array is unchanged)

    // Example:
    const fruits5 = ["Apple", "Banana", "Cherry", "Mango", "Blueberry", "Strawberry"];
    const fruitsWithA = fruits5.filter((fruit) => fruit.includes("a") || fruit.includes("A"));
    console.log(fruitsWithA); // Output: ["Apple", "Banana", "Mango"]
    console.log("original array:", fruits5); // Output: ["Apple", "Banana", "Cherry", "Mango", "Blueberry", "Strawberry"] 

// 4. reduce(): method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.
//      - Executes a reducer function on each element of the array, resulting in a single output value.
//      - Does NOT modify the original array
//      - The reducer function receives four parameters: accumulator, currentValue, currentIndex, and array

// Syntax:
//      let result = array.reduce(function(accumulator, currentValue, currentIndex, array), initialValue)
//      - accumulator: The accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied.
//      - currentValue: The current element being processed in the array
//      - currentIndex (optional): The index of the current element being processed in the array
//      - array (optional): The array reduce() was called upon, current element belongs to.
// @param initialValue - Optional. A value to use as the first argument to the first call of the callback. 
// If no initialValue is supplied, the first element in the array will be used as the initial accumulator value and skipped as currentValue.

// @returns The single value that results from the reduction.

    // Example:
    console.log("");
    console.log("Using reduce() method:");  
    const numbers6 = [1, 2, 3, 4, 5];
    const sum = numbers6.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(`Sum of numbers: ${sum}`); // Output: 15
    console.log("original array:", numbers6); // Output: [1, 2, 3, 4, 5] (original array is unchanged)

    // Example:
    const product = numbers6.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
    console.log(`Product of numbers: ${product}`); // Output: 120
    console.log("original array:", numbers6); // Output: [1, 2, 3, 4, 5] (original array is unchanged)

// 5. some(): method tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value.
//      - Tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value.
//      - Does NOT modify the original array
//      - The callback function receives three parameters: element, index, and array

// Syntax:
//      let result = array.some(function(element, index, array))
//      - element: The current element being processed in the array
//      - index (optional): The index of the current element being processed in the array
//      - array (optional): The array some() was called upon, current element belongs to.

// @returns true if the callback function returns a truthy value for at least one element in the array. Otherwise, false.

    // Example:
    console.log("");
    console.log("Using some() method:");
    const numbers7 = [1, 2, 3, 4, 5];
    const hasEvenNumber = numbers7.some((num) => num % 2 === 0);
    console.log(`Does the array have an even number? ${hasEvenNumber}`); // Output: true

    // Example:
    const hasGreaterThan5 = numbers7.some((num) => num > 5);
    console.log(`Does the array have a number greater than 5? ${hasGreaterThan5}`); // Output: false

// 6. every(): method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
//      - Tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
//      - Does NOT modify the original array
//      - The callback function receives three parameters: element, index, and array

// Syntax:
//      let result = array.every(function(element, index, array))
//      - element: The current element being processed in the array
//      - index (optional): The index of the current element being processed in the array
//      - array (optional): The array every() was called upon, current element belongs to.

// @returns true if the callback function returns a truthy value for every array element. Otherwise, false.

    // Example:
    console.log("");
    console.log("Using every() method:");
    const numbers8 = [2, 4, 6, 8, 10];
    const allEven = numbers8.every((num) => num % 2 === 0);
    console.log("Are all numbers even?", allEven); // Output: true

    // Example:
    const allGreaterThan5 = numbers8.every((num) => num > 5);
    console.log(`Are all numbers greater than 5? ${allGreaterThan5}`); // Output: false




