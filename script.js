const btn_menu = document.querySelector('.btn-menu')

btn_menu.addEventListener('click', () => {
    const menu = document.querySelector('.menu')
    menu.classList.toggle('ativo')
})