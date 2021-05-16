'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RoomType }) {
      // define association here
      this.belongsTo(RoomType, { foreignKey: "roomTypeId", as: "roomType" });
    }

    toJSON() {
      return { ...this.get(), };
    }
  };
  Service.init({
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validator: {
        notNull: { msg: "Gia dich vu khong duoc de  trong" },
        isDecimal: { msg: "Gia dich vu la so" },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validator: {
        notNull: { msg: "Ten loai phong khong duoc de trong" },
        notEmpty: { msg: "Ten loai phong khong duoc rong!" },
      },
    },
  }, {
    sequelize,
    tableName: "service",
    modelName: 'Service',
  });
  return Service;
};