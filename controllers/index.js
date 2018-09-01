const path = require('path');
const db = require('../models/db');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const validation = require('../libs/validation');
const password = require('../libs/password');
const formparser = require('../libs/formparser');
const nodemailer = require('nodemailer');
const config = require('../config/index.json');

module.exports.index = function (req, res) {
  const productList = db.getState().products || [];
  const skillList = db.getState().skills || [];
  const msgsemail = req.flash('msgsemail').join();
  res.render('pages/index', {
    products: productList,
    skills: skillList,
    msgsemail: msgsemail
  });
};
module.exports.sendMessage = function (req, res, next) {
  const valres = validation.feedbackForm(req.body);

  if (valres.error) {
    req.flash('msgsemail', valres.message);
    return res.redirect('/');
  }

  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req.body.message.trim().slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) return next(error);
    req.flash('msgsemail', 'Письмо успешно отправлено!');
    return res.redirect('/');
  });
};
module.exports.admin = function (req, res) {
  const skillList = db.getState().skills || [];
  res.render('pages/admin', {
    msgskill: req.flash('msgskill').join(),
    msgfile: req.flash('msgfile').join(),
    skillList: skillList
  });
};
module.exports.login = function (req, res) {
  if (req.session.isAdmin) {
    res.redirect('/admin');
  } else {
    const msgslogin = req.flash('msgslogin').join();
    res.render('pages/login', { msgslogin: msgslogin });
  }
};
module.exports.skillAdd = function (req, res, next) {
  const valres = validation.skillForm(req.body);
  if (valres.error) {
    req.flash('msgskill', valres.message);
  } else {
    for (let key in req.body) {
      db.get('skills')
        .find({ id: key })
        .assign({ number: req.body[key] })
        .write();
    }
    req.flash('msgskill', 'Данные успешно измененны.');
  }
  res.redirect('/admin');
};

module.exports.productAdd = function (req, res, next) {
  let response = '';
  let files;
  let fields;

  formparser(req)
    .then(result => {
      files = result.files;
      fields = result.fields;
      return validation.productForm(fields, files);
    })
    .then(result => {
      if (result.error) {
        response = result.message;
        return unlink(files.photo.path);
      } else {
        db.get('products')
          .push({
            src: path.join('upload', path.basename(files.photo.path)),
            name: fields.name,
            price: fields.price
          })
          .write();
        response = 'Продукт успешно добавлен.';
      }
    })
    .then(() => {
      req.flash('msgfile', response);
      res.redirect('/admin');
    })
    .catch(err => {
      next(err);
    });
};

module.exports.auth = function (req, res, next) {
  req.session.isAdmin = password.authentication(req.body.email, req.body.password);

  if (req.session.isAdmin) {
    res.redirect('/admin');
  } else {
    req.flash('msgslogin', 'Пользователь с такой электронной почтой или паролем не найден');
    res.redirect('/login');
  }
};
