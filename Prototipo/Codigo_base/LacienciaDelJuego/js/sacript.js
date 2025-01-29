console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    gsap
        .timeline({
            scrollTrigger: {
                trigger: ".wrapper",
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: true,
                markers: true
            }
        })
        .to("img", {
            scale: 2,
            z: 350,
            transformOrigin: "center center",
            ease: "power1.inOut"
        })
        .to(
            ".section.hero",
            {
                scale: 1.1,
                transformOrigin: "center center",
                ease: "power1.inOut"
            },
            "<"
        );
});


document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.column-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'https://www.canva.com/design/DAGKNQQDWdg/jbxkFIHOWZs8RQehFITmcQ/edit?utm_content=DAGKNQQDWdg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton';
        });
    });
});


document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.column-button1');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'https://www.canva.com/design/DAGPRToK340/ohV-LJQez0Kmmb2E7VXf-Q/edit?utm_content=DAGPRToK340&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton';
        });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.column-button2');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'https://diefer269.github.io/Evuluaton/';
        });
    });
});



document.addEventListener('DOMContentLoaded', (event) => {
    const gameButton = document.getElementById('game-button');
    gameButton.addEventListener('click', () => {
        window.location.href = 'https://diefer269.github.io/Evuluaton/';
    });
});