-- CreateTable
CREATE TABLE `Report` (
    `id` VARCHAR(191) NOT NULL,
    `npc` VARCHAR(191) NOT NULL,
    `reportedBy` VARCHAR(191) NOT NULL,
    `dateOfReport` DATE NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'submitted',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Injury` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `accreditationNo` VARCHAR(191) NOT NULL,
    `sportEvent` VARCHAR(191) NOT NULL,
    `roundHeat` VARCHAR(191) NULL,
    `injuryDate` VARCHAR(191) NOT NULL,
    `injuryTime` VARCHAR(191) NULL,
    `bodyPart` VARCHAR(191) NOT NULL,
    `bodyPartCode` VARCHAR(191) NULL,
    `injuryType` VARCHAR(191) NOT NULL,
    `injuryTypeCode` VARCHAR(191) NULL,
    `causeOfInjury` VARCHAR(191) NULL,
    `causeCode` VARCHAR(191) NULL,
    `absenceDays` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Illness` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `accreditationNo` VARCHAR(191) NOT NULL,
    `sportEvent` VARCHAR(191) NOT NULL,
    `occurredOn` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NOT NULL,
    `affectedSystem` VARCHAR(191) NULL,
    `systemCode` VARCHAR(191) NULL,
    `mainSymptoms` VARCHAR(191) NULL,
    `symptomCodes` VARCHAR(191) NULL,
    `causeOfIllness` VARCHAR(191) NULL,
    `causeCode` VARCHAR(191) NULL,
    `absenceDays` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Injury` ADD CONSTRAINT `Injury_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Illness` ADD CONSTRAINT `Illness_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
