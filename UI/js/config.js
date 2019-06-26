/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { authtoken } = localStorage;

const devURL = 'http://localhost:3000/api/v1/';
// const userURL = 'http://localhost:5001/api/v2/users/';

const fetcher = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      authtoken,
    }),
    body: JSON.stringify(body),
  };
  const response = await fetch(url, object);
  const statusCode = response.status;
  const responseObj = await response.json();
  console.log(responseObj);
  return { responseObj, statusCode };
};
