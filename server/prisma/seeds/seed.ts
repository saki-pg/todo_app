import {
  Prisma,
  PrismaClient
} from "@prisma/client"

const prisma = new PrismaClient();

const todosData: Prisma.TodoCreateInput[] = [
  {
    title: "sample1",
    isCompleted: false,
  },
  {
    title: "sample2",
    isCompleted: false,
  },
  {
    title: "sample3",
    isCompleted: false,
  },
  {
    title: "sample4",
    isCompleted: false,
  },
  {
    title: "sample5",
    isCompleted: false,
  },
  {
    title: "sample6",
    isCompleted: false,
  },
  {
    title: "sample7",
    isCompleted: false,
  },
  {
    title: "sample8",
    isCompleted: false,
  },
  {
    title: "sample9",
    isCompleted: false,
  },
  {
    title: "sample10",
    isCompleted: false,
  },
];

async function createSeedData() {
  try {
    await prisma.todo.createMany({
      data: todosData,
      skipDuplicates: true,
    });
    console.log("Seed data created successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect()
  }
}
createSeedData();
