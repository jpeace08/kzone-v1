'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room_type', {
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
      totalRoom: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validator: {
          notNull: { msg: "So luong phong khong duoc de trong" },
        }
      },
      overNightPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Gia loai phong qua dem khong duoc de  trong" },
          isDecimal: { msg: "Gia loai phong qua dem la so" },
        }
      },
      shortTimePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Gia loai phong ngan gio khong duoc de  trong" },
          isDecimal: { msg: "Gia loai phong ngan gio la so" },
        }
      },
      surcharge: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validator: {
          notNull: { msg: "Phu thu khong duoc de  trong" },
          isDecimal: { msg: "Phu thu la so" },
        }
      },
      discountHoliday: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          min: 0,
          max: 100,
          notNull: { msg: "% giam gia ngay le khong duoc de trong" },
          isDecimal: { msg: "% giam gia ngay le la so" },
        }
      },
      discountGroup: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          min: 0,
          max: 100,
          notNull: { msg: "% giam gia khach doan khong duoc de trong" },
          isDecimal: { msg: "% giam gia khach doan la so" },
        }
      },
      bedNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "So luong giuong khong duoc null" },
          isInt: { msg: "So luong giuong phai la so nguyen" },
        }
      },
      adultNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "So luong nguoi lon khong duoc de trong" },
          isInt: { msg: "So luong nguoi lon phai la so nguyen" },
          isBiggerThanZero: (value) => {
            if (parseInt(value) > 0) {
              throw new Error("So luong nguoi lon phai lon hon 0");
            }
          }
        },
      },
      childNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "So luong tre em khong duoc de trong" },
          isInt: { msg: "So luong tre em phai la so nguyen" },
          isBiggerThanZero: (value) => {
            if (parseInt(value) > 0) {
              throw new Error("So luong tre em phai lon hon 0");
            }
          }
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validator: {
          notNull: { msg: "Mo ta khong duoc null" },
          isEmpty: { msg: "Mo ta khong duoc de trong" },
        },
      },
      smokeFriendly: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      petFriendly: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('room_type');
  }
};