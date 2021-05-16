'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
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
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          validateUsername: (value) => {
            if (!/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value))
              throw new Error("Ten dang nhap khong hop le");
          }
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
          validatePassword: (value) => {
            if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value))
              throw new Error("Mat khau chua hop le (toi thieu 8 ky tu, bao gom chu hoa, chu thuong, va so)");
          },
        },
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        name: "fk_user_customer",
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
        name: "fk_user_employee",
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
    await queryInterface.dropTable('user');
  }
};