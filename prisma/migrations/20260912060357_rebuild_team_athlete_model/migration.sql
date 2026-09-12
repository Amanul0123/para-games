-- DropForeignKey
ALTER TABLE `Illness` DROP FOREIGN KEY `Illness_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `Injury` DROP FOREIGN KEY `Injury_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `ReportNote` DROP FOREIGN KEY `ReportNote_reportId_fkey`;

-- AlterTable
ALTER TABLE `Illness` DROP COLUMN `absenceDays`,
    DROP COLUMN `accreditationNo`,
    DROP COLUMN `causeCode`,
    DROP COLUMN `reportId`,
    DROP COLUMN `symptomCodes`,
    DROP COLUMN `systemCode`,
    ADD COLUMN `athleteId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `editedDaysLost` INTEGER NULL,
    ADD COLUMN `originalDaysLost` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'logged',
    ADD COLUMN `teamUserId` VARCHAR(191) NOT NULL,
    ADD COLUMN `timeLossStatus` VARCHAR(191) NOT NULL DEFAULT 'original',
    MODIFY `occurredOn` DATE NOT NULL;

-- AlterTable
ALTER TABLE `Injury` DROP COLUMN `absenceDays`,
    DROP COLUMN `accreditationNo`,
    DROP COLUMN `bodyPartCode`,
    DROP COLUMN `causeCode`,
    DROP COLUMN `injuryTime`,
    DROP COLUMN `injuryTypeCode`,
    DROP COLUMN `reportId`,
    DROP COLUMN `roundHeat`,
    ADD COLUMN `athleteId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `editedDaysLost` INTEGER NULL,
    ADD COLUMN `originalDaysLost` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'logged',
    ADD COLUMN `teamUserId` VARCHAR(191) NOT NULL,
    ADD COLUMN `timeLossStatus` VARCHAR(191) NOT NULL DEFAULT 'original',
    MODIFY `injuryDate` DATE NOT NULL;

-- DropTable
DROP TABLE `Report`;

-- DropTable
DROP TABLE `ReportNote`;

-- CreateTable
CREATE TABLE `TeamUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `npc` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `mustResetPassword` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TeamUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Athlete` (
    `id` VARCHAR(191) NOT NULL,
    `teamUserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `accreditationNo` VARCHAR(191) NOT NULL,
    `sport` VARCHAR(191) NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Athlete_teamUserId_accreditationNo_key`(`teamUserId`, `accreditationNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamDay` (
    `id` VARCHAR(191) NOT NULL,
    `teamUserId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `noIncidentReported` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TeamDay_teamUserId_date_key`(`teamUserId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamDayAthlete` (
    `id` VARCHAR(191) NOT NULL,
    `teamDayId` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TeamDayAthlete_teamDayId_athleteId_key`(`teamDayId`, `athleteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecordNote` (
    `id` VARCHAR(191) NOT NULL,
    `recordType` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `eventName` VARCHAR(191) NOT NULL DEFAULT 'Aichi Nagoya 2026 Asian Para Games',
    `organizationName` VARCHAR(191) NOT NULL DEFAULT 'Asian Paralympic Committee',
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `logoUrl` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Athlete` ADD CONSTRAINT `Athlete_teamUserId_fkey` FOREIGN KEY (`teamUserId`) REFERENCES `TeamUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamDay` ADD CONSTRAINT `TeamDay_teamUserId_fkey` FOREIGN KEY (`teamUserId`) REFERENCES `TeamUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamDayAthlete` ADD CONSTRAINT `TeamDayAthlete_teamDayId_fkey` FOREIGN KEY (`teamDayId`) REFERENCES `TeamDay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamDayAthlete` ADD CONSTRAINT `TeamDayAthlete_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `Athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Injury` ADD CONSTRAINT `Injury_teamUserId_fkey` FOREIGN KEY (`teamUserId`) REFERENCES `TeamUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Injury` ADD CONSTRAINT `Injury_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `Athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Illness` ADD CONSTRAINT `Illness_teamUserId_fkey` FOREIGN KEY (`teamUserId`) REFERENCES `TeamUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Illness` ADD CONSTRAINT `Illness_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `Athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

