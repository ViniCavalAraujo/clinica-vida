const btn_menu = document.querySelector('.btn-menu')
const form = document.querySelector('.form')
const email = document.querySelector('#email')
const telefone = document.querySelector('#telefone')
const bt_cep = document.querySelector('#bt-cep')
const bt_agendar = document.querySelector('#botao-agendar')
const cepInput = document.querySelector('#cep')
const data = document.querySelector('#data')

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const emailUsuario = email.value
    const telefoneUsuario = telefone.value
    if (!validarEmail(emailUsuario)) {
        alert('e-mail inválido')
        return
    } 

    if (!validarTelefone(telefoneUsuario)) {
        alert('telefone inválido')
        return
    }
    
    alert('Consulta agendada')
    form.reset()
})

//botão para rolagem até a sessão de agendamento
bt_agendar.addEventListener('click', () => {
    document.querySelector('.agendamento').scrollIntoView()
})

//botão de clique do menu
btn_menu.addEventListener('click', () => {
    const menu = document.querySelector('.menu')
    menu.classList.toggle('ativo')
})

//botão de clique do cep
bt_cep.addEventListener('click', () => {
    validarCep()
})


//funções validativas
const validarEmail = (email) => {
    const regexEmail = /^[^\s]+@[^\s]+\.[^\s]+$/
    return regexEmail.test(email)
}

const validarTelefone = (telefone) => {
    const apenasNumeros = telefone.replace(/[^0-9]/g, "")
    const regexTelefone = /^[0-9]{10,11}$/
    return regexTelefone.test(apenasNumeros)
}


const verificarCep = (cep) => {
    const regexCep = /^[0-9]{8}$/
    return regexCep.test(cep)
}

//replace no evento input para aceitar somente números
cepInput.addEventListener('input', () => {
    cepInput.value = cepInput.value.replace(/[^0-9]/g, '')
})



//funções fetch
async function carregarProfissional() {
    try {
        const resposta = await fetch("./profissionais.json")
        const dados = await resposta.json()

        const profissionais = document.querySelector('#profissionais')

        const arrayProfissionais = dados.map((profissional) => {
            return `<h2>${profissional.nome}</h2>
                    <span>${profissional.especialidade}</span> 
                    <span>${profissional.horario}</span>`
        })
        profissionais.innerHTML = arrayProfissionais.join("")
    } catch (error) {
        console.log(error)
    }
    
}
carregarProfissional()

async function validarCep() {
    try {
        const cep = document.querySelector('#cep').value
        
        if (cep === '') {
            alert('Insira o cep')
            return
        }

        if(!verificarCep(cep)) {
            alert('Cep inválido')
            return
        }

        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const dados = await resposta.json()

        if (dados.erro) {
            alert('CEP não encontrado')
            return
        }

      
        document.querySelector('#rua').value = dados.logradouro
        document.querySelector('#bairro').value = dados.bairro
        document.querySelector('#cidade').value = dados.localidade
        document.querySelector('#uf').value = dados.uf

        document.querySelector('#camposEndereco').classList.toggle('ativo')
    } catch (error) {
        
    }
}
