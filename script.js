
key_emotes = ['🪨','🟫','🏖️','🥅','🌿']
key = ["Rocks", "Gravel", "Sand", "Mesh", "Biofilm"];
colors = ["#334", "#777", "#daa", "#ccc", "#ada"];
locked = false;
won = false;
let waterEffectInterval = null;
let bubbleEffectInterval = null;
current_level = 1;

reset();


function increment_item(item_num) {
  item_values[item_num] = (item_values[item_num] + 1) % key.length;
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

function advanceToNextLevel() {
  current_level++;
  reset();
  document.getElementById("level").innerHTML = "Level: " + current_level.toString();
}

function showWinMessage() {
  hideWinMessage();

  const popup = document.createElement("div");
  popup.className = "win-popup";

  const messages = ["Nice job!", "Keep it up!", "Amazing work!", "You did it!"];
  const message = messages[Math.floor(Math.random() * messages.length)];

  popup.innerHTML = `
    <div class="win-popup-box">
      <p class="win-popup-title">${message}</p>
      <button id="next-level-btn" class="next-level-btn">Next Level</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("next-level-btn").onclick = () => {
    advanceToNextLevel();
  };
}

function hideWinMessage() {
  document.querySelectorAll(".win-popup").forEach((popup) => popup.remove());
}

function winner() {
  if (document.getElementById("winner-debug") !== null) document.getElementById("winner-debug").innerHTML = "WINNER!";
  showWinMessage();
  startWaterEffect();
}

function gen_level_recipe(num_of_items) {
  let output = [];
  let counts = [];
  for (let i = 0; i < num_of_items; i++) {
    let rand_val = key[Math.floor(Math.random() * key.length)];
    output.push(rand_val);
  }

  return output;
}

function reset() {
  let val = 100 - ((current_level / 5) * 100);

  let level_label = document.getElementsByClassName("level-label")[0];
  level_label.style.background = `radial-gradient(circle, #fff ${val}%, #77e ${val}%)`;

  num_of_items = current_level + 2;

  vertical_list = document.querySelector(".vertical-list");
  vertical_list.innerHTML = "";
  vertical_list.innerHTML += `<div class="water-arrow"><p>↓</p></div>`;
  for (let i = 0; i < num_of_items; i++) {
    vertical_list.innerHTML += `<div id="item-${i + 1}" class="vertical-list-item"><div class="item-icon" id="item-icon-${i + 1}"></div><p class="item-name" id="item-name-${i + 1}">Empty</p></div>`;
  }


  document.getElementById("faucet").onclick = () => {if (!won) return; advanceToNextLevel();};
  
  stopWaterEffect();
  hideWinMessage();
  locked = false;
  won = false;
  item_values = [];
  
  level_recipe = gen_level_recipe(num_of_items);
  document.getElementById("recipe").innerHTML = level_recipe.join(", ");

  for (let i = 0; i < num_of_items; i++) {
    item_values.push(-1);
    document.getElementById(`item-${i + 1}`).onclick = () => {if (!locked) increment_item(i)};

    update_icons(i);
    update_names(i);
    update_colors(i);
  }



  if (document.getElementById("winner-debug") !== null) document.getElementById("winner-debug").innerHTML = "";
  document.getElementById("faucet").innerHTML = "";

}