// src/config/utils/userLoader.ts
import * as fs from "fs";
import * as path from "path";

export type User = {
  loginUser: string;
  userName: string;
  userPassword: string;
  customerID: string;
  customerUserId: string;
  sendOnlyCustomer: boolean;
  solePropUser: boolean;
  enhancedCustomer: boolean;
  pegaOnboardedCustomer: boolean;
};

type UsersFile = {
  userList: User[];
};

export function loadUsers(envName: string, loginUser: string): User {
  // Example path: src/testData/ist-green/users.json
  const filePath = path.resolve(process.cwd(), "src", "testdata", envName, "users.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Users file not found for environment '${envName}' at path: ${filePath}`
    );
  }

  const content = fs.readFileSync(filePath, "utf-8");
  let parsed: UsersFile;

  try {
    parsed = JSON.parse(content) as UsersFile;
  } catch (err) {
    throw new Error(
      `Failed to parse users file for environment '${envName}' at path: ${filePath}. Error: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!parsed.userList || !Array.isArray(parsed.userList)) {
    throw new Error(
      `Invalid users file structure for environment '${envName}' at path: ${filePath}. Expected 'userList' array.`
    );
  }

  const user = parsed.userList.find((u) => u.loginUser === loginUser);
  if (!user) {
    throw new Error(
      `User with loginUser '${loginUser}' not found in users file for environment '${envName}' at path: ${filePath}`
    );
  }

  return user;
}