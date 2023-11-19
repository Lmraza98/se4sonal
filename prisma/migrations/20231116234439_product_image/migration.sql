/*
  Warnings:

  - You are about to drop the column `imageId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductCollection" DROP CONSTRAINT "ProductCollection_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
-- ALTER TABLE "Product" DROP COLUMN "imageId",
-- ADD COLUMN     "size" TEXT NOT NULL;

-- -- DropTable
-- DROP TABLE "Collection";

-- DropTable
DROP TABLE "ProductImage";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- -- CreateTable
-- CREATE TABLE "Capsule" (
--     "id" SERIAL NOT NULL,
--     "name" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id")
-- );

-- CreateIndex
CREATE INDEX "Image_productId_idx" ON "Image"("productId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCollection" ADD CONSTRAINT "ProductCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Capsule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageId",
ADD COLUMN     "size" TEXT;

-- Populate the 'size' column with a default value for existing rows
UPDATE "Product" SET "size" = 'default_value' WHERE "size" IS NULL;

-- Alter 'size' column to be not nullable
ALTER TABLE "Product" ALTER COLUMN "size" SET NOT NULL;
