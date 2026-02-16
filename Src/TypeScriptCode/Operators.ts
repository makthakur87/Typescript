// Operators: in TypeScript are used to perform operations on variables and values. 
// They can be categorized into several types, including arithmetic, assignment, comparison, logical, bitwise, and more. 
// Here are some examples of different types of operators in TypeScript:

// 1. Arithmetic Operators: used to perform mathematical operations. Example: +, -, *, /, %, **.
        let a: number = 20, b: number = 10;  
        console.log("Addition:", a + b); // Output: Addition: 15
        console.log("Subtraction:", a - b);
        console.log("Multiplication:", a * b); // Output: Multiplication: 50
        console.log("Division:", a / b); // Output: Division: 2
        console.log("Modulus:", a % b); // Output: Modulus: 0 (remainder of 10 divided by 5 is 0)
        console.log("Exponentiation:", 5 ** 2); // Output: Exponentiation: 100000 (10 raised to the power of 5 is 100000)

// 2. Assignment Operators: used to assign values to variables. Example: =, +=, -=, *=, /=.
        let d: number = 10;
        console.log("Initial Value of x:", d); // Output: Initial Value of x: 10    
        d += 5; // Equivalent to d = d + 5
        console.log("After += 5:", d); // Output: After += 5: 15
        d -= 3; // Equivalent to d = d - 3
        console.log("After -= 3:", d); // Output: After -= 3: 12
        d *= 2; // Equivalent to d = d * 2  
        console.log("After *= 2:", d); // Output: After *= 2: 24
        d /= 4; // Equivalent to d = d / 4
        console.log("After /= 4:", d); // Output: After /= 4: 6
        d %= 5; // Equivalent to d = d % 5
        console.log("After %= 5:", d); // Output: After %= 5: 1 (remainder of 6 divided by 5 is 1)

// 3. Relational/Comparison Operators: are used to compare values and return a boolean result (true or false). ==, ===, !=, !==, >, <, >=, <=.
        let numb1: number = 10, numb2: number = 20;
        console.log("Is numb1 == numb2?", numb1 == numb2); // Output: false (== checks for value equality)
        console.log("Is numb1 strictly === numb2?", numb1 === numb2); // Output: false (=== checks for both value and type equality)
        console.log("Is numb1 != numb2?", numb1 != numb2); // Output: true (!= checks for value inequality)
        console.log("Is numb1 strictly !== numb2?", numb1 !== numb2); // Output: true (!== checks for both value and type inequality)
        console.log("Is numb1 greater than numb2?", numb1 > numb2); // Output: false (10 is not greater than 20)
        console.log("Is numb1 less than numb2?", numb1 < numb2); // Output: true (10 is less than 20)
        console.log("Is numb1 greater than or equal to numb2?", numb1 >= numb2); // Output: false (10 is not greater than or equal to 20)
        console.log("Is numb1 less than or equal to numb2?", numb1 <= numb2); // Output: true (10 is less than or equal to 20)
        
    // Double equals (==) vs Triple equals (===):
        let m: number = 10, n: string = "10";
        console.log("Using == operator:", m == n);
        console.log("Using === operator:", m === n);
        // Output:
        // Using == operator: true (== performs type coercion, so it converts the string "10" to the number 10 before comparing)
        // Using === operator: false (=== does not perform type coercion, so it compares both value and type, 
        // and since num1 is a number and num2 is a string, they are not strictly equal)

// 4. Logical Operators: used to combine multiple conditions and return a boolean result. && (logical AND), || (logical OR), ! (logical NOT).
        let p: boolean = true, q: boolean = false;
        console.log("p && q:", p && q); // Output: p && q: false (logical AND returns true only if both operands are true)
        console.log("p || q:", p || q); // Output: p || q: true (logical OR returns true if at least one operand is true)
        console.log("!p:", !p); // Output: !p: false (logical NOT returns the opposite of the operand's value)
        console.log("!q:", !q); // Output: !q: true (logical NOT returns the opposite of the operand's value)       

// 5. Combination of Logical Operators and Comparison Operators:
        let ageNum: number = 25;
        console.log("Is age between 18 and 30?", ageNum >= 18 && ageNum <= 30);
        // Output: Is age between 18 and 30? true (the age is greater than or equal to 18 and less than or equal to 30)
        console.log("Is age less than 18 or greater than 30?", ageNum < 18 || ageNum > 30);
        // Output: Is age less than 18 or greater than 30? false (the age is not less than 18 and not greater than 30)
        let isStu: boolean = true, hasID: boolean = false;
        console.log("Is student with ID?", isStu && hasID);
        // Output: Is student with ID? false (the student does not have an ID, so the logical AND returns false)
        console.log("Is student or has ID?", isStu || hasID);
        // Output: Is student or has ID? true (the student is a student, so the logical OR returns true)

