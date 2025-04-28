import { redirect } from "next/navigation";
import { ReactNode } from "react";
import {auth } from "@/auth"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if(!session) redirect("/sign-in");
  return (
    <main>
      <Header session = {session}/>
      
        {children}
       
          
    </main>
  );
};

export default Layout;