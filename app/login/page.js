import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-950">Dang nhap admin</h1>
        <p className="mt-2 text-zinc-600">Nhap tai khoan de quan ly bai viet.</p>
      </div>
      <LoginForm />
    </main>
  );
}
