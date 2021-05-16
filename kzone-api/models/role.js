'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, UserRole }) {
      // define association here
      this.hasMany(UserRole, { foreignKey: 'roleId', as: 'userRoles' });
      this.belongsToMany(
        User,
        {
          through: 'user_role',
          foreignKey: 'roleId',
          otherKey: 'userId',
          as: 'users',
        });
    }
  };
  Role.init({
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
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'role',
    modelName: 'Role',
  });
  return Role;
};