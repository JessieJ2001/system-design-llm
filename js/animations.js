/**
 * Shared animation helpers for System Design Learning Website.
 * Provides a simple framework for canvas-based animations with play/pause and step-through.
 */

// ===== Animation Loop Manager =====
function createAnimation(canvas, drawFn, options = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const fps = options.fps || 60;
  const interval = 1000 / fps;

  let running = false; // Start paused
  let animationId = null;
  let lastTime = 0;
  let elapsed = 0;

  // Step mode: define time points for each step
  // The draw function uses time (seconds) to determine what to show.
  // Steps are specific time values that represent key moments.
  const stepDuration = options.stepDuration || 0.5; // seconds between steps
  const totalDuration = options.totalDuration || 10; // total cycle duration
  const numSteps = options.numSteps || 20;
  let currentStep = 0;
  let stepMode = true; // Start in step mode

  function getStepTime(step) {
    return (step / numSteps) * totalDuration;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = options.width || rect.width - 32;
    const h = options.height || 400;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawFrame() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    drawFn(ctx, elapsed / 1000, w, h);
  }

  function loop(timestamp) {
    if (!running) return;
    animationId = requestAnimationFrame(loop);

    const delta = timestamp - lastTime;
    if (delta < interval) return;
    lastTime = timestamp - (delta % interval);
    elapsed += delta;

    drawFrame();
  }

  function start() {
    if (running) return;
    running = true;
    stepMode = false;
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    stepMode = false;
    if (animationId) cancelAnimationFrame(animationId);
  }

  function toggle() {
    if (running) stop(); else start();
    return running;
  }

  function reset() {
    elapsed = 0;
    currentStep = 0;
    lastTime = performance.now();
    drawFrame();
  }

  function nextStep() {
    if (running) {
      stop();
    }
    stepMode = true;
    currentStep = Math.min(currentStep + 1, numSteps);
    elapsed = getStepTime(currentStep) * 1000;
    drawFrame();
    return currentStep;
  }

  function prevStep() {
    if (running) {
      stop();
    }
    stepMode = true;
    currentStep = Math.max(currentStep - 1, 0);
    elapsed = getStepTime(currentStep) * 1000;
    drawFrame();
    return currentStep;
  }

  function getStep() {
    return currentStep;
  }

  function getTotalSteps() {
    return numSteps;
  }

  function isStepMode() {
    return stepMode;
  }

  resize();
  window.addEventListener('resize', () => {
    resize();
    drawFrame();
  });

  // Draw initial frame (step 0) without starting animation
  elapsed = 0;
  requestAnimationFrame(() => drawFrame());

  return { start, stop, toggle, reset, nextStep, prevStep, getStep, getTotalSteps, isStepMode, canvas, ctx };
}

