const titulo = document.querySelector('#carteirinha-nome-titulo');
const video = document.querySelector('#camera-feed');
const canvas = document.querySelector('#photo-canvas');
const previewRosto = document.querySelector('#preview-rosto');
const previewDoc = document.querySelector('#preview-doc');
const captureRostoBtn = document.querySelector('#capture-rosto-btn');
const captureDocBtn = document.querySelector('#capture-doc-btn');
const saveAllBtn = document.querySelector('#save-all-btn');

const passaporteId = sessionStorage.getItem('passaporteIdDaCarteirinha');
const carteirinhaId = sessionStorage.getItem('carteirinhaIdParaEditar');
let fotoRostoBlob = null;
let fotoDocBlob = null;

// Inicia a câmera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Erro ao acessar a câmera:", err);
        alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    });

// Tira uma foto e a processa
const takePhoto = (width, height) => {
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.8);
    });
};

// Eventos dos botões de captura
captureRostoBtn.addEventListener('click', async () => {
    fotoRostoBlob = await takePhoto(300, 400); // Proporção 3x4
    previewRosto.src = URL.createObjectURL(fotoRostoBlob);
});
captureDocBtn.addEventListener('click', async () => {
    fotoDocBlob = await takePhoto(400, 300); // Proporção 4x3
    previewDoc.src = URL.createObjectURL(fotoDocBlob);
});

// Salvar tudo
saveAllBtn.addEventListener('click', async () => {
    if (!fotoRostoBlob || !fotoDocBlob) {
        return alert("É necessário capturar as duas fotos antes de salvar.");
    }
    alert("Salvando fotos... aguarde.");
    saveAllBtn.disabled = true;

    try {
        // Upload da foto de rosto
        const rostoRef = storage.ref(`carteirinhas/${carteirinhaId}/rosto.jpg`);
        await rostoRef.put(fotoRostoBlob);
        const fotoRostoUrl = await rostoRef.getDownloadURL();

        // Upload da foto do documento
        const docRef = storage.ref(`carteirinhas/${carteirinhaId}/documento.jpg`);
        await docRef.put(fotoDocBlob);
        const fotoDocumentoUrl = await docRef.getDownloadURL();

        // Atualiza o documento no Firestore com as URLs e ativa a carteirinha
        await db.collection('passaportes').doc(passaporteId).collection('carteirinhas').doc(carteirinhaId).update({
            fotoRostoUrl: fotoRostoUrl,
            fotoDocumentoUrl: fotoDocumentoUrl,
            status: 'ativo'
        });

        alert("Fotos salvas e carteirinha ativada com sucesso!");
        loadPage('editar-passaporte');

    } catch (err) {
        console.error("Erro ao salvar fotos:", err);
        alert("Ocorreu um erro ao salvar as fotos.");
        saveAllBtn.disabled = false;
    }
});

