import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

const Header = ({session}: {session:Session}) => {
  return (
    <header className="my-10 m-[150px] flex justify-between">
    <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <span className="text-2xl font-extrabold text-amber-400 font-jetbrains-semiBold">COMMENTS</span>
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button className="bg-cyan-200 rounded-4xl text-3xl pl-8  flex font-extrabold font-jetbrains-semiBold p-6">Sign-Off</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;