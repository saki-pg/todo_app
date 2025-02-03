import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSeedData() {
  try {
    await prisma.todoCategory.deleteMany();
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


    for (let i = 1; i <= 10; i++) {
      let connectCategoryIds: number[] = [];
      if (i <= 3) connectCategoryIds = [1, 2];
      else if (i <= 6) connectCategoryIds = [2, 3];
      else connectCategoryIds = [1, 3];

      await prisma.todo.create({
        data: {
          title: `sample${i}`,
          isCompleted: false,
          todoCategories: {
            create: connectCategoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId }},
            })),
          },
        },
      });
    }

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
