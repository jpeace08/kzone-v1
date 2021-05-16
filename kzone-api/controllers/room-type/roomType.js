/**[ROOM TYPE] */

const {
  RoomType,
  Image,
  PricePerDay,
  Service,
  Room,
  Sequelize
} = require("../../models");

//search room type
const search = async (req, res, next) => {
  try {
    const { id = "", name = "", page = 0, size = 9999 } = req.params;
    let searchTerm = {
      offset: page,
      limit: size,
      include: [{
        model: PricePerDay,
        as: "pricePerDays",
      }],
    }, data = {};
    if (id) {
      searchTerm = {
        ...searchTerm,
        offset: 0,
        limit: 999,
        include: [
          ...searchTerm.include,
          {
            model: Image,
            as: "images",
          }
        ],
        where: { id, ...searchTerm.where },
      }
    }

    const { rows, count } = await RoomType.findAndCountAll(searchTerm);
    if (count > 0) {
      let roomTypes = rows.map(room => ({
        ...room.get(),
        createdAt: undefined,
        updatedAt: undefined,
        pricePerDays: room.pricePerDays.map(price => ({ ...price.get(), createdAt: undefined, updatedAt: undefined })),
      }));
      data = {
        contents: [...roomTypes],
        totalElement: count,
        currentPage: page,
        totalPage: count < size
          ? 1 : count % size == 0
            ? Math.floor(count / size)
            : (Math.floor(count / size) + 1)
      }
    }
    else {
      data = {
        contents: [],
        totalElement: count,
        totalPage: 0,
        currentPage: page,
      }
    }

    return res.status(200).json({
      code: 1,
      message: "Get data room types successfully!",
      data: {
        ...data,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Something went wrong with server, please try again!",
    })
  }
}

//create room type
const create = async (req, res, next) => {
  const {
    name,
    totalRoom,
    overNightPrice,
    shortTimePrice,
    surcharge,
    discountHoliday,
    discountGroup,
    bedNumber = 0,
    adultNumber,
    childNumber,
    description,
    smokeFriendly = true,
    petFriendly = true,
    images, //array
    pricePerDays, //array
  } = req.body;

  try {
    //TODO: validate data

    //TODO: create new room type
    const roomType = await RoomType.create({
      name,
      totalRoom,
      overNightPrice,
      shortTimePrice,
      surcharge,
      discountHoliday,
      discountGroup,
      bedNumber,
      adultNumber,
      childNumber,
      description,
      smokeFriendly,
      petFriendly,
    });

    //TODO: validate input

    //TODO: create new room type
    if (pricePerDays && pricePerDays.length > 0)
      for (const price of pricePerDays) {
        await roomType.createPricePerDay(price);
      }

    if (images && images.length > 0)
      for (const path of images) {
        await roomType.createImage({ path });
      }

    let roomTypes = await RoomType.findOne({
      where: { id: roomType.id },
      include: [
        {
          model: PricePerDay,
          as: "pricePerDays",
          require: false,
        },
        {
          model: Image,
          as: "images",
        }
      ],
    })

    return res.status(200).json({
      code: 1,
      message: "Create new room types successfully!",
      data: {
        ...roomTypes.get(),
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Something went wrong with server, please try again!",
    })
  }
}

//update room type
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      totalRoom,
      overNightPrice,
      shortTimePrice,
      surcharge,
      discountHoliday,
      discountGroup,
      bedNumber,
      adultNumber,
      childNumber,
      description,
      smokeFriendly = true,
      petFriendly = true,
      images,
      pricePerDays,
    } = req.body;
    let oldPrices = [], newPrices = [];

    //TODO: validate input
    if (!id) {
      return res.status(400).json({
        code: 0,
        message: "Id is not empty!",
        data: {},
      });
    }

    //TODO: update room type
    await RoomType.update({
      name,
      totalRoom,
      overNightPrice,
      shortTimePrice,
      surcharge,
      discountHoliday,
      discountGroup,
      bedNumber,
      adultNumber,
      childNumber,
      description,
      smokeFriendly,
      petFriendly,
    }, {
      where: { id },
    });

    //TODO: seperate prices
    pricePerDays.forEach(price => {
      if (price.id != undefined) {
        oldPrices.push(price);
      }
      else newPrices.push(price);
    })
    //TODO: find price per day
    let prices = await PricePerDay.findAll({
      where: { roomTypeId: id }
    });
    //TODO: filter price remove
    let priceRemoves = prices.filter(p => !oldPrices.map(i => i.id).includes(p.id));

    //TODO: update old price
    for (const price of prices) {
      let info = oldPrices.find(p => p.id == price.id);
      if (info) {
        await PricePerDay.update({
          price: info.value,
          numberOfBed: info.numberOfBed,
          numberOfPerson: info.numberOfPerson,
        }, {
          where: {
            id: info.id
          }
        });
      }
    }

    //TODO: add new prices
    if (newPrices && newPrices.length > 0) {
      for (const price of newPrices) {
        await PricePerDay.create({
          price: price.price,
          numberOfBed: price.numberOfBed,
          numberOfPerson: price.numberOfPerson,
          roomTypeId: id,
        });
      }
    }

    //TODO: remove price
    if (priceRemoves && priceRemoves.length > 0) {
      for (const price of priceRemoves) {
        await price.destroy();
      }
    }

    //TODO: add new images
    if (images.length > 0) {
      for (const img of images) {
        await Image.create({ path: img, roomTypeId: id });
      }
    }

    let roomType = await RoomType.findOne({
      where: { id },
      include: [
        {
          model: PricePerDay,
          as: "pricePerDays",
          require: false,
        },
        {
          model: Image,
          as: "images",
        }
      ],
    });
    return res.status(200).json({
      code: 1,
      message: "Update type of room successfully!",
      data: roomType,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Something went wrong, please try again!",
      data: {},
    });
  }
}

//delete room type
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    //TODO: check room exist 
    const { rows, count } = await Room.findAndCountAll({ where: { roomTypeId: id } });
    if (count > 0) {
      return res.status(400).json({
        code: 0,
        message: "Khong the xoa loai phong nay!",
        data: {},
      });
    }

    const countRemoved = await RoomType.destroy({
      where: { id },
    });
    if (countRemoved > 0) {
      return res.status(200).json({
        code: 1,
        message: "Xoa loai phong thanh cong!",
        data: {},
      });
    }
    else
      return res.status(400).json({
        code: 0,
        message: "Xoa loai phong khong thanh cong!",
        data: {},
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Something went wrong, please try again!",
      data: {},
    });
  }
}


module.exports = {
  search,
  create,
  update,
  remove,
}