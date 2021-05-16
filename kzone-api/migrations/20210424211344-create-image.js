'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image', {
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
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "no-image.jpg",
        validator: {
          isValidFile: (value) => {
            if (!/\.(jpe?g|png|gif|bmp)$/i.test(value))
              throw new Error("Dinh dang file khong duoc ho tro (support: jpg, jpeg, png, gif, bmp)");
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
    await queryInterface.dropTable('image');
  }
};