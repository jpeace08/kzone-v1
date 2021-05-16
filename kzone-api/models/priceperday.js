'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PricePerDay extends Model {
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
  PricePerDay.init({
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
    numberOfPerson: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        notNull: { msg: "So luong phong nguoi khong duoc de trong" },
      }
    },
    numberOfBed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        notNull: { msg: "So luong phong giuong khong duoc de trong" },
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validator: {
        notNull: { msg: "Gia loai phong ngay khong duoc de  trong" },
        isDecimal: { msg: "Gia loai phong ngay la so" },
      }
    },
  }, {
    sequelize,
    tableName: "price_per_day",
    modelName: 'PricePerDay',
  });
  return PricePerDay;
};