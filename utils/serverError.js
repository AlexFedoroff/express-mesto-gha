const { SERVER_ERROR_STATUS } = require('./errors');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR_STATUS;
  }
}

module.exports = ServerError;
