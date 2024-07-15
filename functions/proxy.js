const axios = require('axios');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsyy8zD8hd3ZoycKgAOrJ9M02O5zmJcXisuaTiy-NQ2c1IrlF9kAE8UaRzdCPaka--/exec';

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    let response;
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      response = await axios.post(SCRIPT_URL, body);
    } else {
      response = await axios.get(SCRIPT_URL);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'An error occurred while processing your request' })
    };
  }
};
