/*
  Warnings:

  - You are about to drop the column `stockLevel` on the `Stores` table. All the data in the column will be lost.
  - You are about to drop the column `brewery` on the `Beers` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Beers` table. All the data in the column will be lost.
  - You are about to drop the column `untappd_ratings` on the `Beers` table. All the data in the column will be lost.
  - You are about to drop the column `untappd_score` on the `Beers` table. All the data in the column will be lost.
  - You are about to alter the column `abv` on the `Beers` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `price` on the `Beers` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `volume` on the `Beers` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stores" (
    "store_id" TEXT NOT NULL PRIMARY KEY,
    "vmp_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "address" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "lon" DECIMAL,
    "lat" DECIMAL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Stores" ("address", "category", "city", "lat", "lon", "name", "store_id", "updatedAt", "vmp_id", "zip") SELECT "address", "category", "city", "lat", "lon", "name", "store_id", "updatedAt", "vmp_id", "zip" FROM "Stores";
DROP TABLE "Stores";
ALTER TABLE "new_Stores" RENAME TO "Stores";
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
    "untappd_chekins" INTEGER,
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
INSERT INTO "new_Beers" ("abv", "active", "barcode", "createdAt", "data", "new", "price", "untappd_image", "untappd_name", "updatedAt", "vmp_id", "vmp_image", "vmp_name", "volume") SELECT "abv", "active", "barcode", "createdAt", "data", "new", "price", "untappd_image", "untappd_name", "updatedAt", "vmp_id", "vmp_image", "vmp_name", "volume" FROM "Beers";
DROP TABLE "Beers";
ALTER TABLE "new_Beers" RENAME TO "Beers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
