import { describe, it, expect, vi } from "vitest";
import { authorize } from "../middleware/authorize.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });

describe("authorize middleware", () => {
  it("calls next() with no error when the user has an allowed role", () => {
    const req = { user: { role: "admin" } };
    const next = vi.fn();
    authorize("admin", "manager")(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it("passes a 403 ApiError to next() when the role is not allowed", () => {
    const req = { user: { role: "manager" } };
    const next = vi.fn();
    authorize("admin")(req, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(403);
  });

  it("passes a 403 ApiError to next() when there is no authenticated user", () => {
    const req = {};
    const next = vi.fn();
    authorize("admin")(req, mockRes(), next);
    expect(next.mock.calls[0][0].status).toBe(403);
  });
});
