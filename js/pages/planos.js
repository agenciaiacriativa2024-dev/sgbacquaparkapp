const planosForm = document.querySelector('#planos-form');
const planosList = document.querySelector('#planos-list');

if (planosForm && planosList) {
    const formTitle = document.querySelector('#form-title');
    const planoIdField = document.querySelector('#plano-id');
    const planoNomeField = document.querySelector('#plano-nome');
    const planoValorField = document.querySelector('#plano-valor');
    const planoDescricaoField = document.querySelector('#plano-descricao');
    const cancelEditBtn = document.querySelector('#cancel-edit-btn');

    const resetForm = () => {
        planosForm.reset();
        planoIdField.value = '';
        formTitle.textContent = 'Adicionar Novo Plano';
        cancelEditBtn.style.display = 'none';
    };

    db.collection('planos').orderBy('nome').onSnapshot(snapshot => {
        planosList.innerHTML = '';
        if (snapshot.empty) {
            planosList.innerHTML = '<li class="list-item">Nenhum plano cadastrado.</li>';
            return;
        }
        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.className = 'list-item';
            li.setAttribute('data-id', doc.id);
            li.innerHTML = `
                <div>
                    <strong>${data.nome}</strong> - R$ ${Number(data.valor).toFixed(2)}
                    <p>${data.descricao || ''}</p>
                </div>
                <div class="list-item-actions">
                    <button class="edit-btn"><img src="https://icons.getbootstrap.com/assets/icons/pencil-square.svg" alt="Editar"></button>
                    <button class="delete-btn"><img src="https://icons.getbootstrap.com/assets/icons/trash.svg" alt="Excluir"></button>
                </div>
            `;
            planosList.appendChild(li);
        });
    }, err => {
        console.error(err);
        planosList.innerHTML = '<li class="list-item">Erro ao carregar planos.</li>';
    });

    planosForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = planoIdField.value;
        const planoData = {
            nome: planoNomeField.value,
            valor: parseFloat(planoValorField.value),
            descricao: planoDescricaoField.value
        };
        const promise = id ? db.collection('planos').doc(id).update(planoData) : db.collection('planos').add(planoData);
        promise.then(() => resetForm()).catch(err => console.error(err));
    });

    planosList.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;
        const li = target.closest('li');
        const id = li.getAttribute('data-id');

        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza?')) {
                db.collection('planos').doc(id).delete();
            }
        }
        if (target.classList.contains('edit-btn')) {
            db.collection('planos').doc(id).get().then(doc => {
                const data = doc.data();
                planoIdField.value = doc.id;
                planoNomeField.value = data.nome;
                planoValorField.value = data.valor;
                planoDescricaoField.value = data.descricao;
                formTitle.textContent = 'Editar Plano';
                cancelEditBtn.style.display = 'inline-block';
                window.scrollTo(0, 0);
            });
        }
    });

    cancelEditBtn.addEventListener('click', resetForm);
}

