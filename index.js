let c = document.getElementById('cursor');
addEventListener("mousemove",(e) => {
    c.classList.add(`top-${clientY}`);
    c.classList.add(`left-${clientX}`);
    console.log(e);
})