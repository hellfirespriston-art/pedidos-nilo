const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "método não permitido" });
    return;
  }

  const { item, entreguePor, destinatarios } = req.body || {};
  if (!item || !entreguePor || !Array.isArray(destinatarios) || destinatarios.length === 0) {
    res.status(400).json({ erro: "dados incompletos" });
    return;
  }

  try {
    const tokensSnap = await db
      .collection("tokens")
      .where("pessoa", "in", destinatarios)
      .get();

    const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean);
    if (tokens.length === 0) {
      res.status(200).json({ enviados: 0, motivo: "sem tokens cadastrados" });
      return;
    }

    const resposta = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: "Pedido entregue",
        body: `${entreguePor} marcou "${item}" como entregue. Confirme quando receber.`,
      },
      webpush: {
        fcmOptions: { link: "https://pedidos-nilo.vercel.app" },
      },
    });

    res.status(200).json({ enviados: resposta.successCount, falhas: resposta.failureCount });
  } catch (e) {
    res.status(500).json({ erro: "falha ao enviar notificação", detalhe: String(e) });
  }
};
