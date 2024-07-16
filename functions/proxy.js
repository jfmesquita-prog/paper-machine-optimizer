const axios = require('axios');

const SCRIPT_URL = 'SEU_URL_DO_GOOGLE_APPS_SCRIPT';

exports.handler = async function(event, context) {
  console.log('Função proxy iniciada');
  console.log('Método HTTP:', event.httpMethod);
  console.log('Corpo da requisição:', event.body);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Dados enviados para o Google Apps Script:', body);
    
    const response = await axios.post(SCRIPT_URL, body);
    
    console.log('Resposta do Google Apps Script:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Erro detalhado:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request', 
        details: error.response ? error.response.data : error.message 
      })
    };
  }
};
