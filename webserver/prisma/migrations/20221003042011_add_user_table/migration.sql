-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(280) NOT NULL,
    "last_name" VARCHAR(280) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(280) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
