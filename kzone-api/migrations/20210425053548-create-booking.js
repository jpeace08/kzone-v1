'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('booking', {
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
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      prepay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      checkinDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      checkoutDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      typeOfBooking: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      typeOfCustomer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      typeOfPayment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      refund: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalPerson: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validator: {
          notNull: { msg: "Tong so khach hang khong duoc null" },
          notEmpty: { msg: "Tong so khach hang khong duoc de trong!" },
        },
      },
      totalRoomBooked: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      totalServiceAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalRoomAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalPayment: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        name: "fk_booking_employee",
        references: {
          model: "employee",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        name: "fk_booking_customer",
        references: {
          model: "customer",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade"
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
    await queryInterface.dropTable('booking');
  }
};