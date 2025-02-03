/*
  Warnings:

  - You are about to drop the `_CategoryToTodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTodo" DROP CONSTRAINT "_CategoryToTodo_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTodo" DROP CONSTRAINT "_CategoryToTodo_B_fkey";

-- DropTable
DROP TABLE "_CategoryToTodo";

-- CreateTable
CREATE TABLE "TodoCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "todoId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TodoCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TodoCategory_todoId_categoryId_key" ON "TodoCategory"("todoId", "categoryId");

-- AddForeignKey
ALTER TABLE "TodoCategory" ADD CONSTRAINT "TodoCategory_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoCategory" ADD CONSTRAINT "TodoCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
