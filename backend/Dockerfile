FROM node:20-alpine

WORKDIR /app

# ✅ FIX: install CA certificates for HTTPS
RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]