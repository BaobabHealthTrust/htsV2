FROM node:8.4.0

# Copy all local files into the image
COPY . .

RUN npm install --verbose

EXPOSE 3000

CMD ["npm", "run", "docker"]