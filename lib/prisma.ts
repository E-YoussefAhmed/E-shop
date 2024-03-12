import { PrismaClient } from "@prisma/client";

// To not initializing too many prisma clients in dev mode due to hot reloading

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
