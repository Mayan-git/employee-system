import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const makeQuery = (resolvedValue) => {
  const promise = Promise.resolve(resolvedValue);
  promise.select = vi.fn().mockResolvedValue(resolvedValue);
  return promise;
};

vi.mock("../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
  },
}));

const { default: User } = await import("../models/User.js");
const { default: app } = await import("../server.js");

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bootstraps the first-ever signup as admin", async () => {
    User.findOne.mockReturnValue(makeQuery(null));
    User.countDocuments.mockResolvedValue(0);
    User.create.mockImplementation(async (data) => ({ _id: "1", ...data }));

    const res = await request(app).post("/api/auth/signup").send({
      name: "Aman Verma",
      email: "aman@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("admin");
    expect(res.body.token).toBeTruthy();
  });

  it("defaults later signups to manager", async () => {
    User.findOne.mockReturnValue(makeQuery(null));
    User.countDocuments.mockResolvedValue(1);
    User.create.mockImplementation(async (data) => ({ _id: "2", ...data }));

    const res = await request(app).post("/api/auth/signup").send({
      name: "Priya Shah",
      email: "priya@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("manager");
  });

  it("rejects signup when the email already exists", async () => {
    User.findOne.mockReturnValue(makeQuery({ _id: "1", email: "aman@example.com" }));

    const res = await request(app).post("/api/auth/signup").send({
      name: "Aman Verma",
      email: "aman@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
  });

  it("rejects signup with an invalid payload before it reaches the controller", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "A",
      email: "not-an-email",
      password: "short",
    });

    expect(res.status).toBe(400);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("rejects login with wrong credentials", async () => {
    User.findOne.mockReturnValue(
      makeQuery({
        _id: "1",
        name: "Aman",
        email: "aman@example.com",
        password: "$2a$10$invalidhashvalueinvalidhashvalueinvalidha",
        role: "manager",
      })
    );

    const res = await request(app).post("/api/auth/login").send({
      email: "aman@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("rejects login for a non-existent user", async () => {
    User.findOne.mockReturnValue(makeQuery(null));

    const res = await request(app).post("/api/auth/login").send({
      email: "ghost@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
  });
});
