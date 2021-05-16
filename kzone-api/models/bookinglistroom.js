'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingListRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Booking, Room }) {
      // define association here
      this.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });
      this.belongsTo(Room, { foreignKey: "roomId", as: "room" });
    }
    toJSON() {
      return { ...this.get(), };
    }
  };
  BookingListRoom.init({
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validator: {
        notNull: { msg: "Gia phong ngay khong duoc de  trong" },
        isDecimal: { msg: "Gia phong ngay la so" },
      }
    },
    numberOfAdult: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        min: 1,
        notNull: { msg: "So luong khach khong duoc null" },
        notEmpty: { msg: "So luong khach khong duoc de trong!" },
        isInt: { msg: "So luong khach phai la so nguyen" },
      },
    },
    numberOfChild: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        min: 1,
        notNull: { msg: "So luong tre em khong duoc null" },
        notEmpty: { msg: "So luong tre em khong duoc de trong!" },
        isInt: { msg: "So luong tre em phai la so nguyen" },
      },
    },
  }, {
    sequelize,
    tableName: 'booking_list_room',
    modelName: 'BookingListRoom',
  });
  return BookingListRoom;
};