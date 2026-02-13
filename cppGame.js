const isLocal = window.location.hostname === 'blindnecromancer.qg-portfolio.be';
const BASE_URL = isLocal 
    ? 'https://blindnecromancer.qg-portfolio.be' 
    : 'http://localhost:8080';

const input = document.getElementById('command-input');
const output = document.getElementById('output');

async function typeToTerminal(text, speed = 30, color = '#00d4ff') {
  const line = document.createElement('div');
  line.style.color = color;
  output.appendChild(line);

  input.disabled = true;

  for (let i = 0; i < text.length; i++) {
    line.textContent += text.charAt(i);
    await new Promise(res => setTimeout(res, speed));
    
    output.scrollTop = output.scrollHeight;
  }

  input.disabled = false;
  input.focus();
}

async function showNewGameIntro(playerName) {
    const intro = `You wake in near-total darkness, lungs burning with the taste of old dust.\n` +
        `Somewhere in these halls, something has gone terribly wrong.\n` +
        `Your fingers close around a familiar focus — the cold comfort of necromantic power.\n\n` +
        `Your name is ${playerName}. The dead will listen. The living may not.\n` +
        `Type 'pulse' to feel the shape of the room, or 'help' to recall your abilities.`;

    await typeToTerminal(intro, 20);
}

async function sendTurn(command) {
  console.log('Sending command:', command)
  const response = await fetch(`${BASE_URL}/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, sessionId: localStorage.getItem('activeGame') })
  });

  const data = await response.json();
  console.log('Received response:', data);
  return data;
}

async function startGame(name) {
  const response = await fetch(`${BASE_URL}/new-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName: name, mapName: 'map1' })
  });

  const data = await response.json();
  console.log('Game started:', data);
  return data;
}

let isActiveGame = localStorage.getItem('activeGame') !== null;

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    if (isActiveGame) {
      const cmd = input.value;
      input.value = '';

      const userLine = document.createElement('div');
      userLine.textContent = `> ${cmd}`;
      output.appendChild(userLine);

      try {
        const data = await sendTurn(cmd);
        
        const responseLine = document.createElement('div');
        responseLine.style.color = '#00d4ff';
        await typeToTerminal(`[SYSTEM]: "${data.description}"`, 20);
        output.appendChild(responseLine);
      } catch (error) {
        output.innerHTML += `<div style="color: red;">[ERROR]: Connection failed.</div>`;
      }

      output.scrollTop = output.scrollHeight;
    } else {
      const cmd = input.value;
      input.value = '';

      const userLine = document.createElement('div');
      userLine.textContent = `> ${cmd}`;
      output.appendChild(userLine);
      
      try {
        console.log('Starting game with name:', cmd);
        const gameData = await startGame(cmd);
        const responseLine = document.createElement('div');
        responseLine.style.color = '#00d4ff';
        await showNewGameIntro(cmd);
        localStorage.setItem('activeGame', gameData.sessionId);
        isActiveGame = true
        output.appendChild(responseLine);
      } catch (error) {
        console.log(error)
        output.innerHTML += `<div style="color: red;">[ERROR]: Game creation failed.</div>`;
      }
    }
  }
});

document.getElementById('game-button-demo').addEventListener('click', async () => {
  output.innerHTML = ''; 
  await typeToTerminal("Welcome to The Blind Necromancer...", 50);

  if (isActiveGame) {
    await typeToTerminal('Your attention snaps back to your waiting corpse-servants. The dungeon has not moved on without you.\nSpeak your next command.', 20);
  } else {
    await typeToTerminal('You surface from a dream of ashes and bone. A name forms on your tongue. Speak it to bind yourself to this place.', 20);
  }
});