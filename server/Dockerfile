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

# RUN chmod +x start.sh

# CMD ["start.sh"]

# Khởi động ứng dụng
CMD ["npm", "start"]
