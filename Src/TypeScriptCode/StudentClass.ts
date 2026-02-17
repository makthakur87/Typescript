// 1. class: is a blueprint for creating objects that share common properties and behaviors. 
// It defines the structure and behavior of the objects that will be created from it.
// 2. Readonly properties: is a property that can only be assigned once, either at the time of declaration or within the constructor of the class. 
// Once a value is assigned to a readonly property, it cannot be changed. 
// This is useful for properties that should remain constant throughout the lifecycle of an object, such as an ID or a timestamp.
// 3. optional properties: is a property that may or may not be present in an object. 
// It is denoted by a question mark (?) after the property name in the class definition. 
// Optional properties allow for more flexible object structures, as they can be omitted when creating an instance of the class. 
// This is useful for properties that are not always required or may not be applicable to every instance of the class.
    class Student { 
        readonly studentId: number;  // Readonly property (can only be assigned once, either at declaration or in the constructor)
        name: string;       // Regular property (can be assigned and modified)
        email?: string;  // Optional property (may or may not be present)
        schoolName: string;

        // constructor to initialize the properties of the class
        constructor(studentId: number, name: string, schoolName: string, email?: string) {
            this.studentId = studentId;
            this.name = name;
            this.email = email;
            this.schoolName = schoolName;
        }

        // named method to display student information
        namedDisplayInfo(): string {
            return `Student ID: ${this.studentId}, Name: ${this.name}, School: ${this.schoolName}, Email: ${this.email ? this.email : "N/A"}`;
        }
        
       // anonymous/arrow function to display student information
        arrowDisplayInfo = (): string => {
            return `Student ID: ${this.studentId}, Name: ${this.name}, School: ${this.schoolName}, Email: ${this.email ? this.email : "N/A"}`;
        }
    }

    // creating an instance of the Student class
    let student1 = new Student(1, "Alice", "ABC University", "test@test.com");
    let student2 = new Student(2, "Bob", "XYZ University"); // email is optional, so it can be omitted

    console.log("");
    console.log("Using classes:");

    console.log("Student1");
    console.log("student1:", student1); // Output: Student { studentId: 1, name: 'Alice', email: 'test@test.com', schoolName: 'ABC University' }
    console.log("Named method:", student1.namedDisplayInfo()); // Output: Student ID: 1, Name: Alice, School: ABC University, Email: test@test.com
    console.log("Arrow function:", student1.arrowDisplayInfo()); // Output: Student ID: 1, Name: Alice, School: ABC University, Email: test@test.com

    console.log("");
    console.log("Student2");
    console.log("student2:", student2); // Output: Student { studentId: 2, name: 'Bob', email: undefined, schoolName: 'XYZ University' }
    console.log("Named method:", student2.namedDisplayInfo()); // Output: Student ID: 2, Name: Bob, School: XYZ University, Email: N/A
    console.log("Arrow function:", student2.arrowDisplayInfo()); // Output: Student ID: 2, Name: Bob, School: XYZ University, Email: N/A

    // modify the student id (readonly property) - this will cause an error because studentId is readonly and cannot be modified after it has been assigned
    // student1.studentId = 2; // Error: Cannot assign to 'studentId' because it is a read-only property.
    student1.name = "Alice Smith"; // This is allowed because name is not a readonly property
    console.log("");
    console.log("After modifying student1's name:");
    console.log("student1:", student1); // Output: Student { studentId: 1, name: 'Alice Smith', email: 'test@test.com', schoolName: 'ABC University' }

// 4. Static properties (variables) and methods: are common/shared among all instances (objects) of a class.
// static properties/methods can be accessed directly on the class itself, without needing to create an instance of the class.
// static properties/methods can be modified with the class name, and the changes will be reflected across all instances of the class that access the static property/method.
// we can not use 'this' keyword to access static properties/methods within the class, instead we need to use the class name to access them.
// Example:
    class StudentWithStatic {
        readonly studentId: number;  // Readonly property (can only be assigned once, either at declaration or in the constructor)
        name: string;       // Regular property (can be assigned and modified)
        email?: string;  // Optional property (may or may not be present)
        static schoolName: string = "Greenwood High School"; // Static property (shared among all instances of the class)

        // constructor to initialize the properties of the class
        constructor(studentId: number, name: string, schoolName: string, email?: string) {
            this.studentId = studentId;
            this.name = name;
            this.email = email;
            StudentWithStatic.schoolName = schoolName; // Assigning value to static property
        }

        // named method to display student information
        namedDisplayInfo(): string {
            return `Student ID: ${this.studentId}, Name: ${this.name}, School: ${StudentWithStatic.schoolName}, Email: ${this.email ? this.email : "N/A"}`;
        }
        
       // anonymous/arrow function to display student information
        arrowDisplayInfo = (): string => {
            return `Student ID: ${this.studentId}, Name: ${this.name}, School: ${StudentWithStatic.schoolName}, Email: ${this.email ? this.email : "N/A"}`;
        }

        // static method to display school information
        static displaySchoolInfo(): string {
            return `School Name: ${StudentWithStatic.schoolName}`;
        }

        // static method to change the school name
        static changeSchoolName(newSchoolName: string): void {
            StudentWithStatic.schoolName = newSchoolName;
            console.log(`School name changed to: ${StudentWithStatic.schoolName}`);
        }
    }

    let student3 = new StudentWithStatic(3, "Charlie", "Greenwood High School", "charlie@test.com");
    let student4 = new StudentWithStatic(4, "David", "Greenwood High School"); // email is optional, so it can be omitted

    console.log("");
    console.log("Using static properties and methods:");
    console.log("Student3:", student3); // Output: StudentWithStatic { studentId: 3, name: 'Charlie', email: 'charlie@test.com' }
    console.log("Student4:", student4); // Output: StudentWithStatic { studentId: 4, name: 'David', email: undefined }
    console.log("Student3 named method:", student3.namedDisplayInfo()); // Output: Student ID: 3, Name: Charlie, School: Greenwood High School, Email: charlie@test.com
    console.log("Student4 named method:", student4.namedDisplayInfo()); // Output: Student ID: 4, Name: David, School: Greenwood High School, Email: N/A
    console.log("Static method displaySchoolInfo:", StudentWithStatic.displaySchoolInfo()); // Output: School Name: Greenwood High School

    // change the school name using the static method
    StudentWithStatic.changeSchoolName("Sunrise High School");
    console.log("");
    console.log("After changing the school name using static method:");
    console.log("Student3 named method:", student3.namedDisplayInfo()); // Output: Student ID: 3, Name: Charlie, School: Sunrise High School, Email: charlie@test.com
    console.log("Student4 named method:", student4.namedDisplayInfo()); // Output: Student ID: 4, Name: David, School: Sunrise High School, Email: N/A
    console.log("Static method displaySchoolInfo:", StudentWithStatic.displaySchoolInfo()); // Output: School Name: Sunrise High School

