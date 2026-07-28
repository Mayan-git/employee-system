import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

const makeQuery = (resolvedValue) => {
  const promise = Promise.resolve(resolvedValue);
  promise.select = vi.fn().mockResolvedValue(resolvedValue);
  return promise;
};

const makeChainableQuery = (resolvedValue) => {
  const query = {
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  };
  query.then = (resolve, reject) => Promise.resolve(resolvedValue).then(resolve, reject);
  return query;
};

vi.mock("../models/Employee.js", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

const { default: Employee } = await import("../models/Employee.js");
const { default: app } = await import("../server.js");

const JWT_SECRET = process.env.JWT_SECRET;
const adminToken = jwt.sign({ id: "admin1", role: "admin" }, JWT_SECRET);
const managerToken = jwt.sign({ id: "mgr1", role: "manager" }, JWT_SECRET);

const sampleEmployee = {
  _id: "e1",
  name: "Aman Verma",
  email: "aman@example.com",
  department: "Engineering",
  skills: ["React"],
  performanceScore: 88,
  experience: 3,
};

describe("Employees API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(401);
  });

  it("allows a manager to list employees", async () => {
    Employee.find.mockReturnValue(makeChainableQuery([sampleEmployee]));
    Employee.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.employees).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it("blocks a manager from creating an employee", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "New Person",
        email: "new@example.com",
        department: "Sales",
        performanceScore: 70,
        experience: 1,
      });

    expect(res.status).toBe(403);
    expect(Employee.create).not.toHaveBeenCalled();
  });

  it("allows an admin to create an employee", async () => {
    Employee.findOne.mockReturnValue(makeQuery(null));
    Employee.create.mockResolvedValue(sampleEmployee);

    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Aman Verma",
        email: "aman@example.com",
        department: "Engineering",
        skills: ["React"],
        performanceScore: 88,
        experience: 3,
      });

    expect(res.status).toBe(201);
    expect(Employee.create).toHaveBeenCalledOnce();
  });

  it("rejects employee creation with an invalid payload", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "A", email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(Employee.create).not.toHaveBeenCalled();
  });

  it("restricts a manager's update to only the performanceScore field", async () => {
    Employee.findByIdAndUpdate.mockResolvedValue({ ...sampleEmployee, performanceScore: 95 });

    const res = await request(app)
      .put("/api/employees/e1")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ performanceScore: 95, department: "Hacked", name: "Injected Name" });

    expect(res.status).toBe(200);
    expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(
      "e1",
      { performanceScore: 95 },
      expect.any(Object)
    );
  });

  it("allows an admin to update any field", async () => {
    Employee.findByIdAndUpdate.mockResolvedValue({ ...sampleEmployee, department: "Design" });

    const res = await request(app)
      .put("/api/employees/e1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ department: "Design" });

    expect(res.status).toBe(200);
    expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(
      "e1",
      { department: "Design" },
      expect.any(Object)
    );
  });

  it("blocks a manager from deleting an employee", async () => {
    const res = await request(app)
      .delete("/api/employees/e1")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.status).toBe(403);
    expect(Employee.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it("allows an admin to delete an employee", async () => {
    Employee.findByIdAndDelete.mockResolvedValue(sampleEmployee);

    const res = await request(app)
      .delete("/api/employees/e1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  it("returns 404 when deleting a non-existent employee", async () => {
    Employee.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/employees/missing")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
