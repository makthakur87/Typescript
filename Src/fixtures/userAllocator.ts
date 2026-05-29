export class UserAllocator {
  private static inUse = new Set<string>();

  static acquire(loginUser: string) {
    if (this.inUse.has(loginUser)) {
      throw new Error(
        `User '${loginUser}' is already in use by another worker. ` +
        `SSO prevents concurrent sessions.`
      );
    }
    this.inUse.add(loginUser);
  }

  static release(loginUser: string) {
    this.inUse.delete(loginUser);
  }
}