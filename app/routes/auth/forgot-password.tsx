import { Link } from "react-router";

export function meta() {
  return [{ title: "Reset password | Yellow Jackets Coaching" }];
}

export default function ForgotPassword() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 p-4">
      <section className="w-full max-w-sm rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-black text-zinc-950">Reset Password</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-700">
          Supabase password reset emails will be enabled once project environment variables and redirect URLs are configured.
        </p>
        <Link className="mt-5 inline-flex min-h-11 items-center rounded-md bg-black px-4 text-sm font-black text-white" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
