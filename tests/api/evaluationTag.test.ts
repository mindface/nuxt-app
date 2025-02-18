import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import request from 'supertest';
import EvaluationTagService from "../../src/server/services/evaluationTagService";
import evaluationTagHandler from "../../src/server/api/evaluationTag";
import { createApp, toNodeListener } from 'h3';

const prisma = new PrismaClient();

const app = createApp();
app.use('/api/evaluationTag', evaluationTagHandler);
const server = toNodeListener(app);

// 認証をモック
vi.mock("../../src/server/utils/auth", () => ({
  useAuth: vi.fn(() => Promise.resolve()),
}));

// 各サービスメソッドをモック
vi.mock("../../src/server/services/evaluationTagService", () => {
  return {
    default: {
      getAllTags: vi.fn(),
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    },
  };
});

describe("Task API Handler", () => {
  let testTagId: number;

  beforeAll(async () => {
    const tag = await prisma.evaluationTag.create({
      data: {
        key: "test-key",
        industry: "IT",
        label: "Test Label",
      },
    });
    testTagId = tag.id;
  });

  afterAll(async () => {
    await prisma.evaluationTag.deleteMany();
    await prisma.$disconnect();
  });

  it("should return all evaluation tags (GET)", async () => {
    const mockTags = [{ id: testTagId, key: "test-key", industry: "IT", label: "Test Label" }];
    vi.mocked(EvaluationTagService.getAllTags).mockResolvedValue(mockTags);

    const response = await request(server).get("/api/evaluationTag");
    expect(response.body.status).toBe(200);
    expect(response.body).toHaveProperty("tags");
    expect(response.body.tags).toEqual(mockTags);
  });

  it("should create a new evaluation tag (POST)", async () => {
    const newTag = { id: 2, key: "new-key", industry: "Finance", label: "New Label" };
    vi.mocked(EvaluationTagService.createTag).mockResolvedValue(newTag);

    const response = await request(server).post("/api/evaluationTag").send(newTag);
    expect(response.body.status).toBe(201);
    expect(response.body).toHaveProperty("tag");
    expect(response.body.tag).toEqual(newTag);
  });

  it("should update an evaluation tag (PUT)", async () => {
    const updatedTag = { id: testTagId, key: "updated-key", industry: "Healthcare", label: "Updated Label" };
    vi.mocked(EvaluationTagService.updateTag).mockResolvedValue(updatedTag);

    const response = await request(server).put("/api/evaluationTag").send(updatedTag);
    expect(response.body.status).toBe(200);
    expect(response.body).toHaveProperty("tag");
    expect(response.body.tag).toEqual(updatedTag);
  });

  it("should return 400 if tag ID is missing in PUT request", async () => {
    const response = await request(server).put("/api/evaluationTag").send({ key: "invalid" });
    expect(response.body.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Tag ID is required for update");
  });

  it("should delete an evaluation tag (DELETE)", async () => {
    const mockTag = {
      id: testTagId,
      key: "test-key",
      industry: "IT",
      label: "Test Label"
    };

    vi.mocked(EvaluationTagService.deleteTag).mockResolvedValue(mockTag);

    const response = await request(server).delete("/api/evaluationTag").query({ id: testTagId.toString() });

    expect(response.body.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Tag deleted successfully");
  });

  it("should return 400 if tag ID is missing in DELETE request", async () => {
    const response = await request(server).delete("/api/evaluationTag");
    expect(response.body.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Tag ID is required for deletion");
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const response = await request(server).patch("/api/evaluationTag");
    expect(response.body.status).toBe(405);
    expect(response.body).toHaveProperty("message", "Method Not Allowed");
  });

});
