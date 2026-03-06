-- CreateTable
CREATE TABLE "CalibrationConfig" (
  "id" SERIAL PRIMARY KEY,
  "sensorOffsetCm" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "scaleFactor" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "minValidCm" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "maxValidCm" DOUBLE PRECISION NOT NULL DEFAULT 300,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Reading" (
  "id" SERIAL PRIMARY KEY,
  "rawCm" DOUBLE PRECISION NOT NULL,
  "calibratedCm" DOUBLE PRECISION NOT NULL,
  "isValid" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "calibrationId" INTEGER,
  CONSTRAINT "Reading_calibrationId_fkey"
    FOREIGN KEY ("calibrationId")
    REFERENCES "CalibrationConfig"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE INDEX "Reading_calibrationId_idx" ON "Reading"("calibrationId");
