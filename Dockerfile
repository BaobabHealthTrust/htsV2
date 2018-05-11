FROM node:8.4.0

# Copy all local files into the image
COPY . .

RUN npm install --silent

EXPOSE 3000

CMD ["npm", "run", "docker"]