// ===== Setup Controls =====
function setupControls(containerEl, animation) {
  const controls = containerEl.querySelector('.animation-controls');
  if (!controls) return;

  // Clear existing buttons
  controls.innerHTML = '';

  // Create buttons
  var prevBtn = document.createElement('button');
  prevBtn.setAttribute('data-action', 'prev');
  prevBtn.textContent = '← Prev Step';

  var nextBtn = document.createElement('button');
  nextBtn.setAttribute('data-action', 'next');
  nextBtn.textContent = 'Next Step →';

  var playBtn = document.createElement('button');
  playBtn.setAttribute('data-action', 'play');
  playBtn.textContent = 'Auto Play';

  var resetBtn = document.createElement('button');
  resetBtn.setAttribute('data-action', 'reset');
  resetBtn.textContent = 'Reset';

  // Step indicator
  var stepIndicator = document.createElement('span');
  stepIndicator.className = 'step-indicator';
  stepIndicator.textContent = 'Step 0 / ' + animation.getTotalSteps();

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(playBtn);
  controls.appendChild(resetBtn);
  controls.appendChild(stepIndicator);

  function updateStepDisplay() {
    stepIndicator.textContent = 'Step ' + animation.getStep() + ' / ' + animation.getTotalSteps();
    prevBtn.disabled = animation.getStep() <= 0;
    nextBtn.disabled = animation.getStep() >= animation.getTotalSteps();
  }

  updateStepDisplay();

  prevBtn.addEventListener('click', function() {
    animation.prevStep();
    playBtn.textContent = 'Auto Play';
    playBtn.classList.remove('active');
    updateStepDisplay();
  });

  nextBtn.addEventListener('click', function() {
    animation.nextStep();
    playBtn.textContent = 'Auto Play';
    playBtn.classList.remove('active');
    updateStepDisplay();
  });

  playBtn.addEventListener('click', function() {
    var isRunning = animation.toggle();
    playBtn.textContent = isRunning ? 'Pause' : 'Auto Play';
    playBtn.classList.toggle('active', isRunning);
    if (isRunning) {
      // When playing, continuously update step indicator
      (function updateWhilePlaying() {
        if (animation.isStepMode && !animation.isStepMode()) {
          stepIndicator.textContent = 'Playing...';
        }
        if (playBtn.classList.contains('active')) {
          requestAnimationFrame(updateWhilePlaying);
        } else {
          updateStepDisplay();
        }
      })();
    }
  });

  resetBtn.addEventListener('click', function() {
    animation.reset();
    animation.stop();
    playBtn.textContent = 'Auto Play';
    playBtn.classList.remove('active');
    updateStepDisplay();
  });
}

// ===== Drawing Primitives =====

function drawArrow(ctx, fromX, fromY, toX, toY, options = {}) {
  const color = options.color || '#2563eb';
  const width = options.width || 2;
  const headSize = options.headSize || 10;
  const dashed = options.dashed || false;

  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;

  if (dashed) ctx.setLineDash([6, 4]);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - headSize * Math.cos(angle), toY - headSize * Math.sin(angle));
  ctx.stroke();

  ctx.setLineDash([]);

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headSize * Math.cos(angle - Math.PI / 6),
    toY - headSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headSize * Math.cos(angle + Math.PI / 6),
    toY - headSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBox(ctx, x, y, w, h, options = {}) {
  const color = options.color || '#2563eb';
  const fill = options.fill || '#eff6ff';
  const text = options.text || '';
  const radius = options.radius || 6;
  const textColor = options.textColor || '#1e293b';
  const fontSize = options.fontSize || 13;

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();

  if (text) {
    ctx.fillStyle = textColor;
    ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
  }
  ctx.restore();
}

function drawCircle(ctx, x, y, r, options = {}) {
  const color = options.color || '#2563eb';
  const fill = options.fill || '#eff6ff';
  const text = options.text || '';
  const textColor = options.textColor || '#1e293b';
  const fontSize = options.fontSize || 12;

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (text) {
    ctx.fillStyle = textColor;
    ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

function drawLabel(ctx, x, y, text, options = {}) {
  const color = options.color || '#64748b';
  const fontSize = options.fontSize || 12;
  const align = options.align || 'center';
  const bold = options.bold || false;

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${bold ? '600' : '400'} ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = options.baseline || 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawMovingDot(ctx, fromX, fromY, toX, toY, progress, options = {}) {
  const color = options.color || '#2563eb';
  const radius = options.radius || 5;

  const x = fromX + (toX - fromX) * progress;
  const y = fromY + (toY - fromY) * progress;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Glow
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return { x, y };
}

function drawDashedLine(ctx, fromX, fromY, toX, toY, options = {}) {
  const color = options.color || '#e2e8f0';
  const width = options.width || 1;
  const dash = options.dash || [6, 4];

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.restore();
}

// Ease functions
const ease = {
  linear: t => t,
  inOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  out: t => t * (2 - t),
  in: t => t * t,
};

// Utility: loop a value between 0 and 1 over a given period (seconds)
function loopProgress(time, period) {
  return (time % period) / period;
}

// Utility: ping-pong between 0 and 1
function pingPong(time, period) {
  const p = loopProgress(time, period);
  return p < 0.5 ? p * 2 : 2 - p * 2;
}
