
let OBSTACLE_HEIGHT ;


// module aliases
const Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;
Mouse = Matter.Mouse;
Events = Matter.Events,
    Constraint = Matter.Constraint;
MouseConstraint = Matter.MouseConstraint;
Composites = Matter.Composites;

//select the canvas element
const heroSectionCanvas = document.getElementById("hero-section");
let herosectionCanvasWidth = heroSectionCanvas.clientWidth;
let herosectionCanvasHeight = heroSectionCanvas.clientHeight;

console.log("width",herosectionCanvasWidth, "height",herosectionCanvasHeight)

window.addEventListener("resize", () => {
    herosectionCanvasWidth = heroSectionCanvas.clientWidth;
    herosectionCanvasHeight = heroSectionCanvas.clientHeight;
resizeCanvas(herosectionCanvasWidth,herosectionCanvasHeight);
resetSimulation();

})  


let engine;
let circle1;
let ground1;
let topWall;
let leftWall;
let rightWall;
let stackGround;
let obstacle1;
let sling;
let headingArr = [];
let allCircles = [];
let stackBoxes = [];
let world;
let mConstraint;
let canvas;
let slingShotXCord,slingShotYCord,ballSize,stackGroundY,stackGroundX,stackBoxesFallingHeight;




function LetterBox(x, y, letter, color,fontSize) {
    this.w = 30;
    this.h = 30;
    this.letter = letter;
    this.fontSize = fontSize;
    this.color = color;
    this.body = Bodies.rectangle(x, y, this.w, this.h, {
        restitution: 0.6,
        friction: 0.1,
        // isStatic: true,
        label: `letter-${letter}`
    });

    Body.setVelocity(this.body, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, 0);


    Composite.add(world, this.body);

    this.show = function () {
        let pos = this.body.position;
        let angle = this.body.angle;

        fill(color);
        noStroke();

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        textSize(this.fontSize);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(this.letter, 0, 0);
        pop();
    }
}

function CircleA(x, y, r) {

    circleOptions = {
        restitution: 0.6,
        friction: 0,
        density: 0.04,
        frictionAir: 0
    }

    this.body = Bodies.circle(x, y, r, circleOptions);
    Composite.add(world, this.body);

    this.show = function () {
        fill("red");
        noStroke();
        circle(this.body.position.x, this.body.position.y, r * 2);
    }
}


function GroundA(x, y, w, h, color = 255, wantStatic = true) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;
    this.wantStatic = wantStatic;

    this.body = Bodies.rectangle(x, y, w, h, {
        isStatic: this.wantStatic
        // label: `wall-${}`
    });
    Composite.add(world, this.body);



    this.show = function () {
        fill(this.color);
        // fill("black");
        rectMode(CENTER);
        stroke(255);
        rect(this.x, this.y, this.w, this.h);
    }

}

function StackBox(x, y, w, h,color) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;

    this.body = Bodies.rectangle(x, y, w, h, {
        isStatic: false
    });
    Composite.add(world, this.body);

    this.show = function () {
        let pos = this.body.position;
        let angle = this.body.angle;
       
        push();
        noStroke();
        fill(this.color);
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        stroke(255);
        rect(0, 0, this.w, this.h);
        pop();
    }
}


function slingShot(circle,x,y) {

    this.circle = circle;
    options = {
        pointA: { x: x, y: y },
        bodyB: this.circle.body,
        stiffness: 0.04,
        length: 50,
    }
    this.constraint = Constraint.create(options);
    Composite.add(world, this.constraint);

    this.show = function () {
        if (this.constraint.bodyB) {
            stroke(0);
            line(this.constraint.pointA.x, this.constraint.pointA.y, this.constraint.bodyB.position.x, this.constraint.bodyB.position.y)
        }
    }

    this.fly = function () {
        this.constraint.bodyB = null;
    }
    this.attach = function (newCircle) {
        this.constraint.bodyB = newCircle.body;
        this.circle = newCircle;
    }
}


function Obstacle(x,y,w,h){
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;

    this.body = Bodies.rectangle(x, y, w, h, {
        isStatic: false, 
        frictionAir: 0.02, 
        inertia: Infinity 
    });

    Composite.add(world,this.body);
    
    options = {
        pointA: {x:this.x, y:this.y},
        bodyB: this.body,
        stiffness: 1,
        length: 0,
    }
    const constraint = Constraint.create(options);
    Composite.add(world,constraint);
    
    this.show = function(){
        let pos = this.body.position;
        let angle = this.body.angle;
        
        Body.setAngularVelocity(this.body, 0.05);

        push();
        fill("#364153");
        noStroke();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        // rect(this.x,this.y, this.w,this.h)
        rect(0,0, this.w,this.h)
        pop();
    } 
}


function setResponsiveValues(obstacleWidth,obstacleHeight){
    if(herosectionCanvasWidth < 676){
         slingShotXCord = herosectionCanvasWidth/2;
         slingShotYCord = herosectionCanvasHeight - herosectionCanvasHeight * 0.55;
         ballSize = 10;
         stackGroundY = herosectionCanvasHeight / 2 - herosectionCanvasHeight * 0.25;
         stackGroundX = herosectionCanvasWidth - herosectionCanvasWidth * 0.2
         obstacle1 = null;
    }else{
 slingShotXCord = herosectionCanvasWidth - herosectionCanvasWidth * 0.85;
     slingShotYCord = herosectionCanvasHeight - herosectionCanvasHeight * 0.75;
     ballSize = 13
     stackGroundY = herosectionCanvasHeight / 2 - herosectionCanvasHeight * 0.1;
     obstacle1 = new Obstacle(herosectionCanvasWidth/2,herosectionCanvasHeight/2-200,obstacleWidth, obstacleHeight);
     stackGroundX = herosectionCanvasWidth - herosectionCanvasWidth * 0.05
    }
}




function setup() {

    const obstacleWidth = Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.25;
    const obstacleHeight = Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.1;
    

    canvas = createCanvas(herosectionCanvasWidth, herosectionCanvasHeight);
    canvas.parent('hero-section');


    // create an engine
    engine = Engine.create();
    world = engine.world;
    // create runner
    var runner = Runner.create();
    // run the engine
    
    Runner.run(runner, engine);

    setResponsiveValues(obstacleWidth,obstacleHeight);


    circle1 = new CircleA(200, 200, ballSize);
    allCircles.push(circle1);


    showStackBoxes();

    showFullHeading(herosectionCanvasWidth);

   
    ground1 = new GroundA(herosectionCanvasWidth / 2, herosectionCanvasHeight - 100, herosectionCanvasWidth, herosectionCanvasHeight - herosectionCanvasHeight * 0.7)
    topWall = new GroundA(herosectionCanvasWidth / 2, 0, herosectionCanvasWidth, 40)
    leftWall = new GroundA(10, herosectionCanvasHeight / 2, 20, herosectionCanvasHeight);
    rightWall = new GroundA(herosectionCanvasWidth, herosectionCanvasHeight / 2, 30, herosectionCanvasHeight);

    stackGround = new GroundA(stackGroundX, stackGroundY, herosectionCanvasWidth / 2, 10, "#364153")


    createMouseConstraint(canvas,engine);

    sling = new slingShot(allCircles[allCircles.length - 1],slingShotXCord,slingShotYCord);
    // rotateObstacle1 = new RotateObstacle1();

}

function createMouseConstraint(canvas,engine) {

    if (!canvas || !canvas.elt) {
        console.warn("Canvas element is undefined for Mouse.create()");
        return;
    }

    // Remove existing MouseConstraint if it exists
    if (mConstraint) {
        Composite.remove(world, mConstraint);
        console.log("Existing MouseConstraint removed");
    }
    // console.log("dgdfg",canvas)
    let canvasMouse = Mouse.create(canvas.elt); // use p5 canvas element
    canvasMouse.pixelRatio = pixelDensity();

    mConstraint = MouseConstraint.create(engine, {
        mouse: canvasMouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    })
    Composite.add(world, mConstraint);

    console.log("New MouseConstraint created and added to world");
}

function resetSimulation(){
    Composite.clear(world, false);
    const obstacleWidth = Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.25;
    const obstacleHeight = Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.1;
    // let slingShotXCord,slingShotYCord;
    setResponsiveValues(obstacleWidth,obstacleHeight);


    allCircles = [];
    headingArr = [];
    stackBoxes = [];

    // 3. Recreate scene
    circle1 = new CircleA(500, 200, ballSize);
    allCircles.push(circle1);



    

    showStackBoxes();
    showFullHeading(herosectionCanvasWidth);

    ground1 = new GroundA(herosectionCanvasWidth / 2, herosectionCanvasHeight - 100, herosectionCanvasWidth, herosectionCanvasHeight - herosectionCanvasHeight * 0.7)
    topWall = new GroundA(herosectionCanvasWidth / 2, 0, herosectionCanvasWidth, 40)
    leftWall = new GroundA(10, herosectionCanvasHeight / 2, 20, herosectionCanvasHeight);
    rightWall = new GroundA(herosectionCanvasWidth - 20, herosectionCanvasHeight / 2, 30, herosectionCanvasHeight);

    stackGround = new GroundA(stackGroundX, stackGroundY, herosectionCanvasWidth / 2, 10, "#364153")

    createMouseConstraint(canvas, engine);

    sling = new slingShot(allCircles[0],slingShotXCord,slingShotYCord);

}



function showStackBoxes() {
    console.log(Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.06 );
    const boxSize = Math.min(herosectionCanvasWidth, herosectionCanvasHeight) * 0.05;
    const columns = 5;
    const rows = 5;
    const stackWidth = columns * boxSize;

    const stackStartX = herosectionCanvasWidth - stackWidth - 30;
    const stackStartY = herosectionCanvasHeight / 2 - herosectionCanvasHeight * 0.27;
    const colorArr = ["red", "blue","yellow","orange", "purple", "pink"];
    
    for (let i = 0; i < rows  ; i++) {
        // console.log("box")
        for (let j = 0; j < (5 - i); j++) {
            const color = Math.floor(Math.random() * colorArr.length);
            let x = stackStartX + j * boxSize + i * 20;
            let y = stackStartY - i * boxSize;
            let box = new StackBox(x, y, boxSize, boxSize, colorArr[color]);
            stackBoxes.push(box);
        }
    }
}

function showFullHeading(width) {
    let nameHeading;  //29
    let maxFontSize;;
    if(width <676){
        nameHeading = "I'm Rupesh"
        maxFontSize = Math.min(herosectionCanvasWidth / 10, 40);
    }else{
        nameHeading = "Hello, I'm Rupesh Chincholkar";
        maxFontSize = Math.min(herosectionCanvasWidth / 29, 70);
    }

    let spacing = maxFontSize * 0.7; // spacing between letters

    let startX = herosectionCanvasWidth / 2 - (nameHeading.length * spacing) / 2;
    let x, y;

    for (let i = 0; i < nameHeading.length; i++) {
        x = startX + i * spacing;
        y = herosectionCanvasHeight - 250;

        let color = i <= 9 ? "#364153" : "#155DFC";
        let box = new LetterBox(x, y, nameHeading[i], color, maxFontSize);
        // box.fontSize = maxFontSize; // store fontSize per letter
        headingArr.push(box);
    }
}


// function showFullHeading(){
//     let nameHeading = "Hello,I'm Rupesh Chincholkar";
//     let startX = herosectionCanvasWidth / 2 - nameHeading.length * 22;
//     let x, y;

//     for (let i = 0; i < nameHeading.length; i++) {
//         x = startX + i * 45;
//         y = herosectionCanvasHeight - 300;

//         let color = i <= 9 ? "#364153" : "#155DFC";

//         headingArr.push(new LetterBox(x, y, nameHeading[i], color));

//     }

// }

function  keyPressed() {
    if (key === 'r') {
        resetSimulation();
    }
}

function mouseReleased() {
    handleRelease();
}

function touchEnded() {
    handleRelease();
}

function handleRelease() {
    const attachedBody = sling.constraint.bodyB;

    if (mConstraint.body && mConstraint.body === attachedBody) {
        setTimeout(() => {
            sling.fly();
        }, 100);
        setTimeout(() => {
            const newBall = new CircleA(100, 200, ballSize);
            allCircles.push(newBall);
            sling.attach(newBall);
        }, 2000);
    }

    // Prevent default touch behavior (like scrolling)
    return false;
}


function draw() {
    background(255);
    allCircles.forEach((circle) => {
        circle.show();
    })
    ground1.show();
    topWall.show();
    leftWall.show();
    rightWall.show();
    stackGround.show();
    if(obstacle1 != null){
        obstacle1.show();
    }
    sling.show();
    for (let i = 0; i < headingArr.length; i++) {
        headingArr[i].show();
    }
    stackBoxes.forEach((box) => {
        box.show();
    })

}




