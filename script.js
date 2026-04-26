const maxHistoryItems = 5;

document.addEventListener('DOMContentLoaded', () => {
  const lengthInput = document.getElementById('longitud');
  const lengthValue = document.getElementById('lengthValue');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');

  lengthValue.textContent = lengthInput.value;
  lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
    actualizarFortaleza();
  });

  generateBtn.addEventListener('click', generar);
  copyBtn.addEventListener('click', copiar);

  cargarHistorial();
  generar();
});

function generar() {
  const length = Number(document.getElementById('longitud').value);
  const includeNumbers = document.getElementById('numeros').checked;
  const includeSymbols = document.getElementById('simbolos').checked;
  const includeUppercase = document.getElementById('mayusculas').checked;

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%&*?+-_=';
  const selectedSets = [lowercase];
  const requiredChars = [];

  if (includeUppercase) {
    selectedSets.push(uppercase);
    requiredChars.push(randomFrom(uppercase));
  }
  if (includeNumbers) {
    selectedSets.push(numbers);
    requiredChars.push(randomFrom(numbers));
  }
  if (includeSymbols) {
    selectedSets.push(symbols);
    requiredChars.push(randomFrom(symbols));
  }

  let passwordCharacters = [...requiredChars];

  while (passwordCharacters.length < length) {
    const set = randomFrom(selectedSets);
    passwordCharacters.push(randomFrom(set));
  }

  passwordCharacters = shuffle(passwordCharacters);
  const password = passwordCharacters.join('').slice(0, length);

  actualizarSalida(password);
  agregarHistorial(password);
}

function randomFrom(text) {
  return text[Math.floor(Math.random() * text.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function actualizarSalida(password) {
  const output = document.getElementById('output');
  output.textContent = password;
  actualizarFortaleza();
}

function copiar() {
  const password = document.getElementById('output').textContent;
  if (!password) return;

  navigator.clipboard.writeText(password).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copiado';
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.disabled = false;
    }, 1500);
  });
}

function actualizarFortaleza() {
  const password = document.getElementById('output').textContent;
  const strengthLevel = document.getElementById('strengthLevel');
  const strengthText = document.getElementById('strengthText');

  let score = 0;
  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let width = 20;
  let label = 'Débil';
  let color = '#ff6b6b';

  if (score >= 4) {
    width = 100;
    label = 'Fuerte';
    color = '#7ce695';
  } else if (score >= 3) {
    width = 68;
    label = 'Media';
    color = '#f6c24e';
  } else {
    width = 32;
    label = 'Débil';
    color = '#ff6b6b';
  }

  strengthLevel.style.width = `${width}%`;
  strengthLevel.style.background = color;
  strengthText.textContent = label;
}

function agregarHistorial(password) {
  const history = obtenerHistorial();
  const index = history.indexOf(password);

  if (index !== -1) {
    history.splice(index, 1);
  }

  history.unshift(password);

  while (history.length > maxHistoryItems) {
    history.pop();
  }

  guardarHistorial(history);
  renderizarHistorial(history);
}

function obtenerHistorial() {
  try {
    const stored = localStorage.getItem('passwordHistory');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function guardarHistorial(history) {
  localStorage.setItem('passwordHistory', JSON.stringify(history));
}

function cargarHistorial() {
  const history = obtenerHistorial();
  renderizarHistorial(history);
}

function renderizarHistorial(history) {
  const lista = document.getElementById('historial');
  lista.innerHTML = '';

  if (history.length === 0) {
    lista.innerHTML = '<li>No hay contraseñas generadas aún.</li>';
    return;
  }

  history.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    lista.appendChild(li);
  });
}
