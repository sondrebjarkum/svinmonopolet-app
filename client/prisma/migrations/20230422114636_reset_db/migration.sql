/*
  Warnings:

  - You are about to alter the column `price` on the `Beers` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beers" (
    "vmp_id" TEXT NOT NULL PRIMARY KEY,
    "vmp_name" TEXT NOT NULL,
    "vmp_image" TEXT NOT NULL,
    "barcode" INTEGER NOT NULL,
    "untappd_image" TEXT NOT NULL,
    "untappd_name" TEXT NOT NULL,
    "untappd_score" TEXT NOT NULL,
    "untappd_ratings" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "abv" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "data" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "brewery" TEXT NOT NULL,
    "new" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Beers" ("abv", "active", "barcode", "brewery", "createdAt", "data", "new", "price", "type", "untappd_image", "untappd_name", "untappd_ratings", "untappd_score", "updatedAt", "vmp_id", "vmp_image", "vmp_name", "volume") SELECT "abv", "active", "barcode", "brewery", "createdAt", "data", "new", "price", "type", "untappd_image", "untappd_name", "untappd_ratings", "untappd_score", "updatedAt", "vmp_id", "vmp_image", "vmp_name", "volume" FROM "Beers";
DROP TABLE "Beers";
ALTER TABLE "new_Beers" RENAME TO "Beers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
