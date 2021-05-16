'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Employee, Customer }) {
      // define association here
      this.belongsTo(Employee, { foreignKey: "employeeId" });
      this.belongsTo(Customer, { foreignKey: "customerId" });
    }

    toJSON() {
      return { ...this.get(), };
    }
  };
  Profile.init({
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
        isValidFullName: (value) => {
          if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(value))
            throw new Error("Vui long nhap ho ten!");
        }
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      validator: {
        isDate: { msg: "Ngay sinh khong hop le" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validator: {
        isEmail: { msg: "Email khong hop le!" },
      },
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        notNull: { msg: "Dia chi khong duoc null" },
        notEmpty: { msg: "Dia chi khong duoc de trong!" },
      },
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        isValidPhoneNumber: (value) => {
          if (!/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(value))
            throw new Error("So dien thoai khong hop le!");
        }
      },
    },
  }, {
    sequelize,
    tableName: 'profile',
    modelName: 'Profile',
  });
  return Profile;
};