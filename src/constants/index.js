// adopted from: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const RESPONSE_CODES = {
  SUCCESS: {
    status: 200,
    message: 'SUCCESS',
  },
  NOT_FOUND: {
    status: 404,
    message: 'NOT_FOUND',
  },
  INTERNAL_ERROR: {
    status: 500,
    message: 'INTERNAL_ERROR',
  },
  BAD_REQUEST: {
    status: 400,
    message: 'BAD_REQUEST',
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    status: 403,
    message: 'FORBIDDEN',
  },
  NO_CONTENT: {
    status: 200,
    message: 'NOTHING_TO_UPDATE',
  },
  API_REQUEST_FAILED: {
    status: 405,
    message: 'API REQUEST FAILED',
  },
  API_METHOD_ERROR: {
    status: 406,
    message: 'DAILY API METHOD FAILED',
  },
};

export default RESPONSE_CODES;
