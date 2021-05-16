'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room', {
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
      roomNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          notNull: { msg: "So phong khong duoc de trong" },
        },
      },
      numberOfBed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validator: {
          notNull: { msg: "So giuong khong duoc de trong" },
          isInt: { msg: "So giuong phai la so nguyen" },
        },
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "Tang khong duoc de trong" },
          isInt: { msg: "Tang phai la so nguyen" },
        },
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validator: {
          isInt: { msg: "Trang thai phong la so nguyen" },
          isValidInput: (value) => {
            const val = parseInt(value);
            if (val !== 0 || val !== 1 || val !== 1)
              throw new Error("Trang thai phong khong hop le");
          }
        },
      },
      roomTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('room');
  }
};