document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const message = document.getElementById('login-message');

            //Declaração que busca os usuários que foram salvos no cadastro
            const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            //Declaração que verifica se existe um usuário com o mesmo e-mail e senha
            const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === password);

            if (user) {
                //Salva a sessão como ativa
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', user.nomeCompleto);

                message.textContent = `Bem-vindo, ${user.nomeCompleto}! Redirecionando...`;
                message.style.color = 'var(--success-color)';

                //Redireciona para o painel principal
                setTimeout(() => {
                    window.location.href = 'principal.html';
                }, 1500);
            } else {
                message.textContent = 'E-mail ou senha incorretos.';
                message.style.color = 'var(--danger-color)';
            }
        });
    }
});