
export $(cat .env.test | xargs) && npx prisma migrate dev

