import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeCard from "./EmployeeCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

vi.mock("../../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

const employee = {
  _id: "e1",
  name: "Aman Verma",
  email: "aman@example.com",
  department: "Engineering",
  skills: ["React", "Node.js"],
  performanceScore: 92,
  experience: 3,
};

describe("EmployeeCard", () => {
  it("shows an admin the Edit and Delete controls", async () => {
    useAuth.mockReturnValue({ isAdmin: true });
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EmployeeCard employee={employee} onEditScore={vi.fn()} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText("Aman Verma")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(employee);
    expect(screen.getByRole("button", { name: /delete aman verma/i })).toBeInTheDocument();
  });

  it("only offers a manager the Edit Score control, not delete", () => {
    useAuth.mockReturnValue({ isAdmin: false });

    render(
      <EmployeeCard employee={employee} onEditScore={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "Edit Score" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });
});
