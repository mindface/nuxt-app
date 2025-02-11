import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
// import { PrismaClient } from "@prisma/client";
import userHandler from "../../src/server/api/user";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/server/services/userService";
import { createApp, toNodeListener } from 'h3';

const app = createApp();
app.use('/api/user', userHandler);
const server = toNodeListener(app);

vi.mock("../../src/server/utils/auth", () => ({
  useAuth: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../src/server/services/userService", () => ({
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

describe("User API Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a user for a valid user ID (GET)", async () => {
    const mockUser = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      detail: "Some details",
      status: "active",
      role: "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(getUserById).mockResolvedValue(mockUser);

    const response = await request(server)
      .get("/api/user")
      .set("Authorization", "Bearer test-token")
      .query({ id: "1" });

    expect(response.body.status).toBe(200);
    expect(response.body).toEqual({ 
      status: 200,
      user: {
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(), // toISOString() を使って文字列に変換
        updatedAt: mockUser.updatedAt.toISOString(),
      }
    });
  });

  it("should return 400 if user ID is missing in GET request", async () => {
    const response = await request(server)
      .get("/api/user")
      .set("Authorization", "Bearer test-token");
    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({ status: 400, message: "User ID is required" });
  });

  it("should create a new user (POST)", async () => {
    const newUser = {
      id: 2,
      name: "New User",
      email: "new@example.com",
      password: "hashedpassword",
      detail: "Some details",
      status: "active",
      role: "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(createUser).mockResolvedValue(newUser);

    const response = await request(server)
      .post("/api/user")
      .set("Authorization", "Bearer test-token")
      .send({
        name: "New User",
        email: "new@example.com",
        password: "securepassword",
      });

    expect(response.body.status).toBe(201);
    expect(response.body).toEqual({
      status: 201,
      user: {
        ...newUser,
        createdAt: newUser.createdAt.toISOString(), // toISOString() を使って文字列に変換
        updatedAt: newUser.updatedAt.toISOString(),
      }
    });
  });

  it("should return 400 if required fields are missing in POST request", async () => {
    const response = await request(server)
      .post("/api/user")
      .set("Authorization", "Bearer test-token")
      .send({ name: "New User" });
    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Name, email, and password are required",
    });
  });

  it("should update a user (PUT)", async () => {
    const updatedUser = {
      id: 1,
      name: "Updated User",
      email: "updated@example.com",
      password: "hashedpassword",
      detail: "Some details",
      status: "active",
      role: "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(updateUser).mockResolvedValue(updatedUser);

    const response = await request(server)
      .put("/api/user")
      .set("Authorization", "Bearer test-token")
      .send({
        id: 1,
        name: "Updated User",
        email: "updated@example.com",
      });

    expect(response.body.status).toBe(200);
    expect(response.body).toEqual({ 
      status: 200,
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(), // toISOString() を使って文字列に変換
        updatedAt: updatedUser.updatedAt.toISOString(),
      }
    });
  });

  it("should return 400 if user ID is missing in PUT request", async () => {
    const response = await request(server)
      .put("/api/user")
      .set("Authorization", "Bearer test-token")
      .send({ name: "Updated User" });
    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({ status: 400, message: "User ID is required for update" });
  });

  it("should delete a user (DELETE)", async () => {
    vi.mocked(deleteUser).mockResolvedValue(undefined);

    const response = await request(server)
      .delete("/api/user")
      .set("Authorization", "Bearer test-token")
      .query({ id: "1" });
    expect(response.body.status).toBe(200);
    expect(response.body).toEqual({ status: 200, message: "User deleted successfully" });
  });

  it("should return 400 if user ID is missing in DELETE request", async () => {
    const response = await request(server)
      .delete("/api/user")
      .set("Authorization", "Bearer test-token");
    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({ status: 400, message: "User ID is required for deletion" });
  });
});

