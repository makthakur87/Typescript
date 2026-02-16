// Object: Objects in TypeScript are collections of key-value pairs, where each key is a string (or symbol) and the value can be of any type. 
// They are used to store and organize data in a structured way.
// Object contains properties and methods. Properties are the data stored in the object, 
// while methods are functions that can be called on the object to perform actions or calculations based on its properties.

// Example of object declaration in different ways:

// 1. using 'object' type - directly define the value for variables
    // Typescript 'object' type represents all values that are not in the primitive types (number, string, boolean, bigint, symbol, null, or undefined).

    // Example: using dot notation to access properties and methods of an object
    let employee: object = { 
        name: "John",
        age: 30,
        salary: 50000,
        job: "Developer",
        getDetails: function() {
            // console.log(this.name, this.age, this.salary, this.job);
            return `${this.name} is a ${this.age}-year-old ${this.job} earning $${this.salary} per year.`;
        }
    };
    console.log(typeof employee); // Output: object
    console.log("")
    console.log("Using dot notation:");
    console.log(employee); // Output: { name: 'John', age: 30, salary: 50000, job: 'Developer', getDetails: [Function: getDetails] }
    console.log(employee.getDetails()); // Output: John is a 30-year-old Developer earning $50000 per year.
    
    // Accessing object properties
    console.log(employee.name); // Output: John
    console.log(employee.age); // Output: 30
    console.log(employee.salary); // Output: 50000
    console.log(employee.job); // Output: Developer

    // using bracket notation to access properties and methods of an object
    console.log("")
    console.log("Using bracket notation:");
    console.log(employee["name"]); // Output: John
    console.log(employee["age"]); // Output: 30
    console.log(employee["salary"]); // Output: 50000
    console.log(employee["job"]);   // Output: Developer
    console.log(employee["getDetails"]()); // Output: John is a 30-year-old Developer earning $50000 per year.

// 2. Inline Type Object Type - define the data type for the keys and values directly in the variable declaration
    // Example:
   let person: { name: string; age: number; isStudent: boolean; city?: string } = {
        name: "Alice",
        age: 30,
        isStudent: false
    };
    console.log("");
    console.log("Using inline type object:");
    console.log(person); // Output: { name: 'Alice', age: 30, isStudent: false }

    // Example:
    let student: { name: string; age: number; grade: string, getSummary: () => string } = {
        name: "Bob",
        age: 20,
        grade: "A",
        getSummary: () => {
            return `${student.name} is ${student.age} years old and has a grade of ${student.grade}.`;
        }
    };
    console.log("Object student:", student); // Output: { name: 'Bob', age: 20, grade: 'A', getSummary: [Function: getSummary] }
    console.log("Object student getSummary:",student.getSummary()); // Output: Bob is 20 years old and has a grade of A.

    let student1: { name: string; age: number; grade: string, getSummary: () => string } = {
        name: "Marry",
        age: 19,
        grade: "B",
        getSummary: () => {
            return `${student1.name} is ${student1.age} years old and has a grade of ${student1.grade}.`;
        }
    };
    console.log("");
    console.log("Object student1:", student1); // Output: { name: 'Marry', age: 19, grade: 'B', getSummary: [Function: getSummary] }
    console.log("Object student1 getSummary:",student1.getSummary()); // Output: Marry is 19 years old and has a grade of B.

    // Accessing object properties
    console.log("");
    console.log("Accessing object properties:");
    console.log(person.name); // Output: Alice
    console.log(person.age); // Output: 30
    console.log(person.isStudent); // Output: false

    // Modifying object properties
    person.age = 31;
    person.isStudent = true;
    console.log("");
    console.log("Modifying object properties:");
    console.log(person); // Output: { name: 'Alice', age: 31, isStudent: true }

    // Adding new properties to the object
    person.city = "New York";
    console.log("");
    console.log("Adding new properties to the object:");
    console.log(person); // Output: { name: 'Alice', age: 31, isStudent: true, city: 'New York' }

