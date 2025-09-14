// /js/pages/novo-passaporte.js

const form = document.querySelector('#novo-passaporte-form');
const planoSelect = document.querySelector('#resp-plano');

// Carrega os planos disponíveis do Firestore para preencher a caixa de seleção
if (planoSelect) {
    db.collection('planos').orderBy('nome').get()
        .then(snapshot => {
            planoSelect.innerHTML = '<option value="" disabled selected>Escolha um plano</option>';
            snapshot.forEach(doc => {
                const plano = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${plano.nome} - R$ ${Number(plano.valor).toFixed(2)}`;
                planoSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar planos: ", err);
            planoSelect.innerHTML = '<option value="" disabled selected>Erro ao carregar planos</option>';
        });
}

// Adiciona o "ouvinte" para o evento de submissão do formulário
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede que a página recarregue
        
        alert('Processando... por favor, aguarde.');

        // 1. Coleta todos os dados do formulário
        const dadosResponsavel = {
            responsavelNome: document.querySelector('#resp-nome').value,
            responsavelCPF: document.querySelector('#resp-cpf').value,
            responsavelNascimento: document.querySelector('#resp-nascimento').value,
            responsavelEmail: document.querySelector('#resp-email').value,
            responsavelTelefone: document.querySelector('#resp-telefone').value,
            responsavelEndereco: document.querySelector('#resp-endereco').value,
            planoId: planoSelect.value,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // 2. Define qual Cloud Function chamar
        const createPassportFunction = functions.httpsCallable('createPassport');

        // 3. Executa a Cloud Function, passando os dados do formulário
        createPassportFunction(dadosResponsavel)
            .then((result) => {
                console.log("Resultado da Cloud Function:", result.data);
                
                // 4. Envia o e-mail para o usuário criar a senha
                auth.sendPasswordResetEmail(result.data.email)
                    .then(() => {
                        alert("Passaporte criado com sucesso! Um e-mail foi enviado para " + result.data.email + " para cadastro da senha.");
                        loadPage('passaportes'); // Redireciona de volta
                    })
                    .catch((error) => {
                        console.error("Erro ao enviar e-mail de redefinição:", error);
                        alert("Passaporte criado, mas falha ao enviar o e-mail de redefinição de senha.");
                    });
            })
            .catch((error) => {
                console.error("Erro ao chamar a Cloud Function:", error);
                alert(`Erro: ${error.message}`);
            });
    });
}

