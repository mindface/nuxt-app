import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import request from 'supertest';
import TaskEvaluationsService from "../../src/server/services/taskEvaluationsService";
import taskEvaluationHandler from "../../src/server/api/taskEvaluation";
import { createApp, toNodeListener } from 'h3';

import type { TaskEvaluation } from "../../src/types/TaskEvaluation";

const prisma = new PrismaClient();

const app = createApp();
app.use('/api/taskEvaluation', taskEvaluationHandler);
const server = toNodeListener(app);

// 認証をモック
vi.mock("../../src/server/utils/auth", () => ({
  useAuth: vi.fn(() => Promise.resolve()),
}));

// 各サービスメソッドをモック
vi.mock("../../src/server/services/taskEvaluationsService", () => {
  return {
    default: {
      getTaskAllEvaluation: vi.fn(),
      getTaskEvaluations: vi.fn(),
      getTaskEvaluationById: vi.fn(),
      createTaskEvaluation: vi.fn(),
      updateTaskEvaluation: vi.fn(),
      deleteTaskEvaluation: vi.fn(),
    },
  };
});


describe("Task API Handler", () => {
  let testUserId: number;
  let testTaskId: number;
  let testTaskEvaluationId: number;
  let testTaskEvaluation: any;

  beforeAll(async () => {
    // const user = await prisma.user.create({
    //   data: {
    //     name: "Test User",
    //     email: "test@example.com",
    //     password: "hashedpassword",
    //     detail: "Test user details",
    //     status: "active",
    //     role: "user",
    //     isActive: true,
    //     lastLogin: new Date(),
    //   },
    // });
    // testUserId = user.id;

    // const task = await prisma.task.create({
    //   data: {
    //     title: "Test Task",
    //     detail: "Task detail",
    //     evaluationFactor: 10,
    //     userId: testUserId,
    //     status: "run",
    //   },
    // });
    // testTaskId = task.id;

    // const taskEvaluation = await prisma.taskEvaluation.create({
    //   data: {
    //     taskId: task.id,
    //     userId: user.id,
    //     content: "content",
    //     effect: "effect",
    //     accuracy: 5,
    //     impact: 5,
    //   },
    // });
    // testTaskEvaluationId = taskEvaluation.id;
    // await expect(
    //   prisma.$transaction(async (prisma) => {
    //     const user = await prisma.user.create({
    //       data: {
    //         name: "Rollback Test",
    //         email: "rollback@example.com",
    //         password: "hashedpassword",
    //         detail: "Should rollback",
    //         status: "active",
    //         role: "user",
    //         isActive: true,
    //         lastLogin: new Date(),
    //       },
    //     });
  
    //     await prisma.task.create({
    //       data: {
    //         title: "Rollback Task",
    //         detail: "This task should not exist after rollback",
    //         evaluationFactor: 10,
    //         user: { connect: { id: user.id } },
    //         status: "run",
    //       },
    //     });
  
    //     throw new Error("Intentional rollback error"); // ここでエラー発生
    //   })
    // ).rejects.toThrow("Intentional rollback error");
    
    const [user, task, taskEvaluation] = await prisma.$transaction(async (pt) => {
      const user = await pt.user.create({
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
  
      const task = await pt.task.create({
        data: {
          title: "Test Task",
          detail: "Task detail",
          evaluationFactor: 10,
          user: { connect: { id: user.id } },
          status: "run",
        },
      });
  
      const taskEvaluation = await pt.taskEvaluation.create({
        data: {
          user: { connect: { id: user.id } },
          task: { connect: { id: task.id } },
          content: "content",
          effect: "effect",
          accuracy: 5,
          impact: 5,
        },
      });
  
      return [user, task, taskEvaluation];
    });

    testUserId = user.id;
    testTaskId = task.id;
    testTaskEvaluationId = taskEvaluation.id;

  });

  afterAll(async () => {
    await prisma.task.deleteMany({
      where: {
        userId: testUserId
      },
    });
    await prisma.taskEvaluation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return all task evaluations for a valid user ID (GET)", async () => {
    const mockEvaluations = [{
      id: 1,
      userId: testUserId,
      taskId: testTaskId,
      content: "New Evaluation",
      effect: "Neutral",
      accuracy: 5,
      impact: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [{
        id: 1,
        taskEvaluationId: 2,
        tagId: 1,
        tag: { 
          id: 1,
          key: "key",
          industry: "industry",
          label: "label",
        },
        createdAt: new Date(),
      }],
    }];

    vi.mocked(TaskEvaluationsService.getTaskAllEvaluation).mockResolvedValue(mockEvaluations);

    const response = await request(server).get("/api/taskEvaluation").query({ userId: testUserId });

    expect(response.body.status).toBe(200);
    expect(response.body.taskEvaluation).toEqual(mockEvaluations.map((mockEvaluation) => ({
      ...mockEvaluation,
        createdAt: mockEvaluation.createdAt.toISOString(),
        updatedAt: mockEvaluation.updatedAt.toISOString(),
        tags: mockEvaluation.tags.map((tag) => ({
          ...tag,
          createdAt: tag.createdAt.toISOString(),
        }))
      }))
    );
  });

  it("should return a single task evaluation by ID (GET)", async () => {
    const taskEvaluation = {
      id: 1,
      userId: testUserId,
      taskId: testTaskId,
      content: "New Task Evaluation",
      effect: "Positive",
      accuracy: 5,
      impact: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [
        {
          id: 1,
          taskEvaluationId: 2,
          tagId: 1,
          tag: { 
            id: 1,
            key: "key",
            industry: "industry",
            label: "label",
          },
          createdAt: new Date(),
        },
      ],
      task: {
        id: 1,
        userId: testUserId,
        status: "active",
        title: "Task Title",
        detail: "Task Details",
        evaluationFactor: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: testUserId,
        name: "Test User",
        email: "test@example.com",
        detail: "detail",
	      role: "user",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        password: "password123",
      }
    };
    vi.mocked(TaskEvaluationsService.getTaskEvaluationById).mockResolvedValue(taskEvaluation);

    const response = await request(server).get(`/api/taskEvaluation?taskId=${testTaskId}`);
    expect(response.body.status).toBe(200);
    expect(response.body.taskEvaluation).toEqual({
      ...taskEvaluation,
      createdAt: taskEvaluation.createdAt.toISOString(),
      updatedAt: taskEvaluation.updatedAt.toISOString(),
      tags: taskEvaluation.tags.map((tag) => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
      })),
      task: {
        ...taskEvaluation.task,
        createdAt: taskEvaluation.task.createdAt.toISOString(),
        updatedAt: taskEvaluation.task.updatedAt.toISOString(),
      },
      user: {
        ...taskEvaluation.user,
        createdAt: taskEvaluation.user.createdAt.toISOString(),
        updatedAt: taskEvaluation.user.updatedAt.toISOString(),
        lastLogin: taskEvaluation.user.lastLogin.toISOString(),
      }
    });
  });

  it("should create a new task evaluation (POST)", async () => {
    const addTaskEvaluation = {
      userId: testUserId,
      taskId: testTaskId,
      content: "New Task Evaluation",
      effect: "Positive",
      accuracy: 5,
      impact: 4,
      tagIds: [1],
    };
    const createTaskEvaluation = {
      id: 1,
      userId: testUserId,
      taskId: testTaskId,
      content: "New Task Evaluation",
      effect: "Positive",
      accuracy: 5,
      impact: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [
        {
          id: 1,
          taskEvaluationId: 2,
          tagId: 1,
          tag: { 
            id: 1,
            key: "key",
            industry: "industry",
            label: "label",
          },
          createdAt: new Date(),
        },
      ],
      task: {
        id: 1,
        userId: testUserId,
        status: "active",
        title: "Task Title",
        detail: "Task Details",
        evaluationFactor: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: testUserId,
        name: "Test User",
        email: "test@example.com",
        detail: "detail",
	      role: "user",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        password: "password123",
      }
    };
    vi.mocked(TaskEvaluationsService.createTaskEvaluation).mockResolvedValue(createTaskEvaluation);

    const response = await request(server).post("/api/taskEvaluation").send({
      taskId: addTaskEvaluation.taskId,
      content: addTaskEvaluation.content,
      effect: addTaskEvaluation.effect,
      accuracy: addTaskEvaluation.accuracy,
      impact: addTaskEvaluation.impact,
      tagIds: addTaskEvaluation.tagIds,
      userId: testUserId,
    });

    expect(response.body.status).toBe(201);
    expect(response.body.taskEvaluation).toEqual({
      ...createTaskEvaluation,
      createdAt: createTaskEvaluation.createdAt.toISOString(),
      updatedAt: createTaskEvaluation.updatedAt.toISOString(),
      tags: createTaskEvaluation.tags.map((tag) => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
      })),
      task: {
        ...createTaskEvaluation.task,
        createdAt: createTaskEvaluation.task.createdAt.toISOString(),
        updatedAt: createTaskEvaluation.task.updatedAt.toISOString(),
      },
      user: {
        ...createTaskEvaluation.user,
        createdAt: createTaskEvaluation.user.createdAt.toISOString(),
        updatedAt: createTaskEvaluation.user.updatedAt.toISOString(),
        lastLogin: createTaskEvaluation.user.lastLogin.toISOString(),
      }
    });
  });

  it("should update a task evaluation (PUT)", async () => {
    const updatedEvaluation = {
      id: testTaskEvaluationId,
      taskId: testTaskId,
      userId: testUserId,
      content: "Updated Evaluation",
      effect: "Negative",
      accuracy: 3,
      impact: 5,
      tags: [{
        id: 1,
        taskEvaluationId: 2,
        tagId: 1,
        tag: { 
          id: 1,
          key: "key",
          industry: "industry",
          label: "label",
        },
        createdAt: new Date(),
      },],
      createdAt: new Date(),
      updatedAt: new Date(),
      task: {
        id: 1,
        userId: testUserId,
        status: "active",
        title: "Task Title",
        detail: "Task Details",
        evaluationFactor: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: testUserId,
        name: "Test User",
        email: "test@example.com",
        detail: "detail",
	      role: "user",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        password: "password123",
      }
    };
    vi.mocked(TaskEvaluationsService.updateTaskEvaluation).mockResolvedValue(updatedEvaluation);

    const response = await request(server).put("/api/taskEvaluation").send(updatedEvaluation);

    expect(response.body.status).toBe(200);
    expect(response.body.taskEvaluation).toEqual({
      ...updatedEvaluation,
      createdAt: updatedEvaluation.createdAt.toISOString(),
      updatedAt: updatedEvaluation.updatedAt.toISOString(),
      tags: updatedEvaluation.tags.map((tag) => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
      })),
      task: {
        ...updatedEvaluation.task,
        createdAt: updatedEvaluation.task.createdAt.toISOString(),
        updatedAt: updatedEvaluation.task.updatedAt.toISOString(),
      },
      user: {
        ...updatedEvaluation.user,
        createdAt: updatedEvaluation.user.createdAt.toISOString(),
        updatedAt: updatedEvaluation.user.updatedAt.toISOString(),
        lastLogin: updatedEvaluation.user.lastLogin.toISOString(),
      }
    });
  });


  it("should cascade delete related TaskEvaluationTag entries when EvaluationTag is deleted", async () => {
    // テスト用の EvaluationTag を作成
    const tag = await prisma.evaluationTag.create({
      data: { key: "test_key", industry: "IT", label: "Test Label" },
    });
  
    // TaskEvaluationTag の作成（リレーションを作る）
    await prisma.taskEvaluationTag.create({
      data: {
        taskEvaluationId: testTaskEvaluationId,
        tagId: tag.id,
      },
    });
  
    await prisma.evaluationTag.delete({ where: { id: tag.id } });
  
    const taskEvaluationTags = await prisma.taskEvaluationTag.findMany({
      where: { tagId: tag.id },
    });
  
    expect(taskEvaluationTags.length).toBe(0);
  });

  it("should return 400 if no ID is provided in PUT request", async () => {
    const response = await request(server).put("/api/taskEvaluation").send({ score: 3, comment: "No ID provided" });
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe("TaskEvaluation ID is required for update");
  });

  it("should delete a task evaluation (DELETE)", async () => {
    const deleteRespose = { status: 200, message: "TaskEvaluation deleted successfully" }
    vi.mocked(TaskEvaluationsService.deleteTaskEvaluation).mockResolvedValue(deleteRespose);
    const response = await request(server).delete("/api/taskEvaluation").query({ id: testTaskEvaluationId.toString() });
    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe("TaskEvaluation deleted successfully");
  });

  it("should return 400 if no ID is provided in DELETE request", async () => {
    const response = await request(server).delete("/api/taskEvaluation");
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe("TaskEvaluation ID is required for deletion");
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const response = await request(server).patch("/api/taskEvaluation");
    expect(response.body.status).toBe(405);
    expect(response.body.message).toBe("Method Not Allowed");
  });

});
