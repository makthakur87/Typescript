// Interface: An interface in TypeScript is a way to define the structure of an object. 
// It specifies the properties and methods that an object must have, without providing the implementation details. 
// Interfaces are used to enforce a contract on the shape of an object, ensuring that it adheres to a specific structure.

// Abstract methods in an interface are methods that are declared but not implemented. 
// They serve as a blueprint for classes that implement the interface, requiring them to provide their own implementation of these methods. 
// Abstract methods in an interface are implicitly abstract, meaning they do not have a body and must be implemented by any class that implements the interface.

// Example of interface declaration and implementation:

// 1. Basic Interface Example
    interface Person {
        name: string;
        age: number;
        isStudent: boolean;
        city?: string; // Optional property
    }

    // Implementing the interface in an object
    let person1: Person = {
        name: "Alice",
        age: 30,
        isStudent: false
    };
    console.log("Implementing the interface in an object");
    console.log(person1); // Output: { name: 'Alice', age: 30, isStudent: false }
    console.log("Person1 name:", person1.name); // Output: Person1 name: Alice
    console.log("Person1 age:", person1.age); // Output: Person1 age: 30
    console.log("Person1 isStudent:", person1.isStudent); // Output: Person1 isStudent: false
    console.log("Person1 city:", person1.city); // Output: Person1 city: undefined

// 2. Interface with Function Types
    // read only properties and function types in interface
    interface book {
        title: string;
        readonly isbn: string; // read only property
        display(): void; // function type/abstract method
    }

    let book1: book = {
        title: "The Great Gatsby",
        isbn: "978-3-16-148410-0",
        display() {
            console.log(""); 
            console.log("Implementing the interface in an object with function type");
            console.log(`Title: ${this.title}, ISBN: ${this.isbn}`);
        }
    };
    book1.display(); // Output: Title: The Great Gatsby, ISBN: 978-3-16-148410-0
    console.log("Book1 title:", book1.title); // Output: Book1 title: The Great Gatsby
    console.log("Book1 isbn:", book1.isbn); // Output: Book1 isbn: 978-3-16-148410-0
    // book1.isbn = "123-4-56-789012-3"; // Error: Cannot assign to 'isbn' because it is a read-only property.

// 3. Interface extending another interface
    interface Animal {
        name: string;
    }

    interface Dog extends Animal {
        breed: string;
        color: string;
    }

    let dog1: Dog = {
        name: "Buddy",
        breed: "Golden Retriever",
        color: "Golden"
    };

    console.log("");
    console.log("Interface extending another interface");
    console.log(dog1); // Output: { name: 'Buddy', breed: 'Golden Retriever', color: 'Golden' }
    console.log("Dog1 name:", dog1.name); // Output: Dog1 name: Buddy
    console.log("Dog1 breed:", dog1.breed); // Output: Dog1 breed: Golden Retriever
    console.log("Dog1 color:", dog1.color); // Output: Dog1 color: Golden

// 4. Implementing the interface in a class
    class Student implements Person {
        name: string;
        age: number;
        isStudent: boolean;
        city?: string;
        constructor(name: string, age: number, isStudent: boolean, city?: string) {
            this.name = name;
            this.age = age;
            this.isStudent = isStudent;
            this.city = city;
        }
    }

    let student1: Student = new Student("Bob", 22, true, "New York");
    let student2: Student = new Student("Bob", 22, false);
    console.log(""); 
    console.log("Implementing the interface in a class");
    console.log(student1); // Output: Student { name: 'Bob', age: 22, isStudent: true, city: 'New York' }
    console.log("Student1 name:", student1.name); // Output: Student1 name: Bob
    console.log("Student1 age:", student1.age); // Output: Student1 age: 22
    console.log("Student1 isStudent:", student1.isStudent); // Output: Student1 isStudent: true
    console.log("Student1 city:", student1.city); // Output: Student1 city: New York

    console.log("");
    console.log(student2); // Output: Student { name: 'Bob', age: 22, isStudent: false, city: undefined }
    console.log("Student2 name:", student2.name); // Output: Student2 name: Bob
    console.log("Student2 age:", student2.age); // Output: Student2 age: 22
    console.log("Student2 isStudent:", student2.isStudent); // Output: Student2 isStudent: false
    console.log("Student2 city:", student2.city); // Output: Student2 city: undefined 

    // Example:
    interface Animal {
        name: string;
        species: string;
        sound(): void; // Abstract method
    }

    class Dog implements Animal {
        name: string;
        species: string;
        color: string;
        static age: number; // Static property

        constructor(name: string, species: string, color: string, age?: number) {
            this.name = name;
            this.species = species;
            this.color = color;
            if (age !== undefined) {
                Dog.age = age;
            }
        }

        sound(): void {
            console.log(`${this.name} whose color is ${this.color} and age is ${Dog.age} says: Woof!`);
        }
    }
    let dog2: Dog = new Dog("Buddy", "Golden Retriever", "Golden", 5);
    console.log("");
    console.log("Implementing the interface with abstract method in a class");
    console.log(dog2); // Output: Dog { name: 'Buddy', species: 'Golden Retriever', color: 'Golden' }
    dog2.sound(); // Output: Buddy whose color is Golden and age is 5 says: Woof!
    console.log("Dog name:", dog2.name); // Output: Dog name: Buddy
    console.log("Dog species:", dog2.species); // Output: Dog species: Golden Retriever
    console.log("Dog color:", dog2.color); // Output: Dog color: Golden
    console.log("Dog age:", Dog.age); // Output: Dog age: 5
    console.log("Dog sound:"); dog2.sound(); // Output: Buddy whose color is Golden and age is 5 says: Woof!

    let dog3: Dog = new Dog("Buddy", "Golden Retriever", "Golden");
    console.log("");
    console.log(dog3); // Output: Dog { name: 'Buddy', species: 'Golden Retriever', color: 'Golden' }
    dog3.sound(); // Output: Buddy whose color is Golden and age is 5 says: Woof!
    console.log("Dog name:", dog3.name); // Output: Dog name: Buddy
    console.log("Dog species:", dog3.species); // Output: Dog species: Golden Retriever
    console.log("Dog color:", dog3.color); // Output: Dog color: Golden
    console.log("Dog age:", Dog.age); // Output: Dog age: 5
    // note: Since age is a static property, it retains the value assigned to it (5) even when a new instance of the Dog class is created without providing an age. 
    // Therefore, dog3 will also have access to the age property with the value of 5.
    console.log("Dog sound:"); dog3.sound(); // Output: Buddy whose color is Golden and age is 5 says: Woof!


