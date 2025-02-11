import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import request from 'supertest';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../src/server/services/taskService";
import taskHandler from "../../src/server/api/task";
import { createApp, toNodeListener } from 'h3';

const prisma = new PrismaClient();

const app = createApp();
app.use('/api/task', taskHandler);
const server = toNodeListener(app);

// 認証をモック
vi.mock("../../src/server/utils/auth", () => ({
  useAuth: vi.fn(() => Promise.resolve()),
}));

// 各サービスメソッドをモック
vi.mock("../../src/server/services/taskService", () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("Task API Handler", () => {
  let testUserId: number;
  let testTaskId: number;

  beforeAll(async () => {
    // テスト用のユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        detail: "Test user details",
        status: "active",
        role: "user",
        isActive: true,
        lastLogin: new Date(),
      },
    });
    testUserId = user.id;

    // テスト用のタスクを作成
    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        detail: "Test task detail",
        evaluationFactor: 5,
        userId: testUserId,
        status: "run",
      },
    });
    testTaskId = task.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return tasks for a valid user ID (GET)", async () => {
    const mockTasks = [
      {
        id: testTaskId,
        title: "Test Task",
        detail: "Test task detail",
        evaluationFactor: 5,
        userId: testUserId,
        status: "run",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(getTasks).mockResolvedValue(mockTasks);

    const response = await request(server).get("/api/task").query({ userId: testUserId.toString() });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tasks");
    expect(response.body.tasks).toEqual(
      mockTasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }))
    );
  });

  it("should create a new task (POST)", async () => {
    const newTask = {
      id: 2,
      title: "New Task",
      detail: "New task detail",
      evaluationFactor: 3,
      userId: testUserId,
      status: "run",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(createTask).mockResolvedValue(newTask);

    const response = await request(server)
      .post("/api/task")
      .send({
        title: newTask.title,
        detail: newTask.detail,
        evaluationFactor: newTask.evaluationFactor,
        userId: testUserId,
      });

    expect(response.body.status).toBe(201);
    expect(response.body).toHaveProperty("task");
    expect(response.body.task).toEqual({
      ...newTask,
      createdAt: newTask.createdAt.toISOString(),
      updatedAt: newTask.updatedAt.toISOString(),
    });
  });

  it("should update a task successfully (PUT)", async () => {
    const updatedTask = {
      id: testTaskId,
      title: "Updated Task",
      detail: "Updated task detail",
      evaluationFactor: 4,
      userId: testUserId,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    vi.mocked(updateTask).mockResolvedValue(updatedTask);
  
    const response = await request(server).put("/api/task").send({
      id: testTaskId,
      title: updatedTask.title,
      detail: updatedTask.detail,
      evaluationFactor: updatedTask.evaluationFactor,
      status: updatedTask.status,
      userId: testUserId,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("task");
    expect(response.body.task).toEqual({
      ...updatedTask,
      createdAt: updatedTask.createdAt.toISOString(),
      updatedAt: updatedTask.updatedAt.toISOString(),
    });
  });

  it("should return 400 when task ID is missing in PUT request", async () => {
    const response = await request(server).put("/api/task").send({
      title: "Updated Task",
      detail: "Updated task detail",
      evaluationFactor: 3,
      status: "completed",
      userId: testUserId,
    });

    expect(response.body.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task ID is required for update");
  });

  it("should delete a task successfully (DELETE)", async () => {
    vi.mocked(deleteTask).mockResolvedValue(undefined);
  
    const response = await request(server).delete("/api/task").query({ id: testTaskId.toString() });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Task deleted successfully");
  });

  it("should return 400 when task ID is missing in DELETE request", async () => {
    const response = await request(server).delete("/api/task");

    expect(response.body.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task ID is required for deletion");
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const response = await request(server).patch("/api/task");

    expect(response.body.status).toBe(405);
    expect(response.body).toHaveProperty("message", "Method Not Allowed");
  });

});
