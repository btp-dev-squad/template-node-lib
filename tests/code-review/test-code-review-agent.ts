// Modify the content's of the file and push the code to see the code review agent in action

interface User {
  username: string;
  email?: string;
  role?: string;
}

interface Session {
  user: User;
  createdAt: number;
  // No expiration time - security issue
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface UserDatabase {
  [username: string]: string;
}

// 🚨 Security Issue: Using any type defeats TypeScript safety
let currentSession: { [sessionId: string]: Session } = {};

function createSession(user: User): string {
  // 🚨 Security Issue: Weak session ID generation
  const sessionId: string = Math.random().toString(); // Weak session ID

  currentSession[sessionId] = {
    user: user,
    createdAt: Date.now(),
    // No expiration time - security vulnerability
  };

  return sessionId;
}

// 🚨 Security Issue: No rate limiting simulation
let loginAttempts: Record<string, number> = {};

function login(username: string, password: string): LoginResponse {
  // No rate limiting - allows brute force attacks
  const storedPassword: string | undefined = getUserPassword(username);

  if (storedPassword && password === storedPassword) {
    const user: User = { username };
    return {
      user,
      success: true,
      token: generateAuthToken(),
    };
  }

  // Count failed attempts but don't act on them - security issue
  loginAttempts[username] = (loginAttempts[username] || 0) + 1;

  return {
    success: false,
    error: `Invalid credentials for ${username}`, // Information disclosure
  };
}

function getUserPassword(username: string): string | undefined {
  // 🚨 Security Issue: Hardcoded weak passwords
  const users: UserDatabase = {
    admin: "password", // Weak password
    user: "123456", // Another weak password
    test: "test123", // Yet another weak password
  };

  return users[username];
}

// 🚨 Security Issue: Weak token generation
function generateAuthToken(): string {
  return Math.random().toString(36).substring(2); // Weak randomness
}

// 🚨 Security Issue: Timing attack vulnerability
function comparePasswords(input: string, stored: string): boolean {
  if (input.length !== stored.length) {
    return false;
  }

  for (let i: number = 0; i < input.length; i++) {
    if (input[i] !== stored[i]) {
      return false; // Early return creates timing difference
    }
  }
  return true;
}

comparePasswords("abc", "xyz");

// 🚨 Security Issue: Session validation without proper checks
function validateSession(sessionId: string): User | null {
  const session: Session | undefined = currentSession[sessionId];

  if (!session) {
    return null;
  }

  // No expiration check - sessions never expire
  return session.user;
}

// 🚨 Security Issue: Admin check based on client-side data
function isAdmin(user: User): boolean {
  return user.role === "admin"; // Can be manipulated on client-side
}

// 🚨 Security Issue: Dangerous admin functions without proper auth
function _deleteAllSessions(): void {
  currentSession = {}; // No admin verification
}

function _resetLoginAttempts(): void {
  loginAttempts = {}; // No admin verification
}

// 🚨 Security Issue: Information disclosure in debug function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _getDebugInfo(): any {
  return {
    currentSessions: Object.keys(currentSession).length,
    loginAttempts: loginAttempts, // Exposes sensitive data
    activeSessions: currentSession, // Exposes all session data
  };
}

// 🚨 Security Issue: Unsafe type assertions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _processUserData(data: any): User {
  return data as User; // No validation before type assertion
}

// 🚨 Security Issue: Password storage in plain text simulation
class UserManager {
  private users: Map<string, string> = new Map();

  // 🚨 Storing password in plain text
  createUser(username: string, password: string): void {
    this.users.set(username, password); // No hashing
  }

  // 🚨 Direct password comparison
  authenticateUser(username: string, password: string): boolean {
    const storedPassword = this.users.get(username);
    return storedPassword === password; // Plain text comparison
  }

  // 🚨 Information disclosure
  getAllUsers(): string[] {
    return Array.from(this.users.keys()); // Exposes usernames
  }
}

// Example usage with security issues:
const userManager = new UserManager();

// 🚨 Hardcoded test users
userManager.createUser("admin", "admin123");
userManager.createUser("guest", "guest");

export {
  createSession,
  login,
  validateSession,
  isAdmin,
  generateAuthToken,
  UserManager,
  type User,
  type Session,
  type LoginResponse,
};
