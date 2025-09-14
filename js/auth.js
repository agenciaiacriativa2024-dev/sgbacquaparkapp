const appContent = document.getElementById('app-content');
const logoutButton = document.getElementById('logout-button');

const loadPage = async (page) => {
    // Remove o script da página anterior para evitar conflitos e erros
    const oldScript = document.querySelector('#page-script');
    if (oldScript) {
        oldScript.remove();
    }

    try {
        const response = await fetch(`/pages/${page}.html`);
        if (!response.ok) throw new Error(`Página /pages/${page}.html não encontrada.`);
        
        appContent.innerHTML = await response.text();
        
        const pageScriptPath = `/js/pages/${page}.js`;
        
        // Adiciona o novo script
        const script = document.createElement('script');
        script.id = 'page-script';
        script.src = pageScriptPath;
        document.body.appendChild(script);

    } catch (error) {
        console.error("Erro ao carregar página:", error);
        appContent.innerHTML = `<h2 style="color: red; text-align: center;">Erro ao carregar conteúdo:<br>${error.message}</h2>`;
    }
};

auth.onAuthStateChanged(async (user) => {
    if (user) {
        logoutButton.style.display = 'block';
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userType = userDoc.data().tipo;
                const pageMap = {
                    'CEO': 'ceo',
                    'Secretaria': 'ceo', // Secretaria usa o painel do CEO
                    'Portaria': 'portaria'
                };
                // Se o tipo for SócioFamiliar ou qualquer outro, carrega 'socio'
                loadPage(pageMap[userType] || 'socio');
            } else {
                 console.log("Usuário autenticado mas sem registro na coleção 'users'. Assumindo perfil de Sócio.");
                 loadPage('socio');
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            loadPage('login');
        }
    } else {
        logoutButton.style.display = 'none';
        loadPage('login');
    }
});

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service worker registrado.', reg))
            .catch(err => console.error('Falha no registro do Service worker:', err));
    });
}


