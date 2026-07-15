// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

key_emotes = ['🪨','🟫','🏖️','🥅','🌿']
key = ["Rocks", "Gravel", "Sand", "Mesh", "Biofilm"];
colors = ["#334", "#777", "#daa", "#ccc", "#ada"];
item_values = [-1, -1, -1];
max_val = key.length;
locked = false;
won = false;
let waterEffectInterval = null;
let bubbleEffectInterval = null;
current_level = 3;

level_recipe = gen_level_recipe();

document.getElementById("item-1").onclick = () => {if (!locked) increment_item(0)};
document.getElementById("item-2").onclick = () => {if (!locked) increment_item(1)};
document.getElementById("item-3").onclick = () => {if (!locked) increment_item(2)};

document.getElementById("faucet").onclick = () => {reset();};


document.getElementById("recipe").innerHTML = level_recipe;




function increment_item(item_num) {
  item_values[item_num] = (item_values[item_num] + 1) % max_val;
  if (document.getElementById("debug") !== null) document.getElementById("debug").innerHTML = item_values; 
  update_colors(item_num);
  update_names(item_num);
  update_icons(item_num);

  check_answer();
}

function update_colors(item_num) {
  let elem = document.getElementById("item-" + (item_num + 1).toString());
  let bg_color = (item_values[item_num] == -1) ? "white" : colors[item_values[item_num]];
  let bg_string = `radial-gradient(circle, #fff 90%, ${bg_color}5 90%)`
  // elem.style.background = bg_string;
  // elem.style.backgroundSize = "150% 100%";
  // elem.style.backgroundPosition = "0px 0px";
  // elem.style.backgroundRepeat = "no-repeat";
  
}

function update_names(item_num) {
  let elem = document.getElementById("item-name-" + (item_num + 1).toString());
  elem.innerHTML = (item_values[item_num] == -1) ? "Empty" : key[item_values[item_num]];
}

function update_icons(item_num) {
  let elem = document.getElementById("item-icon-" + (item_num + 1).toString());
  elem.innerHTML = (item_values[item_num] == -1) ? "☐" : `<p>${key_emotes[item_values[item_num]]}</p>`
}

function check_answer() {
  level_check_list = [];
  for (let i = 0; i < level_recipe.length; i++) {
    level_check_list.push(0);
  }

  for (let i = 0; i < item_values.length; i++) {
    for (let j = 0; j < level_recipe.length; j++) {
      if (level_check_list[j] == 0 && level_recipe[j] == key[item_values[i]]) {
        level_check_list[j] = 1;
        break;
      }
    }
  }

  for (let i = 0; i < level_check_list.length; i++) {
    if (level_check_list[i] == 0) return;
  }

  won = true;
  locked = true;
  winner();
}

function startWaterEffect() {
  if (waterEffectInterval !== null) return;
  const faucet = document.getElementById("faucet");
  waterEffectInterval = setInterval(() => {
    if (!won) return;
    createWaterDrop(faucet);
    if (Math.random() < 0.3) {
      createWaterBubble(faucet);
    }
  }, 120);
}

function stopWaterEffect() {
  if (waterEffectInterval !== null) {
    clearInterval(waterEffectInterval);
    waterEffectInterval = null;
  }
  if (bubbleEffectInterval !== null) {
    clearInterval(bubbleEffectInterval);
    bubbleEffectInterval = null;
  }
  const faucet = document.getElementById("faucet");
  faucet.querySelectorAll('.water-drop, .water-bubble').forEach(node => node.remove());
}

function createWaterDrop(faucet) {
  const drop = document.createElement("div");
  drop.className = "water-drop";
  const size = 8 + Math.random() * 14;
  const left = 30 + Math.random() * 30;
  const drift = (Math.random() - 0.5) * 40;
  const colors = ["#2AB8F7", "#4FCBFF", "#86D4FF", "#B6E8FF"];
  const shade = colors[Math.floor(Math.random() * colors.length)];
  drop.style.setProperty("--drop-size", `${size}px`);
  drop.style.setProperty("--drop-color", shade);
  drop.style.setProperty("--drop-duration", `${1.2 + Math.random() * 0.8}s`);
  drop.style.setProperty("--drop-drift", `${drift}px`);
  drop.style.left = `${left}%`;
  drop.style.top = `${10 + Math.random() * 10}%`;
  faucet.appendChild(drop);
  setTimeout(() => drop.remove(), 2400);
}

function createWaterBubble(faucet) {
  const bubble = document.createElement("div");
  bubble.className = "water-bubble";
  const size = 10 + Math.random() * 14;
  const left = 32 + Math.random() * 26;
  bubble.style.setProperty("--bubble-size", `${size}px`);
  bubble.style.setProperty("--bubble-duration", `${0.8 + Math.random() * 0.9}s`);
  bubble.style.left = `${left}%`;
  bubble.style.top = `${18 + Math.random() * 12}%`;
  faucet.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1800);
}

function winner() {
  if (document.getElementById("winner-debug") !== null) document.getElementById("winner-debug").innerHTML = "WINNER!";
  document.getElementById("faucet").innerHTML += "<p style=\"background-color: white\">NEXT LEVEL!</p>";
  startWaterEffect();
}

function gen_level_recipe() {
  let output = [];
  let counts = [];
  for (let i = 0; i < 3; i++) {
    let rand_val = key[Math.floor(Math.random() * key.length)];
    output.push(rand_val);
  }

  return output;
}

function reset() {
  item_values = [-1, -1, -1];
  max_val = key.length;
  locked = false;
  won = false;

  level_recipe = gen_level_recipe();

  document.getElementById("item-1").onclick = () => {if (!locked) increment_item(0)};
  document.getElementById("item-2").onclick = () => {if (!locked) increment_item(1)};
  document.getElementById("item-3").onclick = () => {if (!locked) increment_item(2)};

  document.getElementById("faucet").onclick = () => {if (!won) return; reset(); current_level++; document.getElementById("level").innerHTML = "Level: " + current_level.toString();};

  stopWaterEffect();

  for (let i =0 ; i < 3; i++) {
    update_colors(i);
    update_names(i);
    update_icons(i);
  }


  document.getElementById("recipe").innerHTML = level_recipe;

  if (document.getElementById("winner-debug") !== null) document.getElementById("winner-debug").innerHTML = "";
  document.getElementById("faucet").innerHTML = "";

}