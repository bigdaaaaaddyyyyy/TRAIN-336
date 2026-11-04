import 'dotenv/config';
import { PrismaService } from '../src/database/database.service';

const professions = [
  { name: 'Software Engineer', category: 'Technology' },
  { name: 'Data Analyst', category: 'Technology' },
  { name: 'Cybersecurity Specialist', category: 'Technology' },
  { name: 'Doctor', category: 'Healthcare' },
  { name: 'Nurse', category: 'Healthcare' },
  { name: 'Pharmacist', category: 'Healthcare' },
  { name: 'Entrepreneur', category: 'Business' },
  { name: 'Business Analyst', category: 'Business' },
  { name: 'Accountant', category: 'Finance' },
  { name: 'Banker', category: 'Finance' },
  { name: 'Financial Analyst', category: 'Finance' },
  { name: 'Civil Engineer', category: 'Engineering' },
  { name: 'Mechanical Engineer', category: 'Engineering' },
  { name: 'Electrical Engineer', category: 'Engineering' },
  { name: 'Designer', category: 'Creative' },
  { name: 'Writer', category: 'Creative' },
  { name: 'Photographer', category: 'Creative' },
  { name: 'Teacher', category: 'Education' },
  { name: 'Lecturer', category: 'Education' },
  { name: 'Researcher', category: 'Education' },
  { name: 'Other', category: 'Other' },
] as const;

async function seedProfessions() {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();

    for (const profession of professions) {
      await prisma.profession.upsert({
        where: { name: profession.name },
        update: { category: profession.category, isActive: true },
        create: profession,
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

seedProfessions().catch((error: unknown) => {
  console.error('Profession seed failed', error);
  process.exitCode = 1;
});