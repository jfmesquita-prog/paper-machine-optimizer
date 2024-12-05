const fetch = require('node-fetch');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZABLbZ0G9M4emPCzXHF_eX5-Dfl09q4FIUYmv-mEOsfmsqh0-EmpVAfHjBO24Kn07/exec';

exports.handler = async function(event, context) {
  console.log('Função proxy iniciada');
  console.log('Método HTTP:', event.httpMethod);
  console.log('Corpo da requisição:', event.body);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: event.body,
      headers: {'Content-Type': 'application/json'},
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Resposta do Google Apps Script:', data);
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro detalhado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing your request: ' + error.message })
    };
  }
};
