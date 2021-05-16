'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('booking_list_room', {
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
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Gia phong ngay khong duoc de  trong" },
          isDecimal: { msg: "Gia phong ngay la so" },
        }
      },
      numberOfAdult: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          min: 1,
          notNull: { msg: "So luong khach khong duoc null" },
          notEmpty: { msg: "So luong khach khong duoc de trong!" },
          isInt: { msg: "So luong khach phai la so nguyen" },
        },
      },
      numberOfChild: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          min: 1,
          notNull: { msg: "So luong tre em khong duoc null" },
          notEmpty: { msg: "So luong tre em khong duoc de trong!" },
          isInt: { msg: "So luong tre em phai la so nguyen" },
        },
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        name: "fk_booking_list_room_booking",
        references: {
          model: "booking",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        name: "fk_booking_list_room_rom",
        references: {
          model: "room",
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
    await queryInterface.dropTable('booking_list_room');
  }
};