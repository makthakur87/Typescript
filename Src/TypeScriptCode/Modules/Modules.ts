// Modules: Modules are a way to organize code into separate files and namespaces. 
// They help in encapsulating code and avoiding naming conflicts. 
// In TypeScript, you can use the `export` and `import` keywords to create and use modules.

// Example of module declaration and usage:

// 1. Exporting a module
    // In a file named "Modules.ts"
    export let appName: string = "My TypeScript App";
    export let appName1: string = "Calculator";
    export function add (a: number, b: number): number {
        return a + b;
    }

    export class Formatter {
        static uppercase(str: string): string {
            return str.toUpperCase();
        }
    }

 




