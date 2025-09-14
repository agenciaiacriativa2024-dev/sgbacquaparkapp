// 1. SELEÇÃO DE ELEMENTOS
const socioNome = document.querySelector('#socio-nome');
const socioPassaporte = document.querySelector('#socio-passaporte');
const socioPlano = document.querySelector('#socio-plano');
const financeiroBtn = document.querySelector('#financeiro-btn');
const financeiroContent = document.querySelector('#financeiro-content');
const carteirinhasList = document.querySelector('#carteirinhas-list');
const currentUser = auth.currentUser;

// 2. DEFINIÇÃO DAS FUNÇÕES
const setBotaoFinanceiroStatus = (status) => {
    if (!financeiroBtn) return;
    const loader = financeiroBtn.querySelector('.loader');
    if (loader) loader.style.display = 'none';
    financeiroBtn.className = '';
    financeiroBtn.classList.add('btn'); // Classe base de botão
    financeiroBtn.classList.add(`btn-financeiro-${status}`);
};

const carregarDadosFinanceiros = (asaasCustomerId) => {
    if (!asaasCustomerId) {
        setBotaoFinanceiroStatus('error');
        if(financeiroContent) financeiroContent.innerHTML = "<p>Cliente não vinculado ao sistema financeiro.</p>";
        return;
    }
    const checkAsaasStatus = functions.httpsCallable('checkAsaasStatus');
    checkAsaasStatus({ customerId: asaasCustomerId })
        .then(result => {
            const { success, hasOverdue, overdueCount, data } = result.data;
            if (!success) {
                setBotaoFinanceiroStatus('error');
                if(financeiroContent) financeiroContent.innerHTML = "<p>Não foi possível verificar a situação financeira.</p>";
                return;
            }
            if (!hasOverdue) {
                setBotaoFinanceiroStatus('ok');
            } else if (overdueCount === 1) {
                setBotaoFinanceiroStatus('warn');
            } else {
                setBotaoFinanceiroStatus('error');
            }
            if(financeiroContent) {
                if(data && data.length > 0) {
                    let html = '<h4>Mensalidades Vencidas</h4>';
                    data.forEach(cobranca => {
                        const vencimento = new Date(cobranca.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
                        html += `<p>Valor: R$ ${cobranca.value.toFixed(2)} - Vencimento: ${vencimento}</p>`;
                    });
                    financeiroContent.innerHTML = html;
                } else {
                    financeiroContent.innerHTML = '<p>Nenhuma pendência encontrada. Tudo em dia!</p>';
                }
            }
        })
        .catch(err => {
            console.error("Erro ao chamar checkAsaasStatus:", err);
            setBotaoFinanceiroStatus('error');
            if(financeiroContent) financeiroContent.innerHTML = "<p>Ocorreu um erro ao verificar a situação financeira.</p>";
        });
};

const renderCarteirinhas = (passaporteId) => {
    db.collection('passaportes').doc(passaporteId).collection('carteirinhas').onSnapshot(snapshot => {
        if (!carteirinhasList) return;
        if (snapshot.empty) {
            carteirinhasList.innerHTML = '<p>Nenhuma carteirinha de dependente adicionada.</p>';
            return;
        }
        carteirinhasList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const cardHtml = `
                <div class="card carteirinha-card">
                    <div class="carteirinha-foto-qr">
                        <div class="foto-placeholder">
                            ${data.fotoRostoUrl ? `<img src="${data.fotoRostoUrl}" alt="Foto de ${data.nomeCompleto}" style="width:100%; height:100%; object-fit: cover;">` : 'Aguardando validação na secretaria'}
                        </div>
                        <div id="qrcode-${doc.id}" class="qrcode-container"></div>
                    </div>
                    <div class="carteirinha-info">
                        <p><strong>Nome:</strong> ${data.nomeCompleto}</p>
                        <p><strong>Nascimento:</strong> ${new Date(data.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                        <p><strong>Parentesco:</strong> ${data.grauParentesco}</p>
                        <p><strong>Status:</strong> <span style="font-weight: bold; color: ${data.status === 'ativo' ? 'green' : 'orange'};">${data.status}</span></p>
                    </div>
                </div>
            `;
            carteirinhasList.insertAdjacentHTML('beforeend', cardHtml);
            if (data.qrCodeData) {
                 // Limpa o container antes de gerar um novo QR Code para evitar duplicatas
                const qrContainer = document.getElementById(`qrcode-${doc.id}`);
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, {
                    text: data.qrCodeData,
                    width: 80,
                    height: 80,
                });
            }
        });
    }, err => {
        console.error("Erro ao carregar carteirinhas:", err);
        if(carteirinhasList) carteirinhasList.innerHTML = '<p style="color: red;">Erro ao carregar carteirinhas.</p>';
    });
};

// 3. EXECUÇÃO PRINCIPAL
if (currentUser) {
    db.collection('passaportes').where('responsavelAuthUid', '==', currentUser.uid).get()
        .then(snapshot => {
            if (snapshot.empty) {
                if(socioNome) socioNome.textContent = 'Passaporte não encontrado.';
                return;
            }
            const passaporteDoc = snapshot.docs[0];
            const passaporteData = passaporteDoc.data();
            
            if(socioNome) socioNome.textContent = passaporteData.responsavelNome;
            if(socioPassaporte) socioPassaporte.textContent = passaporteData.numeroPassaporte;

            db.collection('planos').doc(passaporteData.planoId).get().then(planoDoc => {
                if (planoDoc.exists && socioPlano) socioPlano.textContent = planoDoc.data().nome;
            });

            carregarDadosFinanceiros(passaporteData.asaasCustomerId);
            renderCarteirinhas(passaporteDoc.id);

            if(financeiroBtn) {
                financeiroBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector('#financeiro-section').scrollIntoView({ behavior: 'smooth' });
                });
            }
        });
} else {
    console.log("Usuário não logado, tela de sócio não será preenchida.");
}



