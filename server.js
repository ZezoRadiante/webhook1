const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ✅ SEUS DADOS JÁ CONFIGURADOS
const PIXEL_ID = '26134771486222670';
const ACCESS_TOKEN = 'EAAN9cc8y8xMBRAQruj2FqmuidUZCN78IOR7cwUKrDMeekZBN3YDHsFaRMdjzNUslZADbGZBX7AfHdPFF3vYBoONjQ1ZBivUa5t0SBuftuQni6qSYmYepmZAZC85hd7ejAGkOqIJJc2VmEpJn1bEpwCWPFoUnzSdav1uYJChZBuHh9nzp0t1fRIyG49m04RoqpTyleQZDZD';

// 🔥 WEBHOOK
app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;

    console.log('📥 Webhook recebido:', JSON.stringify(data, null, 2));

    // 🔎 tenta pegar o fbc de vários lugares possíveis
    const fbc =
      data.fbc ||
      data.metadata?.fbc ||
      data.user?.fbc ||
      data.custom_data?.fbc ||
      null;

    // 💰 valor da compra
    const value =
      data.value ||
      data.amount ||
      data.price ||
      10;

    if (!fbc) {
      console.log('❌ Sem fbc — evento não enviado');
      return res.sendStatus(200);
    }

    // 🚀 ENVIA PRO META (CAPI)
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

    console.log('✅ Purchase enviado com fbc:', fbc);
    console.log('📊 Resposta Meta:', response.data);

    res.sendStatus(200);

  } catch (err) {
    console.error('❌ Erro:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
