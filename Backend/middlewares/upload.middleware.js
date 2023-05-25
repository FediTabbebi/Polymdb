const multer = require('multer');
const fs = require('fs');
const path = require('path');


// upload picture
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    callback(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const fileFilter = function (req, file, callback) {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return callback(null, false);
  }
  callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;