/*
  Warnings:

  - You are about to drop the column `untappd_chekins` on the `Beers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beers" (
    "vmp_id" TEXT NOT NULL PRIMARY KEY,
    "vmp_name" TEXT,
    "vmp_image" TEXT,
    "vmp_link" TEXT,
    "barcode" TEXT,
    "untappd_bid" TEXT,
    "untappd_brewery" TEXT,
    "untappd_name" TEXT,
    "untappd_image" TEXT,
    "untappd_rating" TEXT,
    "untappd_checkins" INTEGER,
    "untappd_link" TEXT,
    "abv" REAL,
    "price" REAL,
    "style" TEXT,
    "volume" INTEGER,
    "error" TEXT,
    "data" TEXT,
    "active" BOOLEAN,
    "new" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Beers" ("abv", "active", "barcode", "createdAt", "data", "error", "new", "price", "style", "untappd_bid", "untappd_brewery", "untappd_image", "untappd_link", "untappd_name", "untappd_rating", "updatedAt", "vmp_id", "vmp_image", "vmp_link", "vmp_name", "volume") SELECT "abv", "active", "barcode", "createdAt", "data", "error", "new", "price", "style", "untappd_bid", "untappd_brewery", "untappd_image", "untappd_link", "untappd_name", "untappd_rating", "updatedAt", "vmp_id", "vmp_image", "vmp_link", "vmp_name", "volume" FROM "Beers";
DROP TABLE "Beers";
ALTER TABLE "new_Beers" RENAME TO "Beers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
