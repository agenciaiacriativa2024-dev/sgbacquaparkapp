const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const asaasApiKey = functions.config().asaas.apikey;
const asaasApi = axios.create({
  baseURL: "https://www.asaas.com/api/v3",
  headers: {"access_token": asaasApiKey},
});

exports.checkAsaasStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "Você precisa estar logado.",
    );
  }
  const customerId = data.customerId;
  if (!customerId) {
    throw new functions.https.HttpsError(
        "invalid-argument", "O ID do cliente Asaas é obrigatório.",
    );
  }
  try {
    const response = await asaasApi.get(
        `/payments?customer=${customerId}&status=OVERDUE`,
    );
    // Retorno de sucesso
    return {
      success: true,
      hasOverdue: response.data.totalCount > 0,
      overdueCount: response.data.totalCount,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Erro ao consultar API Asaas:", error.response?.data || error);
    // Retorno de falha, mas ainda um objeto válido para o front-end
    return {
      success: false,
      hasOverdue: null, // Indica que a verificação falhou
      message: "Não foi possível verificar a situação financeira.",
    };
  }
});
// --- FUNÇÃO CREATEPASSPORT ATUALIZADA COM A NOVA LÓGICA ---
exports.createPassport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "Você precisa estar logado para esta operação.",
    );
  }

  const {
    responsavelNome,
    responsavelCPF,
    responsavelEmail,
  } = data;

  if (!responsavelEmail || !responsavelNome || !responsavelCPF) {
    throw new functions.https.HttpsError(
        "invalid-argument", "Nome, CPF e Email são obrigatórios.",
    );
  }

  try {
    // ETAPA 1: Criar usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: responsavelEmail,
      displayName: responsavelNome,
      password: Math.random().toString(36).slice(-8),
    });
    const authUid = userRecord.uid;
    console.log("Usuário criado no Authentication com UID:", authUid);

    // ETAPA 1.1: Criar o registro na coleção 'users'
    await admin.firestore().collection("users").doc(authUid).set({
      email: responsavelEmail,
      tipo: "SócioFamiliar",
    });
    console.log("Usuário salvo na coleção 'users' como SócioFamiliar.");

    // ETAPA 2: LÓGICA ATUALIZADA DO ASAAS
    let asaasCustomerId = null; // Inicia o ID como nulo
    
    // Busca o cliente pelo CPF
    const searchResponse = await asaasApi.get(
        `/customers?cpfCnpj=${responsavelCPF}`
    );

    if (searchResponse.data.data.length > 0) {
      // Se o cliente já existe, pega o ID dele
      asaasCustomerId = searchResponse.data.data[0].id;
      console.log("Cliente encontrado no Asaas com ID:", asaasCustomerId);
    } else {
      // Se não existe, apenas registra e o ID continua nulo
      console.log("Nenhum cliente encontrado no Asaas. O campo asaasCustomerId ficará em branco.");
    }

    // ETAPA 3: Salvar tudo no Firestore
    const numeroDoPassaporte = "P" + new Date().getTime().toString().slice(-6);
    const passportData = {
      ...data,
      responsavelAuthUid: authUid,
      asaasCustomerId: asaasCustomerId, // Salva o ID encontrado ou null
      numeroPassaporte: numeroDoPassaporte,
    };

    await admin.firestore().collection("passaportes").add(passportData);
    console.log("Passaporte salvo no Firestore com sucesso.");

    // ETAPA 4: Retornar sucesso para o front-end
    return {
      success: true,
      message: "Passaporte criado com sucesso!",
      email: responsavelEmail,
    };
  } catch (error) {
    console.error("Erro detalhado ao criar passaporte:", error);
    const errorMessage = error.response?.data?.errors?.[0]?.description ||
                         error.message;
    throw new functions.https.HttpsError(
        "internal", "Ocorreu um erro: " + errorMessage,
    );
  }
});

