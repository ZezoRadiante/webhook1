const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ✅ SEUS DADOS
const PIXEL_ID = '26134771486222670';
const ACCESS_TOKEN = 'EAAN9cc8y8xMBRAQruj2FqmuidUZCN78IOR7cwUKrDMeekZBN3YDHsFaRMdjzNUslZADbGZBX7AfHdPFF3vYBoONjQ1ZBivUa5t0SBuftuQni6qSYmYepmZAZC85hd7ejAGkOqIJJc2VmEpJn1bEpwCWPFoUnzSdav1uYJChZBuHh9nzp0t1fRIyG49m04RoqpTyleQZDZD';

// 🔥 WEBHOOK
app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;

    console.log('📥 Webhook recebido:', JSON.stringify(data, null, 2));

    // 🔎 pega fbc
    const fbc =
      data.fbc ||
      data.metadata?.fbc ||
      data.user?.fbc ||
      data.custom_data?.fbc ||
      null;

    // 💰 valor
    const value =
      data.value ||
      data.amount ||
      data.price ||
      10;

    if (!fbc) {
      console.log('❌ Sem fbc — evento não enviado');
      return res.sendStatus(200);
    }

    // 🚀 ENVIO PRO META
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        data: [
          {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              fbc: fbc
            },
            custom_data: {
              currency: 'BRL',
              value: value
            }
          }
        ]
      }
    );

    console.log('✅ Purchase enviado:', response.data);

    res.sendStatus(200);

  } catch (err) {
    console.error('❌ Erro:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});


// 🔥 ROTA PRA TESTE (IMPORTANTE)
app.get('/', (req, res) => {
  res.send('Servidor rodando 🚀');
});


// ✅ CORREÇÃO IMPORTANTE PRO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta', PORT);
});
