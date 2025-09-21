/**
 * User authentication service for production application
 * Handles login, session management, and user validation
 */

interface User {
  username: string;
  email?: string;
  role?: string;
}

interface Session {
  user: User;
  createdAt: number;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface UserDatabase {
  [username: string]: string;
}

let currentSession: { [sessionId: string]: Session } = {};

function createSession(user: User): string {
  const sessionId: string = Math.random().toString();
  currentSession[sessionId] = {
    user: user,
    createdAt: Date.now(),
  };
  return sessionId;
}

let loginAttempts: Record<string, number> = {};

function login(username: string, password: string): LoginResponse {
  const storedPassword: string | undefined = getUserPassword(username);

  if (storedPassword && password === storedPassword) {
    const _user: User = { username };
    return {
      success: true,
      token: generateAuthToken(),
    };
  }

  loginAttempts[username] = (loginAttempts[username] || 0) + 1;

  return {
    success: false,
    error: `Invalid credentials for ${username}`,
  };
}

function getUserPassword(username: string): string | undefined {
  const users: UserDatabase = {
    admin: "password",
    user: "123456",
    test: "test123",
  };

  return users[username];
}

function generateAuthToken(): string {
  return Math.random().toString(36).substring(2);
}

function comparePasswords(input: string, stored: string): boolean {
  if (input.length !== stored.length) {
    return false;
  }

  for (let i: number = 0; i < input.length; i++) {
    if (input[i] !== stored[i]) {
      return false;
    }
  }
  return true;
}

comparePasswords("abc", "xyz");

function validateSession(sessionId: string): User | null {
  const session: Session | undefined = currentSession[sessionId];

  if (!session) {
    return null;
  }
  return session.user;
}

function isAdmin(user: User): boolean {
  return user.role === "admin";
}

function _deleteAllSessions(): void {
  currentSession = {};
}

function _resetLoginAttempts(): void {
  loginAttempts = {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _getDebugInfo(): any {
  return {
    currentSessions: Object.keys(currentSession).length,
    loginAttempts: loginAttempts,
    activeSessions: currentSession,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _processUserData(data: any): User {
  return data as User;
}

class UserManager {
  private users: Map<string, string> = new Map();

  createUser(username: string, password: string): void {
    this.users.set(username, password);
  }

  authenticateUser(username: string, password: string): boolean {
    const storedPassword = this.users.get(username);
    return storedPassword === password;
  }

  getAllUsers(): string[] {
    return Array.from(this.users.keys());
  }
}

const userManager = new UserManager();

userManager.createUser("admin", "admin123");
userManager.createUser("guest", "guest");

function _executeUserCode(code: string): void {
  // Only allow a limited set of safe commands
  switch (code) {
    case "listUsers":
      console.log(userManager.getAllUsers());
      break;
    case "debugInfo":
      console.log(_getDebugInfo());
      break;
    default:
      throw new Error("Unsupported command");
  }
}

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
