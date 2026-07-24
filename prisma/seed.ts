import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  "Application Security Analyst",
  "Product Security Engineer",
  "Frontend Developer",
  "Full-Stack Developer",
  "Backend Developer",
  "DevOps Engineer"
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await Promise.all(roles.map((name) => prisma.role.upsert({
    where: { slug: slugify(name) },
    update: { name },
    create: { slug: slugify(name), name }
  })));
}

main()
  .finally(() => prisma.$disconnect());
