const OK_STATUS = 200;
const UNAUTHORIZED = 401;
const BAD_REQUEST_STATUS = 400;
const NOT_FOUND_STATUS = 404;
const SERVER_ERROR_STATUS = 500;
const commonErrTxt = 'Переданы некорректные данные в теле запроса. Подробнее:';

const processCommonErr = (res, err, errMsg = '') => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(BAD_REQUEST_STATUS).send({ message: `${(!errMsg) ? commonErrTxt : errMsg} ${err}` });
  }
  return res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` });
};

module.exports = {
  OK_STATUS,
  UNAUTHORIZED,
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  commonErrTxt,
  processCommonErr,
};
