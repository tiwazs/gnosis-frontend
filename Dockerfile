# Build step
FROM node:16.20.0 as builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ARG GITHUB_ID
ENV GITHUB_ID=$GITHUB_ID

ARG GITHUB_SECRET
ENV GITHUB_SECRET=$GITHUB_SECRET

RUN npm run build

RUN npx prisma generate

# Production step
FROM node:16.20.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

COPY package*.json ./

RUN npm ci --only=production --quiet

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]