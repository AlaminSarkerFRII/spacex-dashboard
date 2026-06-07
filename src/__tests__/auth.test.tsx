import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/lib/auth-context";

// Helper component that exposes auth state
function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{user ? "logged-in" : "logged-out"}</span>
      {user && <span data-testid="name">{user.name}</span>}
      {user && <span data-testid="email">{user.email}</span>}
      {user && <span data-testid="role">{user.role}</span>}
      <button onClick={() => login("admin@gmail.com", "admin")}>
        correct login
      </button>
      <button onClick={() => login("wrong@email.com", "wrong")}>
        wrong login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  it("starts in logged-out state", () => {
    renderWithAuth();
    expect(screen.getByTestId("status").textContent).toBe("logged-out");
  });

  it("logs in with correct credentials", async () => {
    renderWithAuth();
    await userEvent.click(screen.getByText("correct login"));
    expect(screen.getByTestId("status").textContent).toBe("logged-in");
    expect(screen.getByTestId("name").textContent).toBe("Admin User");
    expect(screen.getByTestId("email").textContent).toBe("admin@gmail.com");
    expect(screen.getByTestId("role").textContent).toBe("Administrator");
  });

  it("does not log in with wrong credentials", async () => {
    renderWithAuth();
    await userEvent.click(screen.getByText("wrong login"));
    expect(screen.getByTestId("status").textContent).toBe("logged-out");
  });

  it("logs out after being logged in", async () => {
    renderWithAuth();
    await userEvent.click(screen.getByText("correct login"));
    expect(screen.getByTestId("status").textContent).toBe("logged-in");

    await userEvent.click(screen.getByText("logout"));
    expect(screen.getByTestId("status").textContent).toBe("logged-out");
  });

  it("login returns true for valid credentials", () => {
    let result: boolean | undefined;
    function CaptureFn() {
      const { login } = useAuth();
      return (
        <button onClick={() => { result = login("admin@gmail.com", "admin"); }}>
          go
        </button>
      );
    }
    render(<AuthProvider><CaptureFn /></AuthProvider>);
    act(() => { screen.getByText("go").click(); });
    expect(result).toBe(true);
  });

  it("login returns false for invalid credentials", () => {
    let result: boolean | undefined;
    function CaptureFn() {
      const { login } = useAuth();
      return (
        <button onClick={() => { result = login("bad@bad.com", "bad"); }}>
          go
        </button>
      );
    }
    render(<AuthProvider><CaptureFn /></AuthProvider>);
    act(() => { screen.getByText("go").click(); });
    expect(result).toBe(false);
  });
});
