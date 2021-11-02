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

// Audio
var ambiance = new Audio('assets/sounds/ambiance.mp3');
var pickup = new Audio('assets/sounds/pickup.mp3');
var a = 0;

// Collectables
var skulls = document.querySelectorAll(".skull");

// Character
var character = document.querySelector(".character");
var x = 90;
var y = 34;
var held_directions = [];
var speed = 1;

// Inventory
var inv_skulls_text = document.querySelector(".skulls-text");
var inv_skulls = 0;
inv_skulls_text.innerHTML = inv_skulls;

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
      if (a == 0) {
         a++;
         ambiance.play();
      }
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
   skulls.forEach(e => e.style.transform = `translate3d( ${e.dataset.x * pixelSize}px, ${e.dataset.y * pixelSize}px, 0 )`);
   skulls.forEach(function (e) {
      var a = x - e.dataset.x;
      var b = y - e.dataset.y;
      var c = Math.sqrt(a * a + b * b);
      if (c < 5)
      {
         pickup.play();
         e.remove();
         inv_skulls++;
         inv_skulls_text.innerHTML = inv_skulls;
         skulls = document.querySelectorAll(".skull"); // Actualize skull's list
      }
   });

}


// Main Game Loop
const step = () => {
   placeCharacter();
   window.requestAnimationFrame(() => {
      step();
      // console.log('x = ' + x + ' | y = ' + y);
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
document.body.addEventListener("mousedown", () => { isPressed = true; })
document.body.addEventListener("mouseup", () => {
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

// Quest System:

var text = ["Bienvenue dans le monde effrayant des <a class='orange'>Spookymons</a> !", "Déplace-toi avec les flèches du clavier ou sur l'écran.", "Mission 1: Ramasse tous les <a class='orange'>crânes</a>!", "Mission 2: Trouver le <a class='orange'>Fantomichel</a>!"];
var counter = 0;
var elem = document.querySelector(".text-info");
var inst = setInterval(change, 5000);

function change() {
   elem.innerHTML = text[counter];
   if (counter < 2) {
      counter++;
   }
   if (counter == 2 && inv_skulls == 4)
      counter++;
   if (counter >= text.length) {
      counter = 0;
      clearInterval(inst);
   }
}
change();
