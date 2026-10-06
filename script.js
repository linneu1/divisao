let totalApples = 0;
let divisor = 0;
let score = 0;
let draggedApple = null;

const treeEl = document.getElementById('tree');
const basketsContainer = document.getElementById('baskets-container');
const applesLeftEl = document.getElementById('apples-left');
const basketCountEl = document.getElementById('basket-count');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('status-message');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');

function initGame() {
  // Gera um divisor entre 2 e 9
  divisor = Math.floor(Math.random() * 8) + 2;
  
  // Gera multiplicador para garantir divisão exata (sem resto)
  const multiplier = Math.floor(Math.random() * 5) + 1; // 1 a 5 maçãs por cesto
  totalApples = divisor * multiplier;

  // Atualiza interface
  applesLeftEl.textContent = totalApples;
  basketCountEl.textContent = divisor;
  messageEl.textContent = '';
  messageEl.style.color = 'black';
  checkBtn.style.display = 'inline-block';
  nextBtn.style.display = 'none';

  // Limpa elementos anteriores
  treeEl.innerHTML = '';
  basketsContainer.innerHTML = '';

  // Cria as maçãs na árvore
  for (let i = 0; i < totalApples; i++) {
    const apple = document.createElement('span');
    apple.classList.add('apple');
    apple.textContent = '🍎';
    apple.draggable = true;
    apple.id = `apple-${i}`;

    // Eventos de Drag & Drop
    apple.addEventListener('dragstart', dragStart);
    treeEl.appendChild(apple);
  }

  // Cria a árvore como área de soltura (permitindo devolver maçãs)
  treeEl.addEventListener('dragover', dragOver);
  treeEl.addEventListener('drop', dropToTree);

  // Cria os cestos com base no divisor
  for (let i = 1; i <= divisor; i++) {
    const basket = document.createElement('div');
    basket.classList.add('basket');
    basket.dataset.basketId = i;

    const title = document.createElement('div');
    title.classList.add('basket-title');
    title.textContent = `Cesto ${i}`;

    const applesArea = document.createElement('div');
    applesArea.classList.add('basket-apples');
    applesArea.addEventListener('dragover', dragOver);
    applesArea.addEventListener('drop', dropToBasket);

    basket.appendChild(title);
    basket.appendChild(applesArea);
    basketsContainer.appendChild(basket);
  }
}

// Lógica de Drag & Drop
function dragStart(e) {
  draggedApple = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dropToBasket(e) {
  e.preventDefault();
  if (draggedApple) {
    const targetArea = e.currentTarget;
    targetArea.appendChild(draggedApple);
    updateApplesLeft();
  }
}

function dropToTree(e) {
  e.preventDefault();
  if (draggedApple) {
    treeEl.appendChild(draggedApple);
    updateApplesLeft();
  }
}

function updateApplesLeft() {
  const remaining = treeEl.querySelectorAll('.apple').length;
  applesLeftEl.textContent = remaining;
}

function checkAnswer() {
  const remainingInTree = treeEl.querySelectorAll('.apple').length;

  if (remainingInTree > 0) {
    messageEl.textContent = '⚠️ Distribua todas as maçãs da árvore antes de verificar!';
    messageEl.style.color = '#d32f2f';
    return;
  }

  const expectedPerBasket = totalApples / divisor;
  let isCorrect = true;

  const baskets = document.querySelectorAll('.basket-apples');
  baskets.forEach(basket => {
    if (basket.children.length !== expectedPerBasket) {
      isCorrect = false;
    }
  });

  if (isCorrect) {
    score += 10;
    scoreEl.textContent = score;
    messageEl.textContent = `🎉 Perfeito! ${totalApples} ÷ ${divisor} = ${expectedPerBasket} maçãs por cesto!`;
    messageEl.style.color = '#2e7d32';
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
  } else {
    messageEl.textContent = '❌ A divisão não ficou igual em todos os cestos. Tente novamente!';
    messageEl.style.color = '#d32f2f';
  }
}

function nextLevel() {
  initGame();
}

// Inicializa o jogo ao carregar
initGame();
