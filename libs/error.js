module.exports = (err, req, res, next) => {
  console.error(err);
  const errMessage = err.status === 404 ? err.message : 'Внутренняя ошибка сервера';

  res.status(err.status || 500);
  res.render('pages/error', { status: err.status || 500, message: errMessage });
};
