'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Customer, Employee, Room, BookingListRoom }) {
      // define association here
      this.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
      this.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
      this.hasMany(BookingListRoom, { foreignKey: "bookingId", as: "bookingListRooms" });
      this.belongsToMany(Room, { through: "booking_list_room", foreignKey: "bookingId", otherKey: "roomId", as: "rooms" });
    }

    toJSON() {
      return { ...this.get(), };
    }
  };
  Booking.init({
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    prepay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    checkinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    checkoutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    typeOfBooking: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    typeOfCustomer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    typeOfPayment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    refund: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalPerson: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        notNull: { msg: "Tong so khach hang khong duoc null" },
        notEmpty: { msg: "Tong so khach hang khong duoc de trong!" },
      },
    },
    totalRoomBooked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalServiceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalRoomAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: 'booking',
    modelName: 'Booking',
  });
  return Booking;
};