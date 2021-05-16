'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RoomType }) {
      // define association here
      this.belongsTo(RoomType, { foreignKey: "roomTypeId", as: "roomType" });
    }
    toJSON() {
      return { ...this.get(), };
    }
  };
  Image.init({
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "no-image.jpg",
      validator: {
        isValidFile: (value) => {
          if (!/\.(jpe?g|png|gif|bmp)$/i.test(value))
            throw new Error("Dinh dang file khong duoc ho tro (support: jpg, jpeg, png, gif, bmp)");
        }
      },
    },
  }, {
    sequelize,
    tableName: 'image',
    modelName: 'Image',
  });
  return Image;
};