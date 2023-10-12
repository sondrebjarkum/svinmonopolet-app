/*
  Warnings:

  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stock` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stock" (
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "beerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    PRIMARY KEY ("beerId", "storeId"),
    CONSTRAINT "Stock_beerId_fkey" FOREIGN KEY ("beerId") REFERENCES "Beers" ("vmp_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stock_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores" ("store_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("beerId", "createdAt", "quantity", "storeId", "updatedAt") SELECT "beerId", "createdAt", "quantity", "storeId", "updatedAt" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
