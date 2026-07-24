-- Run after the Prisma migration. Prisma creates quoted, case-sensitive table
-- and column names, so keep the quotes in this file.

alter table "User" enable row level security;
alter table "UserProfile" enable row level security;
alter table "CareerGoal" enable row level security;
alter table "UserSkill" enable row level security;
alter table "Roadmap" enable row level security;
alter table "RoadmapWeek" enable row level security;
alter table "RoadmapDay" enable row level security;
alter table "RoadmapTask" enable row level security;
alter table "TaskProgress" enable row level security;
alter table "Resume" enable row level security;
alter table "ResumeFact" enable row level security;
alter table "AIUsage" enable row level security;
alter table "AuditLog" enable row level security;
alter table "Role" enable row level security;
alter table "Skill" enable row level security;
alter table "Topic" enable row level security;
alter table "RoleTopic" enable row level security;
alter table "LearningResource" enable row level security;

drop policy if exists "users read own account" on "User";
create policy "users read own account" on "User"
for select to authenticated using (id = (select auth.uid()));

-- Account roles are server-managed. Never grant authenticated users direct
-- UPDATE access to the User row because that would permit role escalation.
drop policy if exists "users update own account" on "User";

drop policy if exists "users read own profile" on "UserProfile";
create policy "users read own profile" on "UserProfile"
for select to authenticated using ("userId" = (select auth.uid()));

drop policy if exists "users update own profile" on "UserProfile";
create policy "users update own profile" on "UserProfile"
for update to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own goals" on "CareerGoal";
create policy "users manage own goals" on "CareerGoal"
for all to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own skills" on "UserSkill";
create policy "users manage own skills" on "UserSkill"
for all to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own roadmaps" on "Roadmap";
create policy "users manage own roadmaps" on "Roadmap"
for all to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own roadmap weeks" on "RoadmapWeek";
create policy "users manage own roadmap weeks" on "RoadmapWeek"
for all to authenticated
using (
  exists (
    select 1 from "Roadmap"
    where "Roadmap".id = "RoadmapWeek"."roadmapId"
      and "Roadmap"."userId" = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from "Roadmap"
    where "Roadmap".id = "RoadmapWeek"."roadmapId"
      and "Roadmap"."userId" = (select auth.uid())
  )
);

drop policy if exists "users manage own roadmap days" on "RoadmapDay";
create policy "users manage own roadmap days" on "RoadmapDay"
for all to authenticated
using (
  exists (
    select 1 from "RoadmapWeek"
    join "Roadmap" on "Roadmap".id = "RoadmapWeek"."roadmapId"
    where "RoadmapWeek".id = "RoadmapDay"."roadmapWeekId"
      and "Roadmap"."userId" = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from "RoadmapWeek"
    join "Roadmap" on "Roadmap".id = "RoadmapWeek"."roadmapId"
    where "RoadmapWeek".id = "RoadmapDay"."roadmapWeekId"
      and "Roadmap"."userId" = (select auth.uid())
  )
);

drop policy if exists "users manage own roadmap tasks" on "RoadmapTask";
create policy "users manage own roadmap tasks" on "RoadmapTask"
for all to authenticated
using (
  exists (
    select 1 from "RoadmapDay"
    join "RoadmapWeek" on "RoadmapWeek".id = "RoadmapDay"."roadmapWeekId"
    join "Roadmap" on "Roadmap".id = "RoadmapWeek"."roadmapId"
    where "RoadmapDay".id = "RoadmapTask"."roadmapDayId"
      and "Roadmap"."userId" = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from "RoadmapDay"
    join "RoadmapWeek" on "RoadmapWeek".id = "RoadmapDay"."roadmapWeekId"
    join "Roadmap" on "Roadmap".id = "RoadmapWeek"."roadmapId"
    where "RoadmapDay".id = "RoadmapTask"."roadmapDayId"
      and "Roadmap"."userId" = (select auth.uid())
  )
);

drop policy if exists "users manage own task progress" on "TaskProgress";
create policy "users manage own task progress" on "TaskProgress"
for all to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own resumes" on "Resume";
create policy "users manage own resumes" on "Resume"
for all to authenticated
using ("userId" = (select auth.uid()))
with check ("userId" = (select auth.uid()));

drop policy if exists "users manage own resume facts" on "ResumeFact";
create policy "users manage own resume facts" on "ResumeFact"
for all to authenticated
using (
  exists (
    select 1 from "Resume"
    where "Resume".id = "ResumeFact"."resumeId"
      and "Resume"."userId" = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from "Resume"
    where "Resume".id = "ResumeFact"."resumeId"
      and "Resume"."userId" = (select auth.uid())
  )
);

drop policy if exists "users read own ai usage" on "AIUsage";
create policy "users read own ai usage" on "AIUsage"
for select to authenticated using ("userId" = (select auth.uid()));

drop policy if exists "users read own audit log" on "AuditLog";
create policy "users read own audit log" on "AuditLog"
for select to authenticated using ("userId" = (select auth.uid()));

drop policy if exists "authenticated users read roles" on "Role";
create policy "authenticated users read roles" on "Role"
for select to authenticated using (true);

drop policy if exists "authenticated users read skills" on "Skill";
create policy "authenticated users read skills" on "Skill"
for select to authenticated using (true);

drop policy if exists "authenticated users read topics" on "Topic";
create policy "authenticated users read topics" on "Topic"
for select to authenticated using (true);

drop policy if exists "authenticated users read role topics" on "RoleTopic";
create policy "authenticated users read role topics" on "RoleTopic"
for select to authenticated using (true);

drop policy if exists "authenticated users read learning resources" on "LearningResource";
create policy "authenticated users read learning resources" on "LearningResource"
for select to authenticated using (true);
