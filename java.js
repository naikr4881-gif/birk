const lightScenes = { 2: true, 5: true };
const brokenImages = {};

// Generate accurate stacking order when the site mounts
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.keepsake-photo-card');
  cards.forEach((card, idx) => {
    card.style.zIndex = cards.length - idx;
  });
});

function cycleKeepsakeCard(clickedCard, src, initials) {
  if (clickedCard.classList.contains('slide-out-cycle')) return;

  // Slide card sideways to mimic physical hand clearing
  clickedCard.classList.add('slide-out-cycle');

  setTimeout(() => {
    const container = document.getElementById('keepsakeContainer');
    const allCards = Array.from(container.querySelectorAll('.keepsake-photo-card'));

    // Target current minimum backdrop stack depth layer 
    let lowestZ = Math.min(...allCards.map(c => parseInt(c.style.zIndex) || 0));

    clickedCard.style.zIndex = lowestZ - 1;
    clickedCard.classList.remove('slide-out-cycle');

    // Provide a random micro angle profile to reinforce real aesthetic look
    const shiftRotation = (Math.random() * 8 - 4).toFixed(1);
    clickedCard.style.transform = `rotate(${shiftRotation}deg) translate(${(Math.random() * 4 - 2)}px, ${(Math.random() * 4 - 2)}px)`;
  }, 600);
}

function handleImageError(img, initials) {
  brokenImages[img.getAttribute('src')] = initials;
  const fallback = document.createElement('div');
  fallback.className = 'img-fallback-box';
  fallback.innerText = initials;
  fallback.style.height = '100%';
  fallback.style.display = 'flex';
  fallback.style.alignItems = 'center';
  fallback.style.justifyContent = 'center';
  fallback.style.background = '#fcf8f0';
  fallback.style.color = 'var(--wine)';
  fallback.style.fontSize = '2rem';

  const parent = img.parentNode;
  parent.replaceChild(fallback, img);
}

function handleLightboxError(img) {
  img.style.display = 'none';
  const fallbackBox = document.getElementById('lightboxFallback');
  fallbackBox.innerText = '✦';
  fallbackBox.style.width = '280px';
  fallbackBox.style.height = '280px';
  fallbackBox.style.display = 'flex';
}

function goTo(n) {
  for (let i = 1; i <= 5; i++) {
    const stage = document.getElementById('scene-' + i);
    const scene = stage.querySelector('.scene');

    if (i === n) {
      stage.style.display = 'flex';
      scene.classList.add('active');
    } else {
      stage.style.display = 'none';
      scene.classList.remove('active');
    }
  }
  document.querySelectorAll('.dot').forEach(d => {
    const i = Number(d.dataset.i);
    d.classList.toggle('active', i === n);
    d.classList.toggle('on-light', !!lightScenes[n]);
  });
  if (n === 5) { launchConfetti(24); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openEnvelope() {
  const env = document.getElementById('envelope');
  env.classList.add('open');
  document.getElementById('tapHint').style.display = 'none';
  setTimeout(() => {
    document.getElementById('scene1Continue').style.display = 'block';
  }, 700);
}

function openLightbox(src, initials) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbFallback = document.getElementById('lightboxFallback');

  if (brokenImages[src]) {
    lbImg.style.display = 'none';
    lbFallback.innerText = initials;
    lbFallback.style.width = '280px';
    lbFallback.style.height = '280px';
    lbFallback.style.display = 'flex';
  } else {
    lbFallback.style.display = 'none';
    lbImg.style.display = 'block';
    lbImg.src = src;
  }
  lb.classList.add('show');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
}

function turnLightsOn() {
  document.getElementById('scene-3').classList.add('lit');
  document.getElementById('lantern').classList.add('lit');
  document.getElementById('litMessage').classList.add('show');
}

function blowCandle() {
  const flame = document.getElementById('flame');
  const msg = document.getElementById('blownMsg');
  if (flame.style.display !== 'none') {
    flame.style.display = 'none';
    msg.classList.add('show');
    launchConfetti(16);
  }
}

function launchConfetti(count) {
  count = count || 30;
  const colors = ['#c9974c', '#5e1326', '#e7c98a', '#fbf4e6', '#a97a36'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}