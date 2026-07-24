-- CreateEnum
CREATE TYPE "RoleLevel" AS ENUM ('USER', 'SUPPORT_ADMIN', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('LEARN', 'PRACTICE', 'BUILD', 'INTERVIEW', 'REVISION', 'QUIZ');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'OPTIONAL');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "RoleLevel" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "location" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'English',
    "experienceYears" DECIMAL(4,1),
    "currentJobTitle" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Calcutta',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerGoal" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "interviewDate" TIMESTAMP(3),
    "experienceLevel" TEXT NOT NULL,
    "weekdayHours" DECIMAL(4,1) NOT NULL,
    "weekendHours" DECIMAL(4,1) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleTopic" (
    "roleId" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "priority" "Priority" NOT NULL,

    CONSTRAINT "RoleTopic_pkey" PRIMARY KEY ("roleId","topicId")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "careerGoalId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" "RoadmapStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapWeek" (
    "id" UUID NOT NULL,
    "roadmapId" UUID NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapDay" (
    "id" UUID NOT NULL,
    "roadmapWeekId" UUID NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "objective" TEXT NOT NULL,
    "plannedMinutes" INTEGER NOT NULL,
    "frozen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapTask" (
    "id" UUID NOT NULL,
    "roadmapDayId" UUID NOT NULL,
    "topicId" UUID,
    "title" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "priority" "Priority" NOT NULL,
    "completionCriteria" JSONB NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskProgress" (
    "id" UUID NOT NULL,
    "roadmapTaskId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "actualMinutes" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "versionLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeFact" (
    "id" UUID NOT NULL,
    "resumeId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIUsage" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "feature" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "CareerGoal_userId_active_idx" ON "CareerGoal"("userId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "UserSkill_userId_idx" ON "UserSkill"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "Roadmap_userId_status_createdAt_idx" ON "Roadmap"("userId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapWeek_roadmapId_weekNumber_key" ON "RoadmapWeek"("roadmapId", "weekNumber");

-- CreateIndex
CREATE INDEX "RoadmapDay_date_idx" ON "RoadmapDay"("date");

-- CreateIndex
CREATE INDEX "RoadmapTask_roadmapDayId_orderIndex_idx" ON "RoadmapTask"("roadmapDayId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "TaskProgress_roadmapTaskId_userId_key" ON "TaskProgress"("roadmapTaskId", "userId");

-- CreateIndex
CREATE INDEX "LearningResource_topicId_verifiedAt_idx" ON "LearningResource"("topicId", "verifiedAt");

-- CreateIndex
CREATE INDEX "AIUsage_userId_createdAt_idx" ON "AIUsage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerGoal" ADD CONSTRAINT "CareerGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerGoal" ADD CONSTRAINT "CareerGoal_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleTopic" ADD CONSTRAINT "RoleTopic_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleTopic" ADD CONSTRAINT "RoleTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_careerGoalId_fkey" FOREIGN KEY ("careerGoalId") REFERENCES "CareerGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapWeek" ADD CONSTRAINT "RoadmapWeek_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapDay" ADD CONSTRAINT "RoadmapDay_roadmapWeekId_fkey" FOREIGN KEY ("roadmapWeekId") REFERENCES "RoadmapWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_roadmapDayId_fkey" FOREIGN KEY ("roadmapDayId") REFERENCES "RoadmapDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_roadmapTaskId_fkey" FOREIGN KEY ("roadmapTaskId") REFERENCES "RoadmapTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeFact" ADD CONSTRAINT "ResumeFact_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIUsage" ADD CONSTRAINT "AIUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
