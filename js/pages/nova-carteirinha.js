// /js/pages/nova-carteirinha.js
const form = document.querySelector('#nova-carteirinha-form');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("Erro: Usuário não está logado.");

        db.collection('passaportes').where('responsavelAuthUid', '==', currentUser.uid).get()
            .then(snapshot => {
                if (snapshot.empty) return alert("Erro: Passaporte não encontrado.");

                const passaporteDoc = snapshot.docs[0];
                const passaporteId = passaporteDoc.id;

                const carteirinhaData = {
                    passaporteId: passaporteId,
                    nomeCompleto: document.querySelector('#dep-nome').value,
                    dataNascimento: document.querySelector('#dep-nascimento').value,
                    grauParentesco: document.querySelector('#dep-parentesco').value,
                    fotoRostoUrl: null,
                    fotoDocumentoUrl: null,
                    status: 'pendente'
                    // O qrCodeData será gerado a seguir
                };

                // Adiciona a nova carteirinha para obter o ID único dela
                db.collection('passaportes').doc(passaporteId).collection('carteirinhas').add(carteirinhaData)
                    .then((docRef) => {
                        // O ID único da carteirinha será o conteúdo do QR Code
                        const qrCodeContent = docRef.id;

                        // Atualiza o documento recém-criado com o dado do QR Code
                        db.collection('passaportes').doc(passaporteId).collection('carteirinhas').doc(docRef.id).update({
                            qrCodeData: qrCodeContent
                        }).then(() => {
                            alert('Dependente adicionado com sucesso! Lembre-se de validar os documentos na secretaria.');
                            loadPage('socio');
                        });
                    })
                    .catch(err => {
                        console.error("Erro ao adicionar carteirinha:", err);
                        alert("Ocorreu um erro ao adicionar o dependente.");
                    });
            });
    });
}