// 5. Access modifiers (public, private, protected): are keywords used to control the visibility and accessibility of class members (properties and methods).
// public members can be accessed from anywhere, private members can only be accessed within the class, and protected members can be accessed within the class and its subclasses.
// Example: 
    class StudentWithAccessModifiers {
        private studentId: number;  // Private property (can only be accessed within the class)
        public name: string;       // Public property (can be accessed from anywhere)
        protected email?: string;  // Protected property (can be accessed within the class and its subclasses)
        static schoolName: string = "Greenwood High School"; // Static property (shared among all instances of the class)

        // constructor to initialize the properties of the class
        constructor(studentId: number, name: string, schoolName: string, email?: string) {
            this.studentId = studentId;
            this.name = name;
            this.email = email;
            StudentWithAccessModifiers.schoolName = schoolName; // Assigning value to static property
        }
    }

// 6. Method overloading: is a feature that allows a class to have multiple methods with the same name but different parameters. 
// The correct method to call is determined at compile time based on the number and types of arguments passed to the method.
// Example: 
    class Calculator { 
        constructor(); // default constructor
        constructor(a: number, b: number); // constructor with parameters

        constructor(a?: number, b?: number) { // constructor implementation that handles both cases
            if (a !== undefined && b !== undefined) {
                console.log(`Sum: ${a + b}`); // If parameters are provided, calculate and display the sum
            } else {
                console.log("Default constructor called"); // If no parameters are provided, display a message
            }
        }

        // Method overloading - multiple method signatures
        add(a: number, b: number): number; // Method signature for adding two numbers
        add(a: number, b: number, c: number): number; // Method signature for adding three numbers

        // Method implementation that handles both cases
        add(a: number, b: number, c?: number): number { 
            if (c !== undefined) {
                return a + b + c; // If three parameters are provided, add them all
            }
            return a + b; // If only two parameters are provided, add them
        }
    }

    let calculator1 = new Calculator(); // Calls the default constructor
    let calculator2 = new Calculator(5, 3); // Calls the constructor with parameters and outputs: Sum: 8
    console.log("");
    console.log("Using method overloading:");
    console.log("calculator1 add(5, 3):", calculator1.add(5, 3)); // Output: 8
    console.log("calculator1 add(5, 3, 2):", calculator1.add(5, 3, 2)); // Output: 10
    console.log("calculator2 add(5, 3):", calculator2.add(10, 11)); // Output: 21
    console.log("calculator2 add(5, 3, 2):", calculator2.add(12, 34, 12)); // Output: 58

// 7. constructor overloading: is a feature that allows a class to have multiple constructors with different parameters. 
// The correct constructor to call is determined at compile time based on the number and types of arguments passed when creating an instance of the class.
// Example:
      class constCalculator {
        // constructor overloading - multiple constructor signatures 
        constructor(); // default constructor
        constructor(a: number, b: number); // constructor with parameters

        constructor(a?: number, b?: number) { // constructor implementation that handles both cases
            if (a !== undefined && b !== undefined) {
                console.log(`Sum: ${a + b}`); // If parameters are provided, calculate and display the sum
            } else {
                console.log("Default constructor called"); // If no parameters are provided, display a message
            }
        }
    }

// Example: 
    class Person {
        name: string;
        age: number;
        constructor(); // default constructor
        constructor(name: string, age: number); // constructor with parameters
        constructor(name?: string, age?: number) { // constructor implementation that handles both cases
            if (name !== undefined && age !== undefined) {
                this.name = name;
                this.age = age;
            } else {
                this.name = "Unknown";
                this.age = 0;
            }
        }
    }
    let person1 = new Person(); // Calls the default constructor
    let person2 = new Person("Alice", 30); // Calls the constructor with parameters
    console.log("");
    console.log("Using constructor overloading:");
    console.log("person1:", person1); // Output: Person { name: 'Unknown', age: 0 }
    console.log("person2:", person2); // Output: Person { name: 'Alice', age: 30 }
