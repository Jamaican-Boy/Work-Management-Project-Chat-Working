const multer = require("multer");

// create multer storage
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

module.exports = storage;
