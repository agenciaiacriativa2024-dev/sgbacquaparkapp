const passaporteTitulo = document.querySelector('#passaporte-info-titulo');
const carteirinhasList = document.querySelector('#carteirinhas-vinculadas-list');

// Pega o ID do passaporte que salvamos no passo anterior
const passaporteId = sessionStorage.getItem('passaporteIdParaEditar');

if (passaporteId) {
    // Busca os dados do passaporte
    db.collection('passaportes').doc(passaporteId).get().then(doc => {
        if (doc.exists) {
            passaporteTitulo.textContent = `Editando Passaporte de: ${doc.data().responsavelNome}`;
        }
    });

    // Busca e exibe as carteirinhas da subcoleção
    db.collection('passaportes').doc(passaporteId).collection('carteirinhas').onSnapshot(snapshot => {
        carteirinhasList.innerHTML = '';
        if (snapshot.empty) {
            carteirinhasList.innerHTML = '<li class="list-item">Nenhuma carteirinha para este passaporte.</li>';
            return;
        }
        snapshot.forEach(carteirinhaDoc => {
            const data = carteirinhaDoc.data();
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div>
                    <strong>${data.nomeCompleto}</strong> (${data.grauParentesco})<br>
                    <small>Status: ${data.status}</small>
                </div>
                <button class="btn btn-primary btn-adicionar-fotos" data-carteirinha-id="${carteirinhaDoc.id}">Adicionar/Ver Fotos</button>
            `;
            carteirinhasList.appendChild(li);
        });
    });
}

// Adiciona o "ouvinte" para o botão "Adicionar Fotos"
carteirinhasList.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-adicionar-fotos')) {
        const carteirinhaId = e.target.dataset.carteirinhaId;
        // Salva os IDs que a próxima página precisará
        sessionStorage.setItem('carteirinhaIdParaEditar', carteirinhaId);
        sessionStorage.setItem('passaporteIdDaCarteirinha', passaporteId);
        loadPage('editar-carteirinha');
    }
});

