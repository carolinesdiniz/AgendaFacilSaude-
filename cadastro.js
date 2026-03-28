// Selecionando os elementos do HTML
const form = document.getElementById('cadastro-form');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const messageEl = document.getElementById('cadastro-message');
const passwordStrengthContainer = document.getElementById('passwordStrength');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// Função para buscar usuários salvos no navegador
function getUsers() {
    const stored = localStorage.getItem('registeredUsers');
    return stored ? JSON.parse(stored) : [];
}

// Função para salvar novos usuários no navegador
function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Função para mostrar mensagem de erro em um campo específico
function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-message')
        || input.closest('.form-group').querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = message;
    input.classList.add('input-error');
}

// Função para limpar a mensagem de erro de um campo
function clearError(input) {
    const errorSpan = input.parentElement.querySelector('.error-message')
        || input.closest('.form-group').querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
    input.classList.remove('input-error');
}

// Função que valida se o campo foi preenchido corretamente
function validateField(input) {
    clearError(input);

    if (input.validity.valueMissing) {
        showError(input, 'Este campo é obrigatório');
        return false;
    }
    if (input.validity.tooShort) {
        showError(input, `Mínimo de ${input.minLength} caracteres`);
        return false;
    }
    if (input.validity.typeMismatch && input.type === 'email') {
        showError(input, 'Digite um e-mail válido');
        return false;
    }
    if (input.validity.patternMismatch && input.type === 'tel') {
        showError(input, 'Digite um telefone válido (ex: (11) 98765-4321)');
        return false;
    }
    return true;
}

// Calcula a força da senha
function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

// Atualiza a barrinha visual de força da senha
function updateStrengthBar(password) {
    if (!password) {
        passwordStrengthContainer.style.display = 'none';
        return;
    }
    passwordStrengthContainer.style.display = 'block';
    const score = getPasswordStrength(password);
    const levels = [
        { label: 'Muito fraca', color: '#f56565', width: '20%' },
        { label: 'Fraca', color: '#ed8936', width: '40%' },
        { label: 'Média', color: '#ecc94b', width: '60%' },
        { label: 'Forte', color: '#62da94', width: '80%' },
        { label: 'Muito forte', color: '#125657', width: '100%' },
    ];
    const level = levels[Math.max(0, score)];
    strengthFill.style.width = level.width;
    strengthFill.style.backgroundColor = level.color;
    strengthText.textContent = level.label;
    strengthText.style.color = level.color;
}

// Eventos para checar a senha enquanto o usuário digita
senhaInput.addEventListener('input', () => {
    updateStrengthBar(senhaInput.value);
    clearError(senhaInput);
});

confirmarSenhaInput.addEventListener('input', () => {
    clearError(confirmarSenhaInput);
});

// Lógica para o botão de "olhinho" que mostra/oculta a senha
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            btn.setAttribute('aria-label', 'Ocultar senha');
        } else {
            targetInput.type = 'password';
            btn.setAttribute('aria-label', 'Mostrar senha');
        }
    });
});

// Valida os campos assim que o usuário clica fora deles (evento blur)
const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
});

// Evento principal: Quando o botão "Criar Conta" é clicado
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede a página de recarregar

    // Coleta os valores dos campos (CORRIGIDO: usando CPF no lugar de username)
    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpf = document.getElementById('cpf').value.trim(); // <-- Correção aqui!
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    let isValid = true;

    // Valida todos os campos
    inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
    });

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
        showError(confirmarSenhaInput, 'As senhas não coincidem');
        isValid = false;
    }

    if (!isValid) return; // Se algo estiver errado, para por aqui

    const users = getUsers();

    // Verifica se o CPF já está cadastrado
    if (users.find(u => u.cpf === cpf)) {
        showError(document.getElementById('cpf'), 'Este CPF já está cadastrado');
        return;
    }

    // Verifica se o E-mail já está cadastrado
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showError(document.getElementById('email'), 'Este e-mail já está cadastrado');
        return;
    }
    

    // Cria o objeto do novo usuário
    const newUser = {
        id: Date.now().toString(),
        nomeCompleto,
        email,
        telefone,
        cpf,
        senha,
        createdAt: new Date().toISOString()
    };

    // Salva o novo usuário na lista
    users.push(newUser);
    saveUsers(users);

    // Mostra mensagem de sucesso e redireciona
    messageEl.textContent = 'Conta criada com sucesso! Redirecionando para o login...';
    messageEl.style.color = 'green';

   setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});