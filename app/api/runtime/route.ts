import { getRuntimeConfig } from "@/domain/runtime-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    name: "Resort Spot",
    inputs: getRuntimeConfig(),
  });
}
