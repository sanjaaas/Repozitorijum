FROM node:20

WORKDIR /app


COPY package*.json ./

RUN npm install
RUN npm install react-scripts@5.0.1


COPY . .

EXPOSE 3000
CMD HOST=0.0.0.0 npm start