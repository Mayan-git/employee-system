import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

vi.mock("../services/authService.js", () => ({
  login: vi.fn(),
  signup: vi.fn(),
  getMe: vi.fn(),
  listUsers: vi.fn(),
  updateUserRole: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const authService = await import("../services/authService.js");

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows the Full Name field only in signup mode", async () => {
    renderLoginPage();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("submits trimmed credentials on login", async () => {
    authService.login.mockResolvedValue({
      token: "fake-token",
      user: { id: "1", name: "Aman", email: "aman@example.com", role: "admin" },
    });

    renderLoginPage();
    await userEvent.type(screen.getByLabelText(/email/i), "  aman@example.com  ");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    const form = screen.getByLabelText(/email/i).closest("form");
    await userEvent.click(within(form).getByRole("button", { name: "Login" }));

    expect(authService.login).toHaveBeenCalledWith({
      email: "aman@example.com",
      password: "password123",
    });
  });
});
