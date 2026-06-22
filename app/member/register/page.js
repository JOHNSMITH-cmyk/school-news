import Link from "next/link";
import { Suspense } from "react";
import MemberRegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default function MemberRegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
      <Link
        className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-950"
        href="/"
      >
        Quay lai trang chu
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Dang ky tai khoan binh luan
        </h1>
        <p className="mt-2 text-zinc-600">
          Ten hien thi cua ban se xuat hien tren binh luan.
        </p>
      </div>

      <Suspense fallback={null}>
        <MemberRegisterForm />
      </Suspense>
    </main>
  );
}
