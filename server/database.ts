import { createClient } from "@libsql/client";
import { User } from "./types";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { DATABASE_URL, DATABASE_API_KEY } from "./utils/constants";
// import { sendEmail } from "./utils/email";

if (!DATABASE_URL || !DATABASE_API_KEY) {
  throw new Error("DATABASE_URL and DATABASE_API_KEY must be set");
}

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_API_KEY,
});

export type TursoResponse<T> = T | { message: string; code: number };

export function isError<T>(
  response: TursoResponse<T>
): response is { message: string; code: number } {
  return (
    typeof response === "object" &&
    response !== null &&
    "message" in response &&
    "code" in response
  );
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePasswords(plain: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}

function generateConfirmationCode(): string {
  const vaildChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += vaildChars.charAt(Math.floor(Math.random() * vaildChars.length));
  }
  return code;
}

export const turso = {
  // Auth

  login: async (
    email: string,
    password: string
  ): Promise<TursoResponse<User>> => {
    try {
      const rs = await client.execute({
        sql: "SELECT * FROM users WHERE email = ?",
        args: [email],
      });
      if (rs.rows.length === 0) {
        return { code: 401, message: "No user with this email" };
      }
      const passwordsMatch = await comparePasswords(
        password,
        rs.rows[0].password as string
      );
      if (!passwordsMatch) {
        return { code: 401, message: "Incorrect email or password" };
      }
      const newToken = v4();
      await client.execute({
        sql: "UPDATE users SET token = ? WHERE id = ?",
        args: [newToken, rs.rows[0].id],
      });
      const user: User = {
        id: rs.rows[0].id as string,
        name: rs.rows[0].name as string,
        email: rs.rows[0].email as string,
        createdAt: rs.rows[0].created_at as number,
        updatedAt: rs.rows[0].updated_at as number,
        subscriptionStart: rs.rows[0].subscription_start as number | null,
        subscriptionEnd: rs.rows[0].subscription_end as number | null,
        paidGenerates: rs.rows[0].paid_generates as number,
        freeGenerates: rs.rows[0].free_generates as number,
      };
      return user;
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to fetch user" };
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    id = v4()
  ): Promise<TursoResponse<User>> => {
    try {
      const rs = await client.execute({
        sql: "SELECT id FROM users WHERE email = ?",
        args: [email],
      });
      if (rs.rows.length !== 0) {
        return {
          code: 400,
          message: "Email already registered with an account",
        };
      }
      const hashedPassword = await hashPassword(password);
      const token = v4();
      const currentTime = Date.now();
      const code = generateConfirmationCode();
      const rs2 = await client.execute({
        sql: `
          INSERT INTO users
            (
              id,
              name,
              email,
              password,
              confirmation_code,
              created_at,
              updated_at,
              paid_generates,
              free_generates
            )
          VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          id,
          name,
          email,
          hashedPassword,
          code,
          currentTime,
          currentTime,
          0,
          1,
        ],
      });
      if (rs2.rowsAffected !== 1) {
        return { code: 500, message: "Failed to register user" };
      }
      return {
        id,
        name,
        email,
        createdAt: currentTime,
        updatedAt: currentTime,
        subscriptionStart: null,
        subscriptionEnd: null,
        paidGenerates: 0,
        freeGenerates: 0,
      };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to create user" };
    }
  },

  loginWithUserId: async (userId: string): Promise<TursoResponse<User>> => {
    try {
      const rs = await client.execute({
        sql: "SELECT * FROM users WHERE id = ?",
        args: [userId],
      });
      if (rs.rows.length === 0) {
        return { code: 401, message: "No user with this token" };
      }
      const user: User = {
        id: rs.rows[0].id as string,
        name: rs.rows[0].name as string,
        email: rs.rows[0].email as string,
        createdAt: rs.rows[0].created_at as number,
        updatedAt: rs.rows[0].updated_at as number,
        subscriptionStart: rs.rows[0].subscription_start as number | null,
        subscriptionEnd: rs.rows[0].subscription_end as number | null,
        paidGenerates: rs.rows[0].paid_generates as number,
        freeGenerates: rs.rows[0].free_generates as number,
      };
      return user;
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to fetch user" };
    }
  },

  // Pay

  subscribe: async (
    userId: string,
    duration: number
  ): Promise<TursoResponse<string>> => {
    try {
      const subscriptionStart = Date.now();
      const subscriptionEnd = subscriptionStart + duration;
      const rs = await client.execute({
        sql: `
          UPDATE users
            SET subscription_start = ?,
            subscription_end = ?,
            updated_at = ?
          WHERE
            id = ?
        `,
        args: [subscriptionStart, subscriptionEnd, subscriptionStart, userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to create subscription" };
    }
  },

  unsubscribe: async (userId: string): Promise<TursoResponse<string>> => {
    try {
      const currentTime = Date.now();
      const rs = await client.execute({
        sql: `
          UPDATE users
            SET subscription_start = NULL,
            subscription_end = NULL,
            updated_at = ?
          WHERE
            id = ?
        `,
        args: [currentTime, userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to delete subscription" };
    }
  },

  buyGenerate: async (userId: string): Promise<TursoResponse<string>> => {
    try {
      const rs = await client.execute({
        sql: "UPDATE users SET paid_generates = paid_generates + 1 WHERE id = ?",
        args: [userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to buy generate" };
    }
  },

  // Generate

  usePaidGenerate: async (userId: string): Promise<TursoResponse<string>> => {
    try {
      const rs = await client.execute({
        sql: "UPDATE users SET paid_generates = paid_generates - 1 WHERE id = ?",
        args: [userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to use generate" };
    }
  },

  useFreeGenerate: async (userId: string): Promise<TursoResponse<string>> => {
    try {
      const rs = await client.execute({
        sql: "UPDATE users SET free_generates = free_generates - 1 WHERE id = ?",
        args: [userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to use generate" };
    }
  },

  // Misc

  deleteUser: async (userId: string): Promise<TursoResponse<string>> => {
    try {
      const rs = await client.execute({
        sql: "DELETE FROM users WHERE id = ?",
        args: [userId],
      });
      if (rs.rowsAffected === 0) {
        return { code: 404, message: "No user with this id" };
      }
      return "Success";
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Failed to delete user" };
    }
  },
};

export async function createTables() {
  try {
    const sql = `
DROP TABLE users;
DROP TABLE classes;
DROP TABLE flashcards;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  subscription_start INTEGER,
  subscription_end INTEGER
);
`;
    return await client.executeMultiple(sql);
  } catch (error) {
    console.error(error);
  }
}
