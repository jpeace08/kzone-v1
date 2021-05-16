const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }

    let extension = file.originalname.split(".").pop();
    let fileName = `${Date.now()}.${extension}`;
    callback(null, fileName);
  }
});

const upload = multer({ storage });

module.exports = {
  upload,
}