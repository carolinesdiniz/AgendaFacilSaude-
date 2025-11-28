class MedicalScheduler {
    constructor() {
        this.form = document.getElementById('form-agenda');
        this.listaContainer = document.getElementById('lista-agenda');
        this.avisoVazio = document.getElementById('aviso-vazio');
        this.toastContainer = document.getElementById('toast-container');
        
        this.filtroBusca = document.getElementById('filtro-busca');
        this.filtroTipo = document.getElementById('filtro-tipo');

        this.inputData = document.getElementById('data');
        this.inputObs = document.getElementById('obs');
        this.contadorObs = document.getElementById('contador');
        this.btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
        this.btnSalvar = document.getElementById('btn-salvar');

        this.agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        this.editandoId = null;

        this.init();
    }

    init() {
        if (!this.form || !this.listaContainer) {
            console.error("Erro Crítico: Elementos HTML não encontrados.");
            return;
        }

        this.configurarDataMinima();
        this.addEventListeners();
        this.render();
    }

    configurarDataMinima() {
        const hoje = new Date().toISOString().split('T')[0];
        if(this.inputData) this.inputData.setAttribute('min', hoje);
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const telInput = document.getElementById('telefone');
        if(telInput) telInput.addEventListener('input', (e) => this.maskPhone(e));

        if(this.inputObs) {
            this.inputObs.addEventListener('input', () => {
                this.contadorObs.textContent = this.inputObs.value.length;
            });
        }

        if(this.filtroBusca) this.filtroBusca.addEventListener('input', () => this.render());
        if(this.filtroTipo) this.filtroTipo.addEventListener('change', () => this.render());

        this.listaContainer.addEventListener('click', (e) => this.handleListClick(e));
        
        if(this.btnCancelarEdicao) {
            this.btnCancelarEdicao.addEventListener('click', () => this.resetarFormulario());
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const dados = {
            id: this.editandoId || Date.now(),
            nome: this.escapeHtml(document.getElementById('nome').value),
            email: this.escapeHtml(document.getElementById('email').value),
            telefone: document.getElementById('telefone').value,
            endereco: this.escapeHtml(document.getElementById('endereco').value),
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value,
            tipo: document.getElementById('tipo').value,
            obs: this.escapeHtml(document.getElementById('obs').value)
        };

        if (this.editandoId) {
            const index = this.agendamentos.findIndex(item => item.id === this.editandoId);
            if(index !== -1) this.agendamentos[index] = dados;
            this.showToast('Agendamento atualizado!', 'success');
        } else {
            this.agendamentos.push(dados);
            this.showToast('Agendamento criado!', 'success');
        }

        this.persistirDados();
        this.render();
        this.resetarFormulario();
    }

    handleListClick(e) {
        const btnExcluir = e.target.closest('.btn-excluir');
        const btnEditar = e.target.closest('.btn-editar');
        const li = e.target.closest('li');
        
        if (!li) return;
        const id = Number(li.dataset.id);

        if (btnExcluir) {
            this.excluir(id);
        } else if (btnEditar) {
            this.prepararEdicao(id);
        }
    }

    excluir(id) {
        if(confirm("Tem certeza que deseja remover este registro?")) {
            this.agendamentos = this.agendamentos.filter(item => item.id !== id);
            this.persistirDados();
            this.render();
            this.showToast('Item removido.', 'error');
            if(this.editandoId === id) this.resetarFormulario();
        }
    }

    prepararEdicao(id) {
        const item = this.agendamentos.find(i => i.id === id);
        if(item) {
            document.getElementById('nome').value = item.nome;
            document.getElementById('email').value = item.email;
            document.getElementById('telefone').value = item.telefone;
            document.getElementById('endereco').value = item.endereco;
            document.getElementById('data').value = item.data;
            document.getElementById('hora').value = item.hora;
            document.getElementById('tipo').value = item.tipo;
            document.getElementById('obs').value = item.obs;
            
            this.contadorObs.textContent = item.obs.length;
            this.editandoId = id;
            this.btnSalvar.textContent = "Atualizar";
            this.btnCancelarEdicao.style.display = 'inline-block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    render() {
        this.listaContainer.innerHTML = '';
        
        const termo = this.filtroBusca ? this.filtroBusca.value.toLowerCase() : '';
        const tipoFiltro = this.filtroTipo ? this.filtroTipo.value : '';

        let listaFiltrada = this.agendamentos.filter(item => {
            const matchNome = item.nome.toLowerCase().includes(termo);
            const matchTipo = tipoFiltro ? item.tipo === tipoFiltro : true;
            return matchNome && matchTipo;
        });

        listaFiltrada.sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`));

        if (listaFiltrada.length === 0) {
            this.avisoVazio.style.display = 'block';
        } else {
            this.avisoVazio.style.display = 'none';
        }

        listaFiltrada.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id;
            const dataFormatada = new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR');
            
            li.innerHTML = `
                <article class="agendamento-card border-${item.tipo}">
                    <div class="card-header">
                        <h3>${item.nome}</h3>
                        <small>${item.tipo}</small>
                    </div>
                    <div class="card-body">
                        <p> ${dataFormatada} às ${item.hora}</p>
                        <p> ${item.email}</p>
                        <p> ${item.telefone}</p>
                        <p> ${item.endereco}</p>
                        ${item.obs ? `<p> ${item.obs}</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn-acao btn-editar">Editar</button>
                        <button class="btn-acao btn-excluir">Excluir</button>
                    </div>
                </article>
            `;
            this.listaContainer.appendChild(li);
        });
    }

    persistirDados() {
        localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos));
    }

    resetarFormulario() {
        this.form.reset();
        this.editandoId = null;
        this.contadorObs.textContent = '0';
        this.btnSalvar.textContent = "Agendar Compromisso";
        this.btnCancelarEdicao.style.display = 'none';
    }

    escapeHtml(text) {
        if (!text) return "";
        return text.replace(/[&<>"']/g, function(m) {
            return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[m];
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span style="margin-left:10px">${message}</span>`;
        this.toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    maskPhone(event) {
        let input = event.target;
        let valor = input.value.replace(/\D/g, "");
        if (valor.length > 11) valor = valor.slice(0, 11);
        if (valor.length > 2) valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        if (valor.length > 10) valor = `${valor.substring(0, 10)}-${valor.substring(10)}`;
        else if (valor.length > 6) valor = `${valor.substring(0, 9)}-${valor.substring(9)}`;
        input.value = valor;
    }
}

document.addEventListener('DOMContentLoaded', () => new MedicalScheduler());