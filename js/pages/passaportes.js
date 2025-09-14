const passaportesList = document.querySelector('#passaportes-list');
const buscaForm = document.querySelector('#busca-passaporte-form');
const limparBuscaBtn = document.querySelector('#limpar-busca-btn');
const buscaValorInput = document.querySelector('#busca-valor');

const renderPassaporte = (doc) => {
    const data = doc.data();
    const li = document.createElement('li');
    li.className = 'list-item';
    li.setAttribute('data-id', doc.id);
    li.innerHTML = `
        <div>
            <span class="title"><strong>Responsável:</strong> ${data.responsavelNome}</span>
            <p>
                <strong>Passaporte Nº:</strong> ${data.numeroPassaporte || 'N/A'} | 
                <strong>CPF:</strong> ${data.responsavelCPF}
            </p>
        </div>
        <div class="list-item-actions">
             <button class="edit-passaporte-btn"><img src="https://icons.getbootstrap.com/assets/icons/pencil-square.svg" alt="Editar"></button>
        </div>
    `;
    passaportesList.appendChild(li);
};

const carregarPassaportesIniciais = () => {
    passaportesList.innerHTML = '<li class="list-item">Carregando...</li>';
    db.collection('passaportes')
      .orderBy('criadoEm', 'desc')
      .limit(20)
      .get()
      .then(snapshot => {
          passaportesList.innerHTML = '';
          if (snapshot.empty) {
              passaportesList.innerHTML = '<li class="list-item">Nenhum passaporte encontrado.</li>';
              return;
          }
          snapshot.forEach(doc => renderPassaporte(doc));
      })
      .catch(err => {
          console.error("Erro ao buscar passaportes:", err);
          passaportesList.innerHTML = '<li class="list-item">Erro ao carregar passaportes.</li>';
      });
};

if (buscaForm) {
    buscaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const criterio = document.querySelector('#busca-criterio').value;
        const valor = buscaValorInput.value.trim();
        if (!valor) return;
        
        passaportesList.innerHTML = '<li class="list-item">Buscando...</li>';
        db.collection('passaportes').where(criterio, '==', valor).get()
            .then(snapshot => {
                passaportesList.innerHTML = '';
                if (snapshot.empty) {
                    passaportesList.innerHTML = `<li class="list-item">Nenhum resultado encontrado.</li>`;
                    return;
                }
                snapshot.forEach(doc => renderPassaporte(doc));
            });
    });
}

if (limparBuscaBtn) {
    limparBuscaBtn.addEventListener('click', () => {
        buscaValorInput.value = '';
        carregarPassaportesIniciais();
    });
}

carregarPassaportesIniciais();

// Adicione este código no final de /js/pages/passaportes.js
passaportesList.addEventListener('click', (e) => {
    const target = e.target.closest('.edit-passaporte-btn');
    if (target) {
        const passaporteId = target.closest('li').dataset.id;
        // Salva o ID para a próxima página usar
        sessionStorage.setItem('passaporteIdParaEditar', passaporteId);
        loadPage('editar-passaporte');
    }
});



