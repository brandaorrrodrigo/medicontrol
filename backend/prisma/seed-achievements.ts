import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  // Medication Achievements
  {
    title: 'Primeira Dose',
    description: 'Tome seu primeiro medicamento',
    category: 'medication',
    rarity: 'common',
    icon: 'pill',
    total: 1,
    xp: 10,
  },
  {
    title: 'Pontualidade',
    description: 'Tome 10 medicamentos no horário correto',
    category: 'medication',
    rarity: 'common',
    icon: 'clock',
    total: 10,
    xp: 50,
  },
  {
    title: 'Aderência Completa',
    description: 'Tome 50 medicamentos',
    category: 'medication',
    rarity: 'rare',
    icon: 'trophy',
    total: 50,
    xp: 150,
  },
  {
    title: 'Mestre da Pontualidade',
    description: 'Tome 100 medicamentos no horário',
    category: 'medication',
    rarity: 'epic',
    icon: 'medal',
    total: 100,
    xp: 500,
  },

  // Consistency Achievements (Streaks)
  {
    title: '3 Dias Seguidos',
    description: 'Mantenha uma sequência de 3 dias',
    category: 'consistency',
    rarity: 'common',
    icon: 'fire',
    total: 3,
    xp: 30,
  },
  {
    title: 'Semana Perfeita',
    description: 'Mantenha uma sequência de 7 dias',
    category: 'consistency',
    rarity: 'rare',
    icon: 'trophy',
    total: 7,
    xp: 100,
  },
  {
    title: 'Mês Impecável',
    description: 'Mantenha uma sequência de 30 dias',
    category: 'consistency',
    rarity: 'epic',
    icon: 'medal',
    total: 30,
    xp: 500,
  },
  {
    title: '100 Dias de Ouro',
    description: 'Mantenha uma sequência de 100 dias',
    category: 'consistency',
    rarity: 'legendary',
    icon: 'crown',
    total: 100,
    xp: 2000,
  },

  // Exams Achievements
  {
    title: 'Primeiro Exame',
    description: 'Registre seu primeiro exame',
    category: 'exams',
    rarity: 'common',
    icon: 'clipboard',
    total: 1,
    xp: 15,
  },
  {
    title: 'Check-up Regular',
    description: 'Registre 10 exames',
    category: 'exams',
    rarity: 'rare',
    icon: 'heart',
    total: 10,
    xp: 100,
  },
  {
    title: 'Vigilante da Saúde',
    description: 'Registre 25 exames',
    category: 'exams',
    rarity: 'epic',
    icon: 'shield',
    total: 25,
    xp: 300,
  },

  // Vitals Achievements
  {
    title: 'Primeiro Sinal Vital',
    description: 'Registre seu primeiro sinal vital',
    category: 'vitals',
    rarity: 'common',
    icon: 'activity',
    total: 1,
    xp: 10,
  },
  {
    title: 'Monitor da Saúde',
    description: 'Registre 20 sinais vitais',
    category: 'vitals',
    rarity: 'rare',
    icon: 'heart-pulse',
    total: 20,
    xp: 100,
  },
  {
    title: 'Guardião Vital',
    description: 'Registre 50 sinais vitais',
    category: 'vitals',
    rarity: 'epic',
    icon: 'heartbeat',
    total: 50,
    xp: 250,
  },

  // Special Achievements
  {
    title: 'Bem-vindo!',
    description: 'Complete seu perfil pela primeira vez',
    category: 'special',
    rarity: 'common',
    icon: 'user',
    total: 1,
    xp: 20,
  },
  {
    title: 'Explorador',
    description: 'Explore todas as funcionalidades do app',
    category: 'special',
    rarity: 'rare',
    icon: 'compass',
    total: 1,
    xp: 150,
  },
  {
    title: 'Dedicação Total',
    description: 'Use o app por 90 dias consecutivos',
    category: 'special',
    rarity: 'legendary',
    icon: 'star',
    total: 90,
    xp: 3000,
  },
  {
    title: 'Primeira Consulta',
    description: 'Registre sua primeira consulta',
    category: 'special',
    rarity: 'common',
    icon: 'calendar',
    total: 1,
    xp: 20,
  },
  {
    title: 'Saúde em Dia',
    description: 'Tenha 95% de adesão ao tratamento por um mês',
    category: 'special',
    rarity: 'epic',
    icon: 'check-circle',
    total: 1,
    xp: 500,
  },
]

async function seedAchievements() {
  console.log('🎮 Seeding achievements...')

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: achievement,
      create: achievement,
    })
    console.log(`✅ Created/Updated: ${achievement.title}`)
  }

  console.log('🎉 Achievements seeded successfully!')
}

seedAchievements()
  .catch((error) => {
    console.error('❌ Error seeding achievements:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
