const formidable = require('formidable');
const path = require('path');

module.exports = function (req, upload) {
  return new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm();
    const upload = path.join('./public', 'upload');

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      return resolve({ fields: fields, files: files });
    });
  });
};
