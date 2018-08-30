module.exports.productForm = (fields, files) => {
  let response = { error: false, message: '' };
  if (fields.name === '') {
    response.error = true;
    response.message = 'Не указано имя товара';
  }
  if (fields.price === '') {
    response.error = true;
    response.message = 'Не указана цена товара';
  }
  if (files.photo.name === '' || files.photo.size === 0) {
    response.error = true;
    response.message = 'Картинка продукта не загружена';
  }
  return response;
};

module.exports.skillForm = fields => {
  let response = { error: false, message: '' };
  if (fields.age === '') {
    response.error = true;
    response.message = 'Не заполнено поле Возраст';
  }
  if (fields.concerts === '') {
    response.error = true;
    response.message = 'Не заполнено поле Концертов';
  }
  if (fields.cities === '') {
    response.error = true;
    response.message = 'Не заполнено поле Число городов';
  }
  if (fields.years === '') {
    response.error = true;
    response.message = 'Не заполнено поле Лет на сцене';
  }
  return response;
};

module.exports.feedbackForm = fields => {
  let response = { error: false, message: '' };
  if (fields.name === '') {
    response.error = true;
    response.message = 'Не заполнено поле Имя';
  }
  if (fields.email === '') {
    response.error = true;
    response.message = 'Не заполнено поле EMail';
  }

  return response;
};
