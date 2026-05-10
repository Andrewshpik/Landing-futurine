const ALLOWED_ORIGINS = [
  'https://andrewshpik.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return Response.json({ ok: false, error: 'bad_json' }, { status: 400, headers: cors });
    }

    if (data.website) {
      return Response.json({ ok: true }, { headers: cors });
    }

    const name = String(data.name ?? '').trim().slice(0, 100);
    const phone = String(data.phone ?? '').trim().slice(0, 50);
    const product = String(data.product ?? '').trim().slice(0, 100);
    const message = String(data.message ?? '').trim().slice(0, 1000);

    if (!name || phone.replace(/\D/g, '').length < 10) {
      return Response.json({ ok: false, error: 'validation' }, { status: 400, headers: cors });
    }

    const text =
      `<b>Новая заявка</b>\n\n` +
      `<b>Имя:</b> ${escape(name)}\n` +
      `<b>Телефон:</b> ${escape(phone)}\n` +
      (product ? `<b>Изделие:</b> ${escape(product)}\n` : '') +
      (message ? `\n${escape(message)}` : '');

    const tgRes = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    );

    if (!tgRes.ok) {
      return Response.json({ ok: false, error: 'telegram' }, { status: 502, headers: cors });
    }

    return Response.json({ ok: true }, { headers: cors });
  },
};
