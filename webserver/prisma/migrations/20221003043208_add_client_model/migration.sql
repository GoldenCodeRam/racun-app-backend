-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(280) NOT NULL,
    "last_name" VARCHAR(280) NOT NULL,
    "document" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
