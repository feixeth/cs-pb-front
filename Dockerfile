FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Serve the build via a simple static server
RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
