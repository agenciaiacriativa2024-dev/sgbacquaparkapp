const loginForm = document.querySelector('#login-form');
if (loginForm) {
    const emailField = document.querySelector('#login-email');
    const passwordField = document.querySelector('#login-password');
    const errorMsg = document.querySelector('#login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        auth.signInWithEmailAndPassword(emailField.value, passwordField.value)
            .catch(error => {
                errorMsg.textContent = 'Usuário ou senha inválidos.';
                console.error('Erro de login:', error.message);
            });
    });
}