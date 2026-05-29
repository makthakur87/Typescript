import * as fs from "fs";
import * as path from "path";

export type User = {
  loginUser: string;
  userName: string;
  userPassword: string;
  customerID: string;
  customerUserId: string;
  enhancedCustomer: boolean;
};

type UsersFile = {
  userList: User[];
};

function getUsersFilePath(envName: string): string {
  return path.resolve(process.cwd(), "src", "testdata", envName, "users.json");
}

export function loadUsers(envName: string, loginUser: string): User {
  // Example path: src/testData/ist-green/users.json
  const filePath = getUsersFilePath(envName);

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

let userPoolIndex = 0;

export function getUserFromPool(envName: string) {
  const filePath = getUsersFilePath(envName);
  const content = fs.readFileSync(filePath, "utf-8");
  let parsed: UsersFile;
  try {
    parsed = JSON.parse(content) as UsersFile;
  } catch (err) {
    throw new Error(
      `Failed to parse users file for enviornment '${envName}' as path '${filePath}': Error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  const users = parsed.userList;

  if (!users || users.length === 0) {
    throw new Error(`User pool is empty for environment: ${envName}`);
  }

  const user = users[userPoolIndex % users.length];
  userPoolIndex++;
  return user.loginUser;
}