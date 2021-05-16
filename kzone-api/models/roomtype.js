'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PricePerDay, Room, Image, Service }) {
      // define association here
      this.hasMany(PricePerDay, { foreignKey: "roomTypeId", as: "pricePerDays" });
      this.hasMany(Room, { foreignKey: "roomTypeId", as: "rooms" });
      this.hasMany(Image, { foreignKey: "roomTypeId", as: "images" });
      this.hasMany(Service, { foreignKey: "roomTypeId", as: "services" });
    }
    toJSON() {
      return { ...this.get(), };
    }

  };
  RoomType.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        notNull: { msg: "Ten loai phong khong duoc de trong" },
        notEmpty: { msg: "Ten loai phong khong duoc rong!" },
      },
    },
    totalRoom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validator: {
        notNull: { msg: "So luong phong khong duoc de trong" },
      }
    },
    overNightPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validator: {
        notNull: { msg: "Gia loai phong qua dem khong duoc de  trong" },
        isDecimal: { msg: "Gia loai phong qua dem la so" },
      }
    },
    shortTimePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validator: {
        notNull: { msg: "Gia loai phong ngan gio khong duoc de  trong" },
        isDecimal: { msg: "Gia loai phong ngan gio la so" },
      }
    },
    surcharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validator: {
        notNull: { msg: "Phu thu khong duoc de  trong" },
        isDecimal: { msg: "Phu thu la so" },
      }
    },
    discountHoliday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        min: 0,
        max: 100,
        notNull: { msg: "% giam gia ngay le khong duoc de trong" },
        isDecimal: { msg: "% giam gia ngay le la so" },
      }
    },
    discountGroup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        min: 0,
        max: 100,
        notNull: { msg: "% giam gia khach doan khong duoc de trong" },
        isDecimal: { msg: "% giam gia khach doan la so" },
      }
    },
    bedNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        notNull: { msg: "So luong giuong khong duoc null" },
        isInt: { msg: "So luong giuong phai la so nguyen" },
      }
    },
    adultNumber: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
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
      type: DataTypes.TEXT,
      allowNull: false,
      validator: {
        notNull: { msg: "Mo ta khong duoc null" },
        isEmpty: { msg: "Mo ta khong duoc de trong" },
      },
    },
    smokeFriendly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    petFriendly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "room_type",
    modelName: 'RoomType',
  });

  return RoomType;
};