/*  ****************************************************************************  */
/*                                                                                */
/*     42Gamedev - GameJam Saison 1                ██╗  ██╗██████╗                */
/*                                                 ██║  ██║╚════██╗               */
/*     Team: rbourgea                              ███████║ █████╔╝               */
/*     Date: 2021/10/31                            ╚════██║██╔═══╝                */
/*     Time: 72h                                        ██║███████╗               */
/*                                                      ╚═╝╚══════╝GamDev.fr      */
/* *****************************************************************************  */


var map = document.querySelector(".map");
var audio = new Audio('assets/ambiance.mp3');

// Collectables
var skulls = document.querySelectorAll(".skull");
var x1 = 100, y1 = 35;

// Character
var character = document.querySelector(".character");
var x = 90;
var y = 34;
var held_directions = [];
var speed = 1;

const placeCharacter = () => {
   
   var pixelSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );
   
   const held_direction = held_directions[0];
   if (held_direction) {
      if (held_direction === directions.right) {x += speed;}
      if (held_direction === directions.left) {x -= speed;}
      if (held_direction === directions.down) {y += speed;}
      if (held_direction === directions.up) {y -= speed;}
      character.setAttribute("facing", held_direction);
   }
   character.setAttribute("walking", held_direction ? "true" : "false");
   
   var leftLimit = -8;
   var rightLimit = (16 * 11)+8;
   var topLimit = -8 + 32;
   var bottomLimit = (16 * 7);
   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }
   
   
   var camera_left = pixelSize * 66;
   var camera_top = pixelSize * 42;
   
   map.style.transform = `translate3d( ${-x*pixelSize+camera_left}px, ${-y*pixelSize+camera_top}px, 0 )`;
   character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
   // Collectables
   skulls.forEach(e => e.style.transform = `translate3d( ${e.getAttribute(x) * pixelSize}px, ${e.getAttribute(y) * pixelSize}px, 0 )`);
   // skulls[0].style.transform = `translate3d( ${x1 * pixelSize}px, ${y1 * pixelSize}px, 0 )`;

   if (x <= x1 + 5 && x >= x1 - 5 && y <= y1 + 5 && y >= y1 - 5)
   {
      skulls[0].remove();
   }
}


// Main Game Loop
const step = () => {
   placeCharacter();
   window.requestAnimationFrame(() => {
      step();
      audio.play();
   })
}
step();

// Player's movements
const directions = {
   up: "up",
   down: "down",
   left: "left",
   right: "right",
}
const keys = {
   38: directions.up,
   37: directions.left,
   39: directions.right,
   40: directions.down,
}
document.addEventListener("keydown", (e) => {
   var dir = keys[e.which];
   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir)
   }
   document.querySelector(".dpad-"+dir).classList.add("pressed");
})

document.addEventListener("keyup", (e) => {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1)
   }
   removePressedAll();
});

/* Dpad */
var isPressed = false;
const removePressedAll = () => {
   document.querySelectorAll(".dpad-button").forEach(d => {
      d.classList.remove("pressed")
   })
}
document.body.addEventListener("mousedown", () => {
   console.log('mouse is down')
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
   console.log('mouse is up')
   isPressed = false;
   held_directions = [];
   removePressedAll();
})
const handleDpadPress = (direction, click) => {   
   if (click) {
      isPressed = true;
   }
   held_directions = (isPressed) ? [direction] : []
   
   if (isPressed) {
      removePressedAll();
      document.querySelector(".dpad-"+direction).classList.add("pressed");
   }
}
// Dpad's events
document.querySelector(".dpad-left").addEventListener("touchstart", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("touchstart", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("touchstart", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("touchstart", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mousedown", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("mousedown", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("mousedown", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("mousedown", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mouseover", (e) => handleDpadPress(directions.left));
document.querySelector(".dpad-up").addEventListener("mouseover", (e) => handleDpadPress(directions.up));
document.querySelector(".dpad-right").addEventListener("mouseover", (e) => handleDpadPress(directions.right));
document.querySelector(".dpad-down").addEventListener("mouseover", (e) => handleDpadPress(directions.down));

var text = ["Bienvenue dans le monde effrayant des Spookymons !", "Déplace-toi avec les flèches du clavier ou sur l'écran.", "Mission 1: Trouver le fantomichel !"];
var counter = 0;
var elem = document.querySelector(".text-info");
var inst = setInterval(change, 5000);

function change() {
   elem.innerHTML = text[counter];
   counter++;
   if (counter >= text.length) {
      counter = 0;
      clearInterval(inst);
   }
}
change();