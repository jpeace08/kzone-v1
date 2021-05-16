'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Seq lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, UserRole, Customer, Employee }) {
      // define association here
      this.belongsTo(Customer, { foreignKey: 'customerId' });
      this.belongsTo(Employee, { foreignKey: 'employeeId' });
      this.hasMany(UserRole, { foreignKey: 'userId' });
      this.belongsToMany(
        Role,
        {
          through: 'user_role',
          foreignKey: 'userId',
          otherKey: 'roleId',
          as: 'roles',
        }
      );
    }
    toJSON() {
      return { ...this.get(), };
    }
  };
  User.init({
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        validateUsername: (value) => {
          if (!/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value))
            throw new Error("Ten dang nhap khong hop le");
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        validatePassword: (value) => {
          if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value))
            throw new Error("Mat khau chua hop le (toi thieu 8 ky tu, bao gom chu hoa, chu thuong, va so)");
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'user',
    modelName: 'User',
  });
  return User;
};