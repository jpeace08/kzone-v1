'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('price_per_day', {
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
      numberOfPerson: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "So luong phong nguoi khong duoc de trong" },
        }
      },
      numberOfBed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "So luong phong giuong khong duoc de trong" },
        }
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Gia loai phong ngay khong duoc de  trong" },
          isDecimal: { msg: "Gia loai phong ngay la so" },
        }
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
    await queryInterface.dropTable('price_per_day');
  }
};