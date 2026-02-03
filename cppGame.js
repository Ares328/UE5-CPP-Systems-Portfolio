async function sendTurn(command) {
  console.log('Sending command:', command)
  const response = await fetch('https://blindnecromancer.qg-portfolio.be/turn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });

  const data = await response.json();
  console.log('Received response:', data);
  return data;
}

const input = document.getElementById('command-input');
const output = document.getElementById('output');

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value;
    input.value = '';

    const userLine = document.createElement('div');
    userLine.textContent = `> ${cmd}`;
    output.appendChild(userLine);

    try {
      const data = await sendTurn(cmd);
      
      const responseLine = document.createElement('div');
      responseLine.style.color = '#00d4ff';
      responseLine.textContent = `[SYSTEM]: "${data.description}"`;
      output.appendChild(responseLine);
    } catch (error) {
      output.innerHTML += `<div style="color: red;">[ERROR]: Connection failed.</div>`;
    }

    output.scrollTop = output.scrollHeight;
  }
});