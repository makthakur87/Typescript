export class CommonFunctions {
    private static instance: CommonFunctions | null = null;
    private randomUniqueNumber: string | null = null;

    private constructor() {}

    public static getInstance(): CommonFunctions {
        if (!CommonFunctions.instance) {
            CommonFunctions.instance = new CommonFunctions();
        }
        return CommonFunctions.instance;
    }

   // get numbers from string
   public getNumbersFromString(value: string): string {
      const numbers = value.match(/\d+/g);
      return numbers ? numbers.join("") : "";
    }

    // -----------------------------
    // Random Unique Number (ThreadLocal equivalent)
    // -----------------------------
    public getrandomUniqueNumber(): string | null {
        return this.randomUniqueNumber;
    }

    public setRandomUniqueNumber(randomUniqueNumber: string): void {
        this.randomUniqueNumber = randomUniqueNumber;
    }

    public getRandomNumber(): string {
        const min = 100000;  // 6 digits
        const max = 999999;  // 6 digits
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return String(num);
    }


    // -----------------------------
    // Recipient Creation (UI example)
    // -----------------------------
    public async createInteracRecipient(inputDataMap: any) {
        const page = inputDataMap.page;

        await page.goto("/recipient/create");
        await page.fill("#recipientName", inputDataMap.recipientName);
        await page.fill("#email", inputDataMap.email);
        await page.fill("#phone", inputDataMap.phone);
        await page.click("#saveRecipient");

        inputDataMap.profileName = `ProfileName_${inputDataMap.uniqueNumber}`;
    }

    // -----------------------------
    // Utility
    // -----------------------------
    public getStringValueFromMap(map: any, key: string): string {
        return map[key] ? String(map[key]) : "";
    }

    /**
     * Convert any value to a string representation.
     * 
     * @param value The value to be converted.
     * @returns A string representation of the value.
     */
    static convertToString(value: any): string {
    if (Array.isArray(value)) {
      return value.join(",");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Extracts all numbers from a string and returns them as a concatenated string.
   * 
   * @param value The input string containing numbers.
   * @returns A string containing only the numbers from the input string.
   */
   static getNumbersFromStr(value: string): string {
      const numbers = value.match(/\d+/g);
  
      return numbers ? numbers.join("") : "";
    }
  
    /**
     * Extracts all numbers from a string and returns them as a concatenated string.
     * 
     * @param str The input string containing numbers.
     * @returns A string containing only the numbers from the input string.
     */
    static getNumbersFromString(str: string): string {
      return str.replace(/\D/g, "").trim();
    }
  
    /**
     * Generates a random 6-digit number as a string.
     * 
     * @returns A string representing a random 6-digit number.
     */
    static getRandomNumber(): string {
      return Math.floor(Math.random() * 100000).toString();
    }
  
}