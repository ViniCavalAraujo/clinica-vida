const btn_menu = document.querySelector('.btn-menu')
const form = document.querySelector('.form')
const email = document.querySelector('#email')
const telefone = document.querySelector('#telefone')

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
    
    alert('dados enviados')
    form.reset()
})

btn_menu.addEventListener('click', () => {
    const menu = document.querySelector('.menu')
    menu.classList.toggle('ativo')
})


const validarEmail = (email) => {
    const regexEmail = /^[^\s]+@[^\s]+\.[^\s]+$/
    return regexEmail.test(email)
}

const validarTelefone = (telefone) => {
    const apenasNumeros = telefone.replace(/[^0-9]/g, "")
    const regexTelefone = /^[0-9]{10,11}$/
    return regexTelefone.test(apenasNumeros)
}

