'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          notNull: { msg: "Ten loai phong khong duoc de trong" },
          notEmpty: { msg: "Ten loai phong khong duoc rong!" },
        },
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Gia dich vu khong duoc de  trong" },
          isDecimal: { msg: "Gia dich vu la so" },
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validator: {
          notNull: { msg: "Ten loai phong khong duoc de trong" },
          notEmpty: { msg: "Ten loai phong khong duoc rong!" },
        },
      },
      roomTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        name: "fk_roomtype_room",
        references: {
          model: "room_type",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('service');
  }
};