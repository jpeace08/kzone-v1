'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Booking, User, Profile }) {
      // define association here
      this.hasMany(Booking, { foreignKey: "customerId", as: "booking" });
      this.hasOne(User, { foreignKey: 'customerId', as: 'account' });
      this.hasOne(Profile, { foreignKey: 'customerId', as: 'profile' });
    }
    toJSON() {
      return { ...this.get(), };
    }
  };
  Customer.init({
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
    identifyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        isValidIdentify: (value) => {

        },
        notNull: { msg: "So can cuoc cong dan khong duoc null" },
        notEmpty: { msg: "So can cuoc cong dan khong duoc de trong!" },
      },
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: 'customer',
    modelName: 'Customer',
  });
  return Customer;
};