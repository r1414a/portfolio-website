gsap.registerPlugin(ScrollTrigger,SplitText);


window.addEventListener("DOMContentLoaded", () => {
    document.fonts.ready.then(() => {
        let tl = gsap.timeline();
        tl.from("#contact-section-heading", { y: 100, opacity: 0, duration: 0.5 })
        .from("#contact-section-link", { y: 100, opacity: 0, duration: 0.5 })
        .from("#contact-section-copy", { y: 100, opacity: 0, duration: 0.5 })
        .from("#contact-section-skill", { y: 100, opacity: 0, duration: 0.5 });
      
    
      ScrollTrigger.create({
        animation: tl,
        trigger: "#contact",
        start: "top 80%",
        toggleActions: "restart none none none",
        // markers: true
      })
    
        let splitText = SplitText.create("#sub-hero-text",{
            type: "words",
        });
        
        gsap.from(splitText.words,{
            y: -100,
            opacity: 0,
            stagger: 0.05,
            rotation: "random(-80, 80)",
            ease: "back.out",
            duration: 2,
            scrollTrigger: {
                trigger: '#sub-hero',
                start: "top bottom",
                // markers:true,
                toggleActions: "restart none none none"
            }
        })
        
        
        const boxes = [
            {
                x : -window.innerWidth * 0.25,
                rotation: -360,
                selector: ".sub-hero-contact-2box-left"
            },
            {
                x : window.innerWidth * 0.25,
                rotation: 360,
                selector: ".sub-hero-contact-2box-right"
            }
        ]
        
        
        
        
        
        boxes.forEach(({x,rotation,selector}) => {
            gsap.from(selector,{
                x:x,
                duration: 1,
                rotation:rotation,
                scrollTrigger: {
                    trigger: "#sub-hero",
                    start: "top 90%",
                    end: "top 20%",
                    toggleActions: "restart none none none", //onEnter, onLeave, onEnterBack, and onLeaveBack
                    // markers: true
                }
            })
        })
        
        gsap.from(".sub-hero-interactive-button",{
            y: 400,
            duration: 1,
            scrollTrigger: {
                trigger: "#sub-hero",
                start: "top center",
                end: "top top",
                toggleActions: "restart none none none", //onEnter, onLeave, onEnterBack, and onLeaveBack
                // markers: true
            }
        })
        
        
        
        const sections = gsap.utils.toArray(".projects-sections");
        // console.log(sections)
        
        let lastSection = ScrollTrigger.create({
            trigger: sections[sections.length - 1],
            start: "center center",
        })
        
        
        sections.forEach((section,i) => {
            ScrollTrigger.create({
              trigger: section,
              start: () => {
                  if(window.innerWidth < 676){
                    return `top-=30px top`
                  }else{
                    return `center+=70px center+=${i * 30}`
                  }
            } ,
              end: () => lastSection.start,
              pin: true,
              pinSpacing: false,
            //   markers: true
            });
          });
        
        
        
          //Sometimes, when the layout changes after initial page load, the positions used by ScrollTrigger can be inaccurate or stale., after initial load scrollY may be 3200 but if some section gets added dynamically, then that section is now physically present in dom and is taking some space so that scrollY will get changed but scrollTrigger is not recalculating it, it is still taking the previous evaluated value,that's whu we need to do this 
          ScrollTrigger.refresh(); 
    });
  });


  
