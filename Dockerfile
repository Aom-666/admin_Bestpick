# Dockerfile สำหรับ React
# สร้าง build สำหรับ React ด้วย Node.js
FROM node:14 AS build

# กำหนดโฟลเดอร์ทำงานใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โค้ดทั้งหมดมาใน container
COPY . .

# สร้าง build ของ React
RUN npm run build

# ใช้ Nginx serve ไฟล์ build ของ React
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# เปิดพอร์ต 80
EXPOSE 80

# รัน Nginx
CMD ["nginx", "-g", "daemon off;"]
