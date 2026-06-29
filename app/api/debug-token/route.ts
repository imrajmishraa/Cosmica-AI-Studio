import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken();
  return Response.json({ token });
}
