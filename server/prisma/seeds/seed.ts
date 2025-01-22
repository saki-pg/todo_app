import {
  Prisma,
  PrismaClient
} from "@prisma/client";

const prisma = new PrismaClient();

async function createSeedData() {
  try {
    await prisma.todo.deleteMany();
    await prisma.category.deleteMany();

    await prisma.category.createMany({
      data: [
        { id: 1, name: "カテゴリー1" },
        { id: 2, name: "カテゴリー2" },
        { id: 3, name: "カテゴリー3" },
      ],
      skipDuplicates: true,
    });

    const todosData: Prisma.TodoCreateManyInput[] = [...Array(10)].map((_, i) => {
      const id = i + 1;

      const getCategoryIds = (id: number) => {
        if (id <= 3) return 1
        if (id <= 6) return 2
        return 3
      }

      return {
        title: `sample${id}`,
        isCompleted: false,
        categoryId: getCategoryIds(id),
      };
    });

    await prisma.todo.createMany({
      data: todosData,
      skipDuplicates: true,
    });
    console.log("Seed data created successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeedData()
  .then(() => {
    console.log("Seeding process completed.")
  })
  .catch((error) => {
    console.error("Error during seeding process:", error)
  })
