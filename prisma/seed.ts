import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo@123";

interface DemoAthlete {
  name: string;
  accreditationNo: string;
  sport: string;
}

interface DemoRecord {
  daysAgo: number;
  athleteIndex: number;
  kind: "injury" | "illness";
  sportEvent: string;
  bodyPart?: string;
  injuryType?: string;
  causeOfInjury?: string;
  diagnosis?: string;
  affectedSystem?: string;
  mainSymptoms?: string;
  causeOfIllness?: string;
  originalDaysLost?: number;
  editedDaysLost?: number;
  status?: "logged" | "under_review" | "resolved";
}

interface DemoTeam {
  npc: string;
  name: string;
  email: string;
  phone: string;
  athletes: DemoAthlete[];
  records: DemoRecord[];
}

const DEMO_TEAMS: DemoTeam[] = [
  {
    npc: "UAE",
    name: "Dr. Fatima Al Mansoori",
    email: "doctor.uae@demo.parasports",
    phone: "+971 50 123 4567",
    athletes: [
      { name: "Saeed Al Ketbi", accreditationNo: "UAE001", sport: "Athletics" },
      { name: "Mariam Al Suwaidi", accreditationNo: "UAE002", sport: "Swimming" },
      { name: "Khalid Al Nuaimi", accreditationNo: "UAE003", sport: "Powerlifting" },
      { name: "Noura Al Shamsi", accreditationNo: "UAE004", sport: "Table Tennis" },
      { name: "Rashid Al Falasi", accreditationNo: "UAE005", sport: "Wheelchair Basketball" },
    ],
    records: [
      { daysAgo: 0, athleteIndex: 3, kind: "illness", sportEvent: "Training - Table Tennis", diagnosis: "Gastroenteritis", affectedSystem: "gastrointestinal", mainSymptoms: "nausea, cramps", causeOfIllness: "infection", originalDaysLost: 2 },
      { daysAgo: 1, athleteIndex: 0, kind: "injury", sportEvent: "100m sprint", bodyPart: "hamstring", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 5, editedDaysLost: 3, status: "under_review" },
      { daysAgo: 2, athleteIndex: 4, kind: "injury", sportEvent: "Wheelchair Basketball match", bodyPart: "shoulder", injuryType: "tendinitis", causeOfInjury: "overuse", originalDaysLost: 7 },
      { daysAgo: 3, athleteIndex: 1, kind: "illness", sportEvent: "Training - Swimming", diagnosis: "Upper respiratory tract infection", affectedSystem: "respiratory", mainSymptoms: "cough, sore throat", causeOfIllness: "infection", originalDaysLost: 2, status: "resolved" },
      { daysAgo: 4, athleteIndex: 0, kind: "injury", sportEvent: "Long jump", bodyPart: "knee", injuryType: "sprain", causeOfInjury: "collision", originalDaysLost: 6, status: "under_review" },
      { daysAgo: 5, athleteIndex: 2, kind: "injury", sportEvent: "Powerlifting - training", bodyPart: "wrist", injuryType: "sprain", causeOfInjury: "equipment", originalDaysLost: 4 },
      { daysAgo: 6, athleteIndex: 3, kind: "injury", sportEvent: "Table Tennis - match", bodyPart: "ankle", injuryType: "sprain", causeOfInjury: "twisting movement", originalDaysLost: 6, editedDaysLost: 4, status: "resolved" },
      { daysAgo: 7, athleteIndex: 2, kind: "injury", sportEvent: "Powerlifting - competition", bodyPart: "back", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 3, status: "resolved" },
      { daysAgo: 9, athleteIndex: 1, kind: "illness", sportEvent: "Training - Swimming", diagnosis: "Migraine", affectedSystem: "neurological", mainSymptoms: "headache, light sensitivity", causeOfIllness: "other", originalDaysLost: 1, status: "resolved" },
      { daysAgo: 10, athleteIndex: 4, kind: "injury", sportEvent: "Wheelchair Basketball - training", bodyPart: "head", injuryType: "concussion", causeOfInjury: "collision", originalDaysLost: 10, status: "under_review" },
    ],
  },
  {
    npc: "India",
    name: "Dr. Arjun Mehta",
    email: "doctor.india@demo.parasports",
    phone: "+91 98765 43210",
    athletes: [
      { name: "Rohan Sharma", accreditationNo: "IND001", sport: "Athletics" },
      { name: "Priya Nair", accreditationNo: "IND002", sport: "Badminton" },
      { name: "Vikram Singh", accreditationNo: "IND003", sport: "Powerlifting" },
      { name: "Ananya Iyer", accreditationNo: "IND004", sport: "Swimming" },
      { name: "Karan Malhotra", accreditationNo: "IND005", sport: "Javelin Throw" },
    ],
    records: [
      { daysAgo: 0, athleteIndex: 1, kind: "illness", sportEvent: "Training - Badminton", diagnosis: "Common cold", affectedSystem: "respiratory", mainSymptoms: "runny nose, sneezing", causeOfIllness: "infection", originalDaysLost: 1, status: "resolved" },
      { daysAgo: 1, athleteIndex: 2, kind: "injury", sportEvent: "Powerlifting - competition", bodyPart: "elbow", injuryType: "dislocation", causeOfInjury: "collision", originalDaysLost: 10, status: "under_review" },
      { daysAgo: 2, athleteIndex: 0, kind: "injury", sportEvent: "Javelin - training", bodyPart: "shoulder", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 5 },
      { daysAgo: 3, athleteIndex: 4, kind: "injury", sportEvent: "Javelin Throw - training", bodyPart: "ankle", injuryType: "sprain", causeOfInjury: "fall", originalDaysLost: 5 },
      { daysAgo: 4, athleteIndex: 3, kind: "illness", sportEvent: "Training - Swimming", diagnosis: "Gastroenteritis", affectedSystem: "gastrointestinal", mainSymptoms: "nausea, vomiting", causeOfIllness: "infection", originalDaysLost: 3, editedDaysLost: 2, status: "resolved" },
      { daysAgo: 5, athleteIndex: 0, kind: "injury", sportEvent: "100m sprint", bodyPart: "wrist", injuryType: "fracture", causeOfInjury: "fall", originalDaysLost: 21, status: "under_review" },
      { daysAgo: 7, athleteIndex: 1, kind: "injury", sportEvent: "Badminton - match", bodyPart: "knee", injuryType: "sprain", causeOfInjury: "twisting movement", originalDaysLost: 8 },
      { daysAgo: 8, athleteIndex: 4, kind: "injury", sportEvent: "Javelin Throw - competition", bodyPart: "back", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 4, status: "resolved" },
      { daysAgo: 9, athleteIndex: 2, kind: "illness", sportEvent: "Training - Powerlifting", diagnosis: "Heat exhaustion", affectedSystem: "cardiovascular", mainSymptoms: "dizziness, fatigue", causeOfIllness: "environmental", originalDaysLost: 2, status: "resolved" },
    ],
  },
  {
    npc: "Japan",
    name: "Dr. Aiko Tanaka",
    email: "doctor.japan@demo.parasports",
    phone: "+81 90 1234 5678",
    athletes: [
      { name: "Haruto Sato", accreditationNo: "JPN001", sport: "Judo" },
      { name: "Yui Suzuki", accreditationNo: "JPN002", sport: "Athletics" },
      { name: "Sora Takahashi", accreditationNo: "JPN003", sport: "Table Tennis" },
      { name: "Hina Watanabe", accreditationNo: "JPN004", sport: "Swimming" },
      { name: "Ren Yamamoto", accreditationNo: "JPN005", sport: "Wheelchair Fencing" },
    ],
    records: [
      { daysAgo: 0, athleteIndex: 2, kind: "injury", sportEvent: "Table Tennis - training", bodyPart: "shoulder", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 4 },
      { daysAgo: 1, athleteIndex: 0, kind: "injury", sportEvent: "Judo - match", bodyPart: "head", injuryType: "concussion", causeOfInjury: "collision", originalDaysLost: 14, status: "under_review" },
      { daysAgo: 2, athleteIndex: 3, kind: "injury", sportEvent: "Swimming - training", bodyPart: "hip", injuryType: "contusion", causeOfInjury: "collision", originalDaysLost: 3, status: "resolved" },
      { daysAgo: 3, athleteIndex: 4, kind: "injury", sportEvent: "Wheelchair Fencing - training", bodyPart: "wrist", injuryType: "tendinitis", causeOfInjury: "overuse", originalDaysLost: 5 },
      { daysAgo: 4, athleteIndex: 1, kind: "illness", sportEvent: "Training - Athletics", diagnosis: "Influenza", affectedSystem: "respiratory", mainSymptoms: "fever, fatigue", causeOfIllness: "infection", originalDaysLost: 4, editedDaysLost: 5, status: "under_review" },
      { daysAgo: 5, athleteIndex: 0, kind: "illness", sportEvent: "Training - Judo", diagnosis: "Tonsillitis", affectedSystem: "ENT", mainSymptoms: "sore throat, fever", causeOfIllness: "infection", originalDaysLost: 3 },
      { daysAgo: 6, athleteIndex: 2, kind: "injury", sportEvent: "Table Tennis - training", bodyPart: "ankle", injuryType: "sprain", causeOfInjury: "fall", originalDaysLost: 6, status: "resolved" },
      { daysAgo: 8, athleteIndex: 1, kind: "injury", sportEvent: "400m sprint", bodyPart: "back", injuryType: "spasm", causeOfInjury: "overuse", originalDaysLost: 2, status: "resolved" },
      { daysAgo: 9, athleteIndex: 3, kind: "illness", sportEvent: "Training - Swimming", diagnosis: "Skin infection", affectedSystem: "dermatological", mainSymptoms: "rash, itching", causeOfIllness: "infection", originalDaysLost: 2, status: "resolved" },
    ],
  },
  {
    npc: "South Korea",
    name: "Dr. Min-jun Park",
    email: "doctor.korea@demo.parasports",
    phone: "+82 10 1234 5678",
    athletes: [
      { name: "Ji-ho Kim", accreditationNo: "KOR001", sport: "Archery" },
      { name: "Seo-yeon Lee", accreditationNo: "KOR002", sport: "Athletics" },
      { name: "Do-yoon Choi", accreditationNo: "KOR003", sport: "Boccia" },
      { name: "Ha-eun Jung", accreditationNo: "KOR004", sport: "Swimming" },
      { name: "Min-seo Kang", accreditationNo: "KOR005", sport: "Cycling" },
    ],
    records: [
      { daysAgo: 0, athleteIndex: 4, kind: "injury", sportEvent: "Cycling - training", bodyPart: "knee", injuryType: "sprain", causeOfInjury: "fall", originalDaysLost: 7, status: "under_review" },
      { daysAgo: 1, athleteIndex: 2, kind: "illness", sportEvent: "Training - Boccia", diagnosis: "Food poisoning", affectedSystem: "gastrointestinal", mainSymptoms: "vomiting, cramps", causeOfIllness: "infection", originalDaysLost: 2, status: "resolved" },
      { daysAgo: 2, athleteIndex: 1, kind: "injury", sportEvent: "400m sprint", bodyPart: "calf", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 5 },
      { daysAgo: 3, athleteIndex: 0, kind: "injury", sportEvent: "Archery - training", bodyPart: "shoulder", injuryType: "tendinitis", causeOfInjury: "overuse", originalDaysLost: 7, editedDaysLost: 4, status: "resolved" },
      { daysAgo: 4, athleteIndex: 1, kind: "injury", sportEvent: "Athletics - training", bodyPart: "neck", injuryType: "strain", causeOfInjury: "overuse", originalDaysLost: 3 },
      { daysAgo: 5, athleteIndex: 3, kind: "illness", sportEvent: "Training - Swimming", diagnosis: "Migraine", affectedSystem: "neurological", mainSymptoms: "headache, dizziness", causeOfIllness: "other", originalDaysLost: 1, status: "resolved" },
      { daysAgo: 7, athleteIndex: 4, kind: "illness", sportEvent: "Training - Cycling", diagnosis: "Bronchitis", affectedSystem: "respiratory", mainSymptoms: "cough, chest tightness", causeOfIllness: "infection", originalDaysLost: 4, status: "resolved" },
      { daysAgo: 8, athleteIndex: 2, kind: "injury", sportEvent: "Boccia - match", bodyPart: "hand", injuryType: "contusion", causeOfInjury: "equipment", originalDaysLost: 2, status: "resolved" },
      { daysAgo: 10, athleteIndex: 0, kind: "injury", sportEvent: "Archery - competition", bodyPart: "elbow", injuryType: "sprain", causeOfInjury: "collision", originalDaysLost: 5, status: "resolved" },
    ],
  },
];

function dateDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@asianparalympic.org";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashed, name: "Admin" },
    create: { email, password: hashed, name: "Admin" },
  });

  console.log(`Seeded admin user: ${email}`);
}

async function seedDemoTeams() {
  const hashedDemoPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const demo of DEMO_TEAMS) {
    const team = await prisma.teamUser.upsert({
      where: { email: demo.email },
      update: {
        npc: demo.npc,
        name: demo.name,
        phone: demo.phone,
        password: hashedDemoPassword,
        mustResetPassword: false,
      },
      create: {
        npc: demo.npc,
        name: demo.name,
        email: demo.email,
        phone: demo.phone,
        password: hashedDemoPassword,
        mustResetPassword: false,
      },
    });

    // Clear this team's prior demo data so the seed can be re-run safely.
    const priorDays = await prisma.teamDay.findMany({
      where: { teamUserId: team.id },
      select: { id: true },
    });
    await prisma.teamDayAthlete.deleteMany({
      where: { teamDayId: { in: priorDays.map((d) => d.id) } },
    });
    await prisma.teamDay.deleteMany({ where: { teamUserId: team.id } });
    await prisma.injury.deleteMany({ where: { teamUserId: team.id } });
    await prisma.illness.deleteMany({ where: { teamUserId: team.id } });

    const athleteIds: string[] = [];
    for (const athlete of demo.athletes) {
      const created = await prisma.athlete.upsert({
        where: { teamUserId_accreditationNo: { teamUserId: team.id, accreditationNo: athlete.accreditationNo } },
        update: { name: athlete.name, sport: athlete.sport },
        create: {
          teamUserId: team.id,
          name: athlete.name,
          accreditationNo: athlete.accreditationNo,
          sport: athlete.sport,
        },
      });
      athleteIds.push(created.id);
    }

    // Drop any athletes left over from a previous seed run that are no longer in the list.
    await prisma.athlete.deleteMany({
      where: { teamUserId: team.id, accreditationNo: { notIn: demo.athletes.map((a) => a.accreditationNo) } },
    });

    // Record a full team day for each of the last 12 days.
    const teamDayIdByDaysAgo = new Map<number, string>();
    for (let daysAgo = 0; daysAgo < 12; daysAgo++) {
      const teamDay = await prisma.teamDay.create({
        data: { teamUserId: team.id, date: dateDaysAgo(daysAgo) },
      });
      await prisma.teamDayAthlete.createMany({
        data: athleteIds.map((athleteId) => ({ teamDayId: teamDay.id, athleteId })),
      });
      teamDayIdByDaysAgo.set(daysAgo, teamDay.id);
    }

    for (const record of demo.records) {
      const athleteId = athleteIds[record.athleteIndex];
      const date = dateDaysAgo(record.daysAgo);

      if (record.kind === "injury") {
        await prisma.injury.create({
          data: {
            teamUserId: team.id,
            athleteId,
            sportEvent: record.sportEvent,
            injuryDate: date,
            bodyPart: record.bodyPart!,
            injuryType: record.injuryType!,
            causeOfInjury: record.causeOfInjury,
            originalDaysLost: record.originalDaysLost,
            editedDaysLost: record.editedDaysLost,
            timeLossStatus: record.editedDaysLost ? "edited" : "original",
            status: record.status ?? "logged",
          },
        });
      } else {
        await prisma.illness.create({
          data: {
            teamUserId: team.id,
            athleteId,
            sportEvent: record.sportEvent,
            occurredOn: date,
            diagnosis: record.diagnosis!,
            affectedSystem: record.affectedSystem,
            mainSymptoms: record.mainSymptoms,
            causeOfIllness: record.causeOfIllness,
            originalDaysLost: record.originalDaysLost,
            editedDaysLost: record.editedDaysLost,
            timeLossStatus: record.editedDaysLost ? "edited" : "original",
            status: record.status ?? "logged",
          },
        });
      }
    }

    console.log(`Seeded demo team: ${demo.npc} (${demo.email} / ${DEMO_PASSWORD})`);
  }
}

async function main() {
  await seedAdmin();
  await seedDemoTeams();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