// 6. Conditional (Ternary) Operator: a shorthand for an if-else statement. It takes three operands: 
// a condition, a value to return if the condition is true, and a value to return if the condition is false. 
// Example: condition ? valueIfTrue : valueIfFalse.
        let ageNum1: number = 25;
        let isAdult: string = ageNum1 >= 18 ? "Yes" : "No";
        console.log("Is Adult?", isAdult); // Output: Is Adult? Yes (the age is greater than or equal to 18, so the result is "Yes")

        let scoreNum1: number = 85;
        let grade1: string = scoreNum1 >= 90 ? "A" : scoreNum1 >= 80 ? "B" : scoreNum1 >= 70 ? "C" : scoreNum1 >= 60 ? "D" : "F";
        console.log("Grade:", grade1); // Output: Grade: B (the score is greater than or equal to 80 but less than 90, so the grade is B)

        let scoreNum: number = 85;
        let grade: string = scoreNum >= 90 ? "A" : scoreNum >= 80 ? "B" : scoreNum >= 70 ? "C" : scoreNum >= 60 ? "D" : "F";
        console.log("Grade:", grade); // Output: Grade: B (the score is greater than or equal to 80 but less than 90, so the grade is B)

// 7. Bitwise Operators: used to perform bitwise operations on binary numbers. Example: &, |, ^, ~, <<, >>, >>>.
        let numA: number = 5; // In binary: 0000 0101
        let numB: number = 3; // In binary: 0000 0011
        console.log("Bitwise AND (numA & numB):", numA & numB); // Output: Bitwise AND (numA & numB): 1 (In binary: 0000 0001)
        console.log("Bitwise OR (numA | numB):", numA | numB); // Output: Bitwise OR (numA | numB): 7 (In binary: 0000 0111)
        console.log("Bitwise XOR (numA ^ numB):", numA ^ numB); // Output: Bitwise XOR (numA ^ numB): 6 (In binary: 0000 0110)
        console.log("Bitwise NOT (~numA):", ~numA); 
        // Output: Bitwise NOT (~numA): -6 (In binary: 1111 1010, which is the two's complement representation of -6)
        console.log("Left Shift (numA << 1):", numA << 1); 
        // Output: Left Shift (numA << 1): 10 (In binary: 0000 1010, which is 5 shifted left by 1 bit)
        console.log("Right Shift (numA >> 1):", numA >> 1); 
        // Output: Right Shift (numA >> 1): 2 (In binary: 0000 0010, which is 5 shifted right by 1 bit)
        console.log("Unsigned Right Shift (numA >>> 1):", numA >>> 1); 
        // Output: Unsigned Right Shift (numA >>> 1): 2 (In binary: 0000 0010, which is 5 shifted right by 1 bit without sign extension)  

// 8. increment (++) and Decrement (--) Operators: used to increase or decrease the value of a variable by 1.
        let countA: number = 10;

        // postfix increment and decrement
        console.log("Initial Count:", countA); // Output: Initial Count: 10
        countA++;
        console.log("After Increment (count++):", countA); // Output: After Increment (count++): 11
        countA--;
        console.log("After Decrement (count--):", countA); // Output: After Decrement (count--): 10  

        // prefix increment and decrement
        console.log("Initial Count:", countA); // Output: Initial Count: 10
        ++countA;
        console.log("After Increment (++count):", countA); // Output: After Increment (++count): 11
        --countA;
        console.log("After Decrement (--count):", countA); // Output: After Decrement (--count): 10

        // difference between postfix and prefix increment/decrement:
        let countB: number = 5;
        console.log("Postfix Increment (countB++):", countB++); 
        // Output: Postfix Increment (countB++): 5 (the current value of countB is returned before it is incremented)
        console.log("Current CountB:", countB); 
        // Output: Current CountB: 6 (the value of countB is now 6 after the increment)

        console.log("Postfix Decrement (countB--):", countB--);
        // Output: Postfix Decrement (countB--): 6 (the current value of countB is returned before it is decremented)
        console.log("Current CountB:", countB); 
        // Output: Current CountB: 5 (the value of countB is now 5 after the decrement)

        let countC: number = 5;
        console.log("Prefix Increment (++countC):", ++countC); 
        // Output: Prefix Increment (++countC): 6 (the value of countC is incremented first and then returned, so it returns 6)
        console.log("Current CountC:", countC); 
        // Output: Current CountC: 6 (the value of countC is now 6 after the increment)

        console.log("Prefix Decrement (--countC):", --countC); 
        // Output: Prefix Decrement (--countC): 5 (the value of countC is decremented first and then returned, so it returns 5)
        console.log("Current CountC:", countC); 
        // Output: Current CountC: 5 (the value of countC is now 5 after the decrement)

// 9. Typeof Operator: used to determine the type of a variable or value. Example: typeof variable.
        let str: string = "Hello, TypeScript!";
        let num: number = 42;
        let bool: boolean = true;
        let obj: object = { name: "Alice", age: 30 };
        let arr: number[] = [1, 2, 3];
        console.log("Type of str:", typeof str); // Output: Type of str: string
        console.log("Type of num:", typeof num); // Output: Type of num: number
        console.log("Type of bool:", typeof bool); // Output: Type of bool: boolean
        console.log("Type of obj:", typeof obj); // Output: Type of obj: object
        console.log("Type of arr:", typeof arr); // Output: Type of arr: object (arrays are considered objects in JavaScript/TypeScript)
        let bigNmber1: bigint = 9007199254740991n; // BigInt literal with 'n' suffix
        console.log("Type of bigNumber1:", typeof bigNmber1); 
        // Output: Type of bigNumber1: bigint (BigInt is a separate type from number in TypeScript)

// 10. Comma Operator: used to evaluate multiple expressions and return the value of the last expression. 
// Example: (expression1, expression2, ..., expressionN).
        let x1: number = 10, y1: number = 20, z1: number;
        z1 = (x1++, y1++, x1 + y1);
        console.log("Value of z1:", z1); 
        // Output: Value of z1: 32 (the comma operator evaluates x1++, then y1++, 
        // and finally returns the result of x1 + y1, which is 11 + 21 = 32)
        console.log("Current value of x1:", x1); // Output: Current value of x1: 11 (x1 was incremented from 10 to 11)
        console.log("Current value of y1:", y1); // Output: Current value of y1: 21 (y1 was incremented from 20 to 21)  

// 11. Optional Chaining Operator (?.): used to safely access nested properties of an object without causing an error 
// if any property in the chain is null or undefined.
        let person: { name: string; address?: { city: string; country: string } } = {
            name: "Alice", 
            address: { city: "New York", country: "USA" }
        };
        console.log("City:", person.address?.city); 
        // Output: City: New York (the address property exists, so it returns the city)
        console.log("Country:", person.address?.country);
        // Output: Country: USA (the address property exists, so it returns the country)

        let personWithoutAddress: { name: string; address?: { city: string; country: string } } = {
            name: "Bob"
        };
        console.log("City:", personWithoutAddress.address?.city);
        // Output: City: undefined (the address property does not exist, so it returns undefined instead of throwing an error)
        console.log("Country:", personWithoutAddress.address?.country);
        // Output: Country: undefined (the address property does not exist, so it returns undefined instead of throwing an error)

// 12. Nullish Coalescing Operator (??): used to provide a default value when the left-hand side expression is null or undefined.
        let input: string | null = null;
        let defaultValue: string = "Default Value";
        let resultValue: string = input ?? defaultValue;
        console.log("Result:", resultValue);
        // Output: Result: Default Value (since input is null, the nullish coalescing operator returns the defaultValue)

        input = "User Input";
        resultValue = input ?? defaultValue;
        console.log("Result:", resultValue);
        // Output: Result: User Input (since input is not null or undefined, the nullish coalescing operator returns the value of input)
    
// 13. Optional Chaining with Nullish Coalescing: can be combined to provide a default value when accessing nested properties that may be
//  null or undefined.
        let user: { name: string; profile?: { age: number } } = {
            name: "Charlie"
        };

        let userAge: number = user.profile?.age ?? 18;
        console.log("User Age:", userAge);
        // Output: User Age: 18 (since user.profile is undefined, the optional chaining operator returns undefined,
        // and then the nullish coalescing operator returns the default value of 18)

        user.profile = { age: 25 };
        userAge = user.profile?.age ?? 18;
        console.log("User Age:", userAge);
        // Output: User Age: 25 (since user.profile.age is now defined, the optional chaining operator returns 25, 
        // and the nullish coalescing operator does not need to return the default value)

// 14. Type Assertion Operator: used to tell the TypeScript compiler to treat a value as a specific type.
        let someValue: any = "This is a string";
        let strLength: number = (someValue as string).length;
        console.log("String Length:", strLength);
        // Output: String Length: 16 (the type assertion tells the compiler to treat someValue as a string,
        // allowing us to access the length property without a type error)

        let anotherValue: any = 42;
        let numValue: number = <number>anotherValue;
        console.log("Number Value:", numValue);
        // Output: Number Value: 42 (the type assertion tells the compiler to treat anotherValue as a number,
        // allowing us to assign it to a variable of type number without a type error)

