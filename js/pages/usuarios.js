const usuariosForm = document.querySelector('#usuarios-form');
const usuariosList = document.querySelector('#usuarios-list');

if (usuariosList) {
    db.collection('users').orderBy('email').onSnapshot(snapshot => {
        usuariosList.innerHTML = '';
        if (snapshot.empty) {
            usuariosList.innerHTML = '<li class="list-item">Nenhum usuário do sistema cadastrado.</li>';
            return;
        }
        snapshot.forEach(doc => {
            const user = doc.data();
            const li = document.createElement('li');
            li.className = 'list-item';
            li.setAttribute('data-id', doc.id);
            li.innerHTML = `
                <div>
                    <strong>${user.email}</strong> - <span>${user.tipo}</span>
                </div>
                <div class="list-item-actions">
                    <button class="delete-user-btn"><img src="https://icons.getbootstrap.com/assets/icons/trash.svg" alt="Excluir"></button>
                </div>
            `;
            usuariosList.appendChild(li);
        });
    }, err => console.error("Erro ao listar usuários:", err));
}

if (usuariosForm) {
    usuariosForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.querySelector('#usuario-email').value;
        const tipo = document.querySelector('#usuario-tipo').value;
        if (!tipo) {
            alert('Por favor, selecione um tipo de usuário.');
            return;
        }
        
        alert('Criando usuário...');

        try {
            // Usar uma Cloud Function para criar usuários é mais seguro.
            // Este é um método simplificado para o front-end.
            const tempPassword = Math.random().toString(36).slice(-8);
            const userCredential = await auth.createUserWithEmailAndPassword(email, tempPassword);
            await db.collection('users').doc(userCredential.user.uid).set({ email: email, tipo: tipo });
            await auth.sendPasswordResetEmail(email);
            alert('Usuário criado! E-mail de cadastro de senha enviado.');
            usuariosForm.reset();
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            alert(`Erro: ${error.message}`);
        }
    });
}

if (usuariosList) {
    usuariosList.addEventListener('click', (e) => {
        const target = e.target.closest('.delete-user-btn');
        if (!target) return;
        if (confirm('Tem certeza? Isso remove o usuário apenas da lista, não da autenticação.')) {
            const uid = target.closest('li').getAttribute('data-id');
            db.collection('users').doc(uid).delete()
              .then(() => alert('Usuário removido da listagem.'))
              .catch(err => alert('Erro ao remover usuário.'));
        }
    });
}

