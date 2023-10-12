-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "beerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    CONSTRAINT "Stock_beerId_fkey" FOREIGN KEY ("beerId") REFERENCES "Beers" ("vmp_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stock_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores" ("store_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
