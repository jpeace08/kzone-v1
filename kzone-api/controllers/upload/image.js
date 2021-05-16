/**[IMAGE] */

const singleImage = async (req, res, next) => {
  try {
    if (req.file && req.file.filename) {
      return res.status(200).json({
        code: 1,
        message: "Upload successfully!",
        data: {
          filename: req.file.filename,
        }
      })
    }
    else {
      return res.status(400).json({
        code: 0,
        message: "Upload failed!",
        data: {}
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Upload failed!",
      data: {}
    })
  }
}

const multipleImages = (req, res, next) => {
  try {

  } catch (error) {

  }
}

module.exports = {
  singleImage,
  multipleImages,
}