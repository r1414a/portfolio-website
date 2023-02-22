const typed = new Typed('#mytext',{
    strings : ['Based in Pune','Full-stack web developer'],
    typeSpeed: 70,
    backSpeed: 10,
    loop: true
})


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


AOS.init();