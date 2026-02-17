// Inheritance: is a fundamental object-oriented programming concept that allows a new class (called a child or subclass) 
// to inherit properties and behaviors (fields and methods) from an existing class (called a parent or superclass). 
// This promotes code reusability and establishes a natural hierarchical relationship between classes. 
// Inheritance enables the creation of more specific classes based on general ones, allowing for the extension 
// and customization of functionality without modifying the original class.

// Method overriding: is a feature of inheritance that allows a child class to provide a specific implementation of a method that is already defined in its parent class. 
// When a method in a child class has the same name, return type, and parameters as a method in the parent class, the child class's method overrides the parent class's method. 
// This allows the child class to provide its own behavior while still maintaining the same interface as the parent class.

// Example:
    class Animal {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        makeSound(): void {
            console.log(`${this.name} makes a sound.`);
        }
    }

    class Dog extends Animal {
        breed: string;
        constructor(name: string, breed: string) {
            super(name); // Call the constructor of the parent class
            this.breed = breed;
        }
        makeSound(): void {
            console.log(`${this.name} barks.`);
        }
    }

    let dog1 = new Dog("Buddy", "Golden Retriever");
    console.log("Using inheritance:");
    console.log("dog1:", dog1); // Output: Dog { name: 'Buddy', breed: 'Golden Retriever' }
    dog1.makeSound(); // Output: Buddy barks.

    // Parent class instance
    let animal1 = new Animal("Tomy");
    console.log("");
    console.log("Parent class instance:");
    console.log("animal1:", animal1); // Output: Animal { name: 'Tomy' }
    animal1.makeSound(); // Output: Tomy makes a sound.

    // Example:
    class Car {
        name: string;
        color: string;
        model: string;

        constructor(name: string, color: string, model: string) {
            this.name = name;
            this.color = color;
            this.model = model;
        }

        startEngine(): void {
            console.log("Car engine started.");
            console.log(`${this.name} engine started.`);
        }

        stopEngine(): void {
            console.log("Car engine stopped.");
            console.log(`${this.name} engine stopped.`);
        }

        displayInfo(): void {
            console.log(`Car Class: Car Name: ${this.name}, Color: ${this.color}, Model: ${this.model}`);
        }
    }

    // Child class that inherits from Car
    class Honda extends Car {
        year: number;
        constructor(name: string, color: string, model: string, year: number) {
            super(name, color, model); // Call the constructor of the parent class
            this.year = year;
        }

        startEngine(): void {
            console.log("Honda engine started.");
            console.log(`${this.name} engine started.`);
        }

        yearOfManufacture(): void {
            console.log(`Honda Class: Name: ${this.name}, Color: ${this.color}, Model: ${this.model}, Year: ${this.year}`);
        }
    }

    // child class that inherits from Car
    class Maruti extends Car {
        year: number;
        constructor(name: string, color: string, model: string, year: number) {
            super(name, color, model); // Call the constructor of the parent class
            this.year = year;
        }

        startEngine(): void {
            console.log("Maruti engine started.");
            console.log(`${this.name} engine started.`);
        }

        yearOfManufacture(): void {
            console.log(`Maruti Class: Name: ${this.name}, Color: ${this.color}, Model: ${this.model}, Year: ${this.year}`);
        }
    }

    // create honda car instance
    let honda1 = new Honda("Honda Civic", "Red", "Sedan", 2020);
    console.log("");
    console.log("Honda Car:");
    console.log(honda1.name); // Output: Honda Civic
    console.log(honda1.color); // Output: Red
    console.log(honda1.model); // Output: Sedan
    console.log(honda1.year); // Output: 2020
    honda1.yearOfManufacture();
    honda1.displayInfo();

    // create maruti car instance
    let maruti1 = new Maruti("Maruti Swift", "Blue", "Hatchback", 2018);
    console.log("");
    console.log("Maruti Car:");
    console.log(maruti1.name); // Output: Maruti Swift
    console.log(maruti1.color); // Output: Blue
    console.log(maruti1.model); // Output: Hatchback
    console.log(maruti1.year); // Output: 2018
    maruti1.yearOfManufacture();
    maruti1.displayInfo();

    // Call methods on the instances
    console.log("");
    console.log("Calling methods on Honda instance:");
    honda1.startEngine();
    honda1.stopEngine();

    console.log("");
    console.log("Calling methods on Maruti instance:");
    maruti1.startEngine();
    maruti1.stopEngine();

    // Parent class instance
    let car1 = new Car("VW Atlas", "White", "SUV");
    console.log("");
    console.log("Parent class instance:");
    console.log(car1); // Output: Car { name: 'VW Atlas', color: 'White', model: 'SUV' }
    car1.startEngine(); // Output: Car engine started. VW Atlas engine started.
    car1.stopEngine(); // Output: Car engine stopped. VW Atlas engine stopped.
    // car1.yearOfManufacture(); // Output: Name: VW Atlas, Color: White, Model: SUV, Year: undefined
    // note: yearOfManufacture() method is not accessible through the parent class reference (car1) because it is defined in the child classes (Honda and Maruti) and not in the parent class (Car).
    car1.displayInfo(); // Output: Car Name: VW Atlas, Color: White, Model: SUV

    // Child class instance from parent class reference
    let car2: Car = new Honda("Honda Accord", "Black", "Sedan", 2021);
    console.log("");
    console.log("Child class instance from parent class reference:");
    console.log(car2); // Output: Honda { name: 'Honda Accord', color: 'Black', model: 'Sedan', year: 2021 }
    car2.startEngine(); // Output: Honda engine started. Honda Accord engine started.
    car2.stopEngine(); // Output: Car engine stopped. Honda Accord engine stopped.
    // car2.yearOfManufacture(); // Output: Name: Honda Accord, Color: Black, Model: Sedan, Year: 2021
    // Note: yearOfManufacture() method is not accessible through the parent class reference (car2) because it is defined in the child class (Honda) and not in the parent class (Car).
    car2.displayInfo(); // Output: Name: Honda Accord, Color: Black, Model: Sedan, Year: 2021

    let car3: Car = new Maruti("Maruti Dzire", "Silver", "Sedan", 2019);
    console.log("");
    console.log("Child class instance from parent class reference:");
    console.log(car3); // Output: Maruti { name: 'Maruti Dzire', color: 'Silver', model: 'Sedan', year: 2019 }
    car3.startEngine(); // Output: Maruti engine started. Maruti Dzire engine started.
    car3.stopEngine(); // Output: Car engine stopped. Maruti Dzire engine stopped.
    // car3.yearOfManufacture(); // Output: Name: Maruti Dzire, Color: Silver, Model: Sedan, Year: 2019. 
    // Note: yearOfManufacture() method is not accessible through the parent class reference (car3) because it is defined in the child class (Maruti) and not in the parent class (Car).
    car3.displayInfo(); // Output: Name: Maruti Dzire, Color: Silver, Model: Sedan, Year: 2019

    // super keyword: is used in a child class to refer to the parent class. 
    // It can be used to call the constructor of the parent class, access properties and methods of the parent class, and invoke overridden methods in the parent class.
    // super can not be used to invoke the parent class's properties (In Java, It is possible)
    // Example:
    class Parent {
        number: number = 10;
        
        constructor() {
            console.log("This is Parent class constructor....");
        }

        displayNumber(): void {
            console.log("This is display() method from Parent class....");
        }
     }

     class Child extends Parent {
        number: number = 20;

        constructor() {
            super(); // Call the constructor of the parent class
            console.log("This is Child constructor....");
        }

        showNumbers(): void {
            // console.log(super.number); // Output: 10 (accessing the number property of the parent class)
            // note: In TypeScript, you cannot directly access the parent class's properties using super.propertyName. 
            // Instead, you can call a method in the parent class that returns the value of the property, or you can use a getter method to access the property.
            console.log(this.number); // Output: 20 (accessing the number property of the child class)
            console.log("This is showNumbers() method from Child class....");
        }

        displayNumber(): void {
            super.displayNumber(); // Call the displayNumber() method of the parent class
            console.log("This is display() method from Child class....");
        }
    }

    let child1 = new Child(); // Output: Parent constructor called. Child constructor called.
    console.log("");
    console.log("Using super keyword:");
    child1.showNumbers(); // Output: 20 This is showNumbers() method from Child class....
    child1.displayNumber(); 
    // Output: This is display() method from Parent class....
    //         This is display() method from Child class....

// Access modifiers (public, private, protected): are keywords used to control the visibility and accessibility of class members (properties and methods).
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

        // Method to display student information
        displayInfo(): void {
            console.log("");
            console.log("Student Information:");
            console.log("Student ID:", this.studentId); // Accessing private property within the class
            console.log("Name:", this.name); // Accessing public property within the class
            console.log("Email:", this.email); // Accessing protected property within the class
            console.log("School Name:", StudentWithAccessModifiers.schoolName); // Accessing static property within the class
        }
    }

    class GraduateStudent extends StudentWithAccessModifiers {
         private degree: string;

        constructor(studentId: number, name: string, schoolName: string, degree: string, email?: string) {
            super(studentId, name, schoolName, email);
            this.degree = degree;
        }

        // Method to display graduate student information
        displayGraduateInfo(): void {
            console.log("");
            console.log("Graduate Student Information:");
            // console.log("Student ID:", this.studentId); // Error: Property 'studentId' is private and only accessible within class 'StudentWithAccessModifiers'.
            console.log("Name:", this.name); // Accessing public property from parent class
            console.log("Email:", this.email); // Accessing protected property from parent class
            console.log("School Name:", StudentWithAccessModifiers.schoolName); // Accessing static property from parent class
            console.log("Degree:", this.degree); // Accessing private property within the class
        }
    }

    let student1 = new StudentWithAccessModifiers(1, "Alice", "Greenwood High School", "alice@example.com");
    student1.displayInfo();

    let graduateStudent1 = new GraduateStudent(2, "Bob", "Greenwood High School", "Master's", "bob@example.com");
    graduateStudent1.displayGraduateInfo();

    console.log("");
    console.log("Accessing properties from outside the class:");
    console.log(student1.name); // Output: Alice (accessing public property)
    // console.log(student1.studentId); // Error: Property 'studentId' is private and only accessible within class 'StudentWithAccessModifiers'.
    // console.log(student1.email); // Error: Property 'email' is protected and only accessible within class 'StudentWithAccessModifiers' and its subclasses.
    console.log(StudentWithAccessModifiers.schoolName); // Output: Greenwood High School (accessing static property)
    console.log(GraduateStudent.schoolName); // Output: Greenwood High School (accessing static property through subclass)
    // console.log(graduateStudent1.degree); // Error: Property 'degree' is private and only accessible within class 'GraduateStudent'.

