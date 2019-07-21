/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { token } = localStorage;


// const devURL = 'http://localhost:3000/api/v1/';
const devURL = 'https://andela-automart-amos.herokuapp.com/api/v1/';
// const userURL = 'http://localhost:5001/api/v2/users/';

const fetcher = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      token,
    }),
    body: JSON.stringify(body),
  };
  // console.log(object);
  const response = await fetch(url, object);
  // console.log(response);
  const statusCode = response.status;
  const responseObj = await response.json();
  // console.log(responseObj);
  return { responseObj, statusCode };
};
