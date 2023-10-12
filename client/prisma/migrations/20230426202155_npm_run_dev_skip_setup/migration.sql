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
    "lon" TEXT,
    "lat" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Stores" ("address", "category", "city", "lat", "lon", "name", "store_id", "updatedAt", "vmp_id", "zip") SELECT "address", "category", "city", "lat", "lon", "name", "store_id", "updatedAt", "vmp_id", "zip" FROM "Stores";
DROP TABLE "Stores";
ALTER TABLE "new_Stores" RENAME TO "Stores";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
