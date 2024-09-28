import { runMigrations } from "@/lib/db/migrate";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const  query  =  request.nextUrl.searchParams;
    const  secret  =  query.get("secret"); 

    if (secret !== process.env.NEXTAUTH_SECRET) {
        return new Response("Invalid secret", { status: 401 });
    }
   
  const data =  await runMigrations();
   
    return Response.json({ hello: "world" });
  }