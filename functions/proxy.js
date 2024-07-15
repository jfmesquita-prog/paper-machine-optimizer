const axios = require('axios');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsyy8zD8hd3ZoycKgAOrJ9M02O5zmJcXisuaTiy-NQ2c1IrlF9kAE8UaRzdCPaka--/exec';

exports.handler = async function(event, context) {
  console.log('Função proxy iniciada');
  console.log('Método HTTP:', event.httpMethod);
  console.log('Corpo da requisição:', event.body);

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

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Dados enviados para o Google Apps Script:', body);
    
    const response = await axios.post(SCRIPT_URL, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Resposta bruta do Google Apps Script:', response.data);

    // Garantir que a resposta é um objeto JSON válido
    let responseData;
    if (typeof response.data === 'string') {
      responseData = JSON.parse(response.data);
    } else {
      responseData = response.data;
    }

    console.log('Resposta processada do Google Apps Script:', responseData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Erro detalhado:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request', 
        details: error.message 
      })
    };
  }
};
