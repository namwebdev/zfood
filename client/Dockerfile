# Sử dụng một hình ảnh node.js làm cơ sở
FROM node:alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có) để cài đặt dependencies
COPY package.json .

# Cài đặt dependencies
RUN npm install

# Sao chép tất cả các tệp trong thư mục nguồn của ứng dụng vào container
COPY . .

# Make the .sh script executable
# RUN chmod +x ./generate-env.sh

# # Run the .sh script as part of the container's startup
# CMD ["./generate-env.sh"]

RUN npm run build

# Khởi động ứng dụng
CMD ["npm", "start"]