// 3. using type alias - create a reusable type for the object structure
    type product = {
        name: string,
        price: number,
        category: string,
        getInfo: () => string
    };

    let book1: product = {
        name: "The Great Gatsby",
        price: 10.99,
        category: "Fiction",
        getInfo: () => {
            return `${book1.name} is a ${book1.category} book that costs $${book1.price}.`;
        }
    };

    let book2: product = {
        name: "A Brief History of Time",
        price: 15.99,
        category: "Science",
        getInfo: () => {
            return `${book2.name} is a ${book2.category} book that costs $${book2.price}.`;
        }
    };

    let book3: product = {
        name: "The Art of War",
        price: 12.99,
        category: "Strategy",
        getInfo: () => {
            return `${book3.name} is a ${book3.category} book that costs $${book3.price}.`;
        }
    };

    console.log("");
    console.log("Using type alias:");
    console.log("book1:", book1); // Output: { name: 'The Great Gatsby', price: 10.99, category: 'Fiction', getInfo: [Function: getInfo] }
    console.log("book1 getInfo:", book1.getInfo()); // Output: The Great Gatsby is a Fiction book that costs $10.99.

    console.log("");
    console.log("book2:", book2); // Output: { name: 'A Brief History of Time', price: 15.99, category: 'Science', getInfo: [Function: getInfo] }
    console.log("book2 getInfo:", book2.getInfo()); // Output: A Brief History of Time is a Science book that costs $15.99.

    console.log("");
    console.log("book3:", book3); // Output: { name: 'The Art of War', price: 12.99, category: 'Strategy', getInfo: [Function: getInfo] }
    console.log("book3 getInfo:", book3.getInfo()); // Output: The Art of War is a Strategy book that costs $12.99.

    // intersection types - combine multiple types to create a new type that has all the properties of the combined types
    type personal = {
        name: string,
        age: number
    };

    type contact = {
        email: string,
        phone: number
    };

    type candidate = personal & contact & {
        getContactInfo: () => string
    };

    let candidate1: candidate = {
        name: "David",
        age: 28,
        email: "test@test.com",
        phone: 1234567890,
        getContactInfo: () => {
            return `${candidate1.name} can be contacted at ${candidate1.email} or ${candidate1.phone}.`;
        }
    };
    console.log("");
    console.log("Using intersection types:");
    console.log("candidate1:", candidate1); // Output: { name: 'David', age: 28, email: 'test@test.com', phone: 1234567890, getContactInfo: [Function: getContactInfo] }
    console.log("candidate1 getContactInfo:", candidate1.getContactInfo()); // Output: David can be contacted at test@test.com or 1234567890

// 4. using the classes - create a class to define the structure and behavior of the object, and then create instances of that class
    // Example:
    class Person {
        ssn: string;
        firstname: string;
        lastname: string;

        constructor(ssn: string, firstname: string, lastname: string) {
            this.ssn = ssn;
            this.firstname = firstname;
            this.lastname = lastname;
        }

        getFullName(): string {
            return `${this.firstname} ${this.lastname}`;
        }   

        getDetails(): string {
            return `SSN: ${this.ssn}, Name: ${this.getFullName()}`;
        }
    }

    let person1 = new Person("123-45-6789", "John", "Doe");
    console.log("");
    console.log("Using classes:");
    console.log("person1:", person1); // Output: Person { ssn: '123-45-6789', firstname: 'John', lastname: 'Doe' }
    console.log("person1 getFullName:", person1.getFullName()); // Output: John Doe
    console.log("person1 getDetails:", person1.getDetails()); // Output: SSN: 123-45-6789, Name: John Doe
    
// Object with nested objects
    let company: { name: string; employees: { name: string; position: string }[] } = {
        name: "Tech Company",
        employees: [
            { name: "Bob", position: "Developer" },
            { name: "Charlie", position: "Designer" }
        ]
    };
    console.log("");
    console.log("Object with nested objects:");
    console.log(company); // Output: { name: 'Tech Company', employees: [ { name: 'Bob', position: 'Developer' }, { name: 'Charlie', position: 'Designer' } ] }
    console.log(company.employees[0].name); // Output: Bob
    console.log(company.employees[1].position); // Output: Designer

// Object methods
    let calculator: { add: (a: number, b: number) => number; subtract: (a: number, b: number) => number } = {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b
    };
    console.log("");
    console.log("Object methods:");
    console.log(calculator.add(5, 3)); // Output: 8
    console.log(calculator.subtract(5, 3)); // Output: 2

