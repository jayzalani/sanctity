import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Image src="/logo.png" alt="logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">COMMENTS!</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/auth_illus.svg"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
      <div className="absolute -z-10 inset-0 h-full w-full 
    bg-[linear-gradient(to_right,#d1d1d120_1px,transparent_1px),linear-gradient(to_bottom,#d1d1d120_1px,transparent_1px)] 
    bg-[size:100px_100px] 
    [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]"
  />
    </main>
  );
};

export default Layout;