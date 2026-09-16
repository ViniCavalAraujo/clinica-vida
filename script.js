const btn_menu = document.querySelector('.btn-menu')
const form = document.querySelector('.form')
const email = document.querySelector('#email')
const telefone = document.querySelector('#telefone')
const bt_cep = document.querySelector('#bt-cep')
const bt_agendar = document.querySelector('#botao-agendar')
const cepInput = document.querySelector('#cep')
const data = document.querySelector('#data')
let listaProfissionais = [] //pra guardar os profissionais depois do fetch


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


    //validação de data
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0) //zera hora, minutos, segundos e milissegundos
    const dataObj = new Date(data.value)

    if (dataObj < hoje) {
        alert('A data não pode ser anterior a hoje')
        return
    }

    const diaSemana = dataObj.getDay()

    if (diaSemana === 0 || diaSemana === 6) {
        alert('Não atendemos aos finais de semana')
        return
    }

    alert('Consulta agendada')
    form.reset()
})


//EVENTOS

//botão para rolagem até a sessão de agendamento
bt_agendar.addEventListener('click', () => {
    document.querySelector('.agendamento').scrollIntoView()
})

//botão de clique do menu
btn_menu.addEventListener('click', () => {
    const menu = document.querySelector('.menu')
    menu.classList.toggle('ativo')
})

//dispara o evento quando o usuário seleciona uma opção diferente no <select>
document.querySelector('#espec').addEventListener('change', atualizarHorariosDisponiveis)

//botão de clique do cep
bt_cep.addEventListener('click', () => {
    validarCep()
})


//quando o usuário apertar Enter no campo de cep trás os dados
cepInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault() // impede o submit do form
        validarCep()           // já aproveita pra buscar o CEP direto
    }
})




//FUNÇÕES VALIDATIVAS
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

//FUNÇÕES LÓGICAS
function gerarHorariosDisponiveis(horarioTexto) {
    const [inicio, fim] = horarioTexto.split(' - ')      

    //separa hora do minuto e converte para inteiro
    const horaInicio = parseInt(inicio.split(':')[0])      
    const horaFim = parseInt(fim.split(':')[0])


    const horarios = []
    //conversão para texto novamente
    for (let h = horaInicio; h <= horaFim; h++) {
        horarios.push(String(h).padStart(2, '0') + ':00') 
    }
    return horarios 
}

function atualizarHorariosDisponiveis() {
    const especialidade = document.querySelector('#espec').value

    //pega listaProfissionais que contém os dados fetch usando .find() para verificar se a 
    //especialidade do JSON é igual à selecionada do usuário
    const profissional = listaProfissionais.find((p) => p.especialidade === especialidade)

    if (!profissional) return

    //pega o horário do profissional e atribui a função acima
    const horarios = gerarHorariosDisponiveis(profissional.horario)
    
    const hora = document.querySelector('#hora')
    hora.innerHTML = horarios.map((h) => `<option value="${h}">${h}</option>`).join('')

}


//FUNÇÕES FETCH
async function carregarProfissional() {
    try {
        const resposta = await fetch("./profissionais.json")
        const dados = await resposta.json()
        listaProfissionais = dados // guarda os dados pra usar no submit

        const profissionais = document.querySelector('#profissionais')
        const arrayProfissionais = dados.map((profissional) => {
            return `<h2>${profissional.nome}</h2>
                    <span>${profissional.especialidade}</span> 
                    <span>${profissional.horario}</span>`
        })
        profissionais.innerHTML = arrayProfissionais.join("")
        atualizarHorariosDisponiveis() // preenche os horários já ao carregar a página
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
        console.log(error)
    }
}
