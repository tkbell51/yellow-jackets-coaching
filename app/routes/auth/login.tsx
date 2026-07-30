import { Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthProvider, useAuth } from "~/features/auth/auth-context";

export function meta() {
  return [{ title: "Sign in | Yellow Jackets Coaching" }];
}

function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("head.coach@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/app");
    } catch {
      setError("Unable to sign in. Check the email and password.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-black p-4 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md border border-zinc-700 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-md bg-[#D0B988] text-black">
            <Shield aria-hidden size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black">Yellow Jackets Coaching</h1>
            <p className="text-sm text-zinc-300">Sign in for practice and game day.</p>
          </div>
        </div>
        <label className="block text-sm font-bold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-black px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]"
          type="email"
          autoComplete="email"
        />
        <label className="mt-4 block text-sm font-bold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-black px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]"
          type="password"
          autoComplete="current-password"
          placeholder="Use Supabase password when configured"
        />
        {error && <p className="mt-3 rounded-md bg-red-100 p-3 text-sm font-bold text-red-950">{error}</p>}
        <button type="submit" className="mt-5 min-h-12 w-full rounded-md bg-[#D0B988] px-4 font-black text-black focus:outline-none focus:ring-2 focus:ring-white">
          Sign in
        </button>
        <a className="mt-4 block text-center text-sm font-bold text-[#D0B988]" href="/forgot-password">
          Forgot password
        </a>
      </form>
    </main>
  );
}

export default function Login() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
