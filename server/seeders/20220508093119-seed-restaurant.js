"use strict";

const data = [
  {
    name: "Cơm Tấm Cây Khế 3 - Nguyễn Văn Khối",
    address: "126 Nguyễn Văn Khối, P. 9, Gò Vấp, TP. HCM",
    image:
      "https://images.foody.vn/res/g13/126552/prof/s640x400/foody-upload-api-foody-mobile-8af8cb23-df69-4645-b-191022091826.jpg",
    category: "QUÁN ĂN",
  },
  {
    name: "Vĩnh Phong - Cửa Hàng Vịt Quay",
    address: "523 - 525 - 527 Phan Văn Trị, P. 7, Quận 5, TP. HCM",
    image:
      "https://images.foody.vn/res/g1/7071/prof/s280x175/file_restaurant_photo_8o5v_16382-22d9ce52-211130152213.jpg",
    category: "QUÁN ĂN",
  },
  {
    name: "Cơm Gà Hải Nam - Calmette",
    address: "205-207 Calmette, P. Nguyễn Thái Bình, Quận 1, TP. HCM",
    image:
      "https://images.foody.vn/res/g2/12906/prof/s280x175/image-0bf941cd-200910114154.jpeg",
    category: "QUÁN ĂN",
  },
];

data.map((item) => {
  item.createdAt = '2022-03-13 15:38:51';
  item.updatedAt = '2022-03-13 15:38:51';
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert("restaurants", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
