'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Profile, Booking }) {
      // define association here
      this.hasOne(User, { foreignKey: 'employeeId', as: 'account' });
      this.hasOne(Profile, { foreignKey: 'employeeId', as: 'profile' });
      this.hasMany(Booking, { foreignKey: 'employeeId', as: 'bookings' });
    }

    toJSON() {
      return { ...this.get(), };
    }
  };
  Employee.init({
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
    avatar: {
      type: DataTypes.STRING
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'employee',
    modelName: 'Employee',
  });
  return Employee;
};