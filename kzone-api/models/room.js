'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RoomType, BookingListRoom, Booking }) {
      // define association here
      this.belongsTo(RoomType, { foreignKey: "roomTypeId", as: "roomType" });
      this.hasMany(BookingListRoom, { foreignKey: "roomId", as: "bookingListRooms" });
      this.belongsToMany(Booking, { through: "booking_list_room", foreignKey: "roomId", otherKey: "bookingId", as: "bookings" });
    }

    toJSON() {
      return { ...this.get(), };
    }
  };
  Room.init({
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
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        notNull: { msg: "So phong khong duoc de trong" },
      },
    },
    numberOfBed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validator: {
        notNull: { msg: "So phong giuong duoc de trong" },
        isInt: { msg: "So giuong phai la so nguyen" },
      },
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        notNull: { msg: "Tang khong duoc de trong" },
        isInt: { msg: "Tang phai la so nguyen" },
      },
    },
    status: {
      type: DataTypes.INTEGER,
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
  }, {
    sequelize,
    tableName: 'room',
    modelName: 'Room',
  });
  return Room;
};