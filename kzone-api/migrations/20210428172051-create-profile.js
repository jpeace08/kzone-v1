'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profile', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          isValidFullName: (value) => {
            if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(value))
              throw new Error("Vui long nhap ho ten!");
          }
        },
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
        validator: {
          isDate: { msg: "Ngay sinh khong hop le" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validator: {
          isEmail: { msg: "Email khong hop le!" },
        },
      },
      gender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          notNull: { msg: "Dia chi khong duoc null" },
          notEmpty: { msg: "Dia chi khong duoc de trong!" },
        },
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          isValidPhoneNumber: (value) => {
            if (!/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(value))
              throw new Error("So dien thoai khong hop le!");
          }
        },
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        name: "fk_profile_customer",
        references: {
          model: "customer",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        name: "fk_profile_employee",
        references: {
          model: "employee",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profile');
  }
};