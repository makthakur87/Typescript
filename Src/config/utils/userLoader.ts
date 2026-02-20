import fs from "fs";
import path from "path";

interface User {
  loginUser: string;
  userName: string;
  userPassword: string;
  customerID: string;
  customerUserId: string;
  sendOnlyCustomer: boolean;
  solePropUser: boolean;
  enhancedCustomer: boolean;
  pegaOnboardedCustomer: boolean;
}

export function getUser(env: string, loginAlias: string): User {
  env = env.trim();
  loginAlias = loginAlias.trim();

  const file = path.resolve(process.cwd(), `src/testdata/${env}/users.json`);
  console.log(">>> Looking for user file:", file);
  console.log("CWD:", process.cwd());

  if (!fs.existsSync(file)) {
    throw new Error(`User file not found for environment: ${env}`);
  }

  const json = JSON.parse(fs.readFileSync(file, "utf-8"));

  const users: User[] = json.userList;

  const user = users.find((u: User) => u.loginUser === loginAlias);

  if (!user) {
    console.log(">>> Available loginUser values:", users.map(u => u.loginUser));
    throw new Error(`Login alias '${loginAlias}' not found in ${env}/users.json`);
  }

  return user;
}