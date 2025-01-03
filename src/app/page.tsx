import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return ( 
    <div>
      <Button variant={"ghost"}>Test Blog</Button>
      <Button variant={"secondary"}>Test Blog</Button>
      <Button variant={"destructive"}>Test Blog</Button>
      <Button variant={"outline"}>Test Blog</Button>
      <Button variant={"outline"} >  Test Blog <ChevronRight /></Button>
      <Button disabled>
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
    </div>
   );
}
