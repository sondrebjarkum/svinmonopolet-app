-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Beers" (
    "vmp_id" TEXT NOT NULL PRIMARY KEY,
    "vmp_name" TEXT NOT NULL,
    "vmp_image" TEXT NOT NULL,
    "barcode" INTEGER NOT NULL,
    "untappd_image" TEXT NOT NULL,
    "untappd_name" TEXT NOT NULL,
    "untappd_score" TEXT NOT NULL,
    "untappd_ratings" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "Stores" (
    "store_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "lon" DECIMAL NOT NULL,
    "lat" DECIMAL NOT NULL,
    "vmp_id" TEXT NOT NULL,
    "stockLevel" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
