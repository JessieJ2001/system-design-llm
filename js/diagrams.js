/**
 * Reusable diagram components for System Design Learning Website.
 * Higher-level components built on top of animations.js primitives.
 */

// ===== Server Rack Icon =====
function drawServer(ctx, x, y, options = {}) {
  const w = options.width || 60;
  const h = options.height || 40;
  const color = options.color || '#2563eb';
  const fill = options.fill || '#eff6ff';
  const label = options.label || '';
  const healthy = options.healthy !== false;

  const statusColor = healthy ? '#16a34a' : '#dc2626';

  drawBox(ctx, x - w / 2, y - h / 2, w, h, { color, fill, text: '', radius: 6 });

  // Server lines
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const lineY1 = y - h / 4;
  const lineY2 = y + h / 4;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + 8, lineY1);
  ctx.lineTo(x + w / 2 - 16, lineY1);
  ctx.moveTo(x - w / 2 + 8, lineY2);
  ctx.lineTo(x + w / 2 - 16, lineY2);
  ctx.stroke();

  // Status LED
  ctx.fillStyle = statusColor;
  ctx.beginPath();
  ctx.arc(x + w / 2 - 10, y - h / 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w / 2 - 10, y + h / 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + h / 2 + 12, label, { fontSize: 11, bold: true });
  }
}

// ===== Database Icon =====
function drawDatabase(ctx, x, y, options = {}) {
  const w = options.width || 50;
  const h = options.height || 50;
  const color = options.color || '#2563eb';
  const fill = options.fill || '#eff6ff';
  const label = options.label || '';

  const ellipseH = h / 5;

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Body
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h / 2 + ellipseH);
  ctx.lineTo(x - w / 2, y + h / 2 - ellipseH);
  ctx.ellipse(x, y + h / 2 - ellipseH, w / 2, ellipseH, 0, Math.PI, 0, true);
  ctx.lineTo(x + w / 2, y - h / 2 + ellipseH);
  ctx.fill();
  ctx.stroke();

  // Top ellipse
  ctx.beginPath();
  ctx.ellipse(x, y - h / 2 + ellipseH, w / 2, ellipseH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + h / 2 + 12, label, { fontSize: 11, bold: true });
  }
}

// ===== User/Client Icon =====
function drawClient(ctx, x, y, options = {}) {
  const color = options.color || '#2563eb';
  const label = options.label || 'Client';

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = '#eff6ff';
  ctx.lineWidth = 2;

  // Head
  ctx.beginPath();
  ctx.arc(x, y - 12, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.arc(x, y + 12, 16, Math.PI * 1.2, Math.PI * 1.8, true);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + 32, label, { fontSize: 11, bold: true });
  }
}

// ===== Queue (horizontal pipe) =====
function drawQueue(ctx, x, y, items, options = {}) {
  const w = options.width || 200;
  const h = options.height || 40;
  const color = options.color || '#2563eb';
  const fill = options.fill || '#eff6ff';
  const label = options.label || '';

  drawBox(ctx, x - w / 2, y - h / 2, w, h, { color, fill, radius: h / 2 });

  // Draw items inside
  const maxVisible = options.maxVisible || 5;
  const itemW = (w - 20) / maxVisible;
  const visible = items.slice(0, maxVisible);

  visible.forEach((item, i) => {
    const ix = x - w / 2 + 10 + i * itemW + itemW / 2;
    ctx.save();
    ctx.fillStyle = item.color || color;
    ctx.beginPath();
    ctx.arc(ix, y, h / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  if (label) {
    drawLabel(ctx, x, y + h / 2 + 12, label, { fontSize: 11, bold: true });
  }
}

// ===== Load Balancer Icon =====
function drawLoadBalancer(ctx, x, y, options = {}) {
  const color = options.color || '#0891b2';
  const fill = options.fill || '#ecfeff';
  const label = options.label || 'Load Balancer';
  const size = options.size || 40;

  // Diamond shape
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x, y - size / 2);
  ctx.lineTo(x + size / 2, y);
  ctx.lineTo(x, y + size / 2);
  ctx.lineTo(x - size / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // LB text
  ctx.fillStyle = color;
  ctx.font = '600 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LB', x, y);
  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + size / 2 + 12, label, { fontSize: 11, bold: true });
  }
}

// ===== Cache Icon =====
function drawCache(ctx, x, y, options = {}) {
  const color = options.color || '#d97706';
  const fill = options.fill || '#fffbeb';
  const label = options.label || 'Cache';
  const w = options.width || 60;
  const h = options.height || 36;

  drawBox(ctx, x - w / 2, y - h / 2, w, h, { color, fill, radius: 6 });

  // Lightning bolt icon
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 8);
  ctx.lineTo(x + 4, y - 8);
  ctx.lineTo(x + 1, y - 1);
  ctx.lineTo(x + 6, y - 1);
  ctx.lineTo(x - 2, y + 10);
  ctx.lineTo(x + 1, y + 2);
  ctx.lineTo(x - 4, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + h / 2 + 12, label, { fontSize: 11, bold: true });
  }
}

// ===== Network Cloud =====
function drawCloud(ctx, x, y, options = {}) {
  const w = options.width || 80;
  const h = options.height || 50;
  const color = options.color || '#64748b';
  const fill = options.fill || '#f8fafc';
  const label = options.label || 'Internet';

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(x - w * 0.15, y + h * 0.1, h * 0.35, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x, y - h * 0.25, h * 0.35, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(x + w * 0.2, y + h * 0.05, h * 0.3, Math.PI * 1.4, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  if (label) {
    drawLabel(ctx, x, y + h / 2 + 8, label, { fontSize: 11, bold: true });
  }
}

// ===== Status Badge =====
function drawStatusBadge(ctx, x, y, text, type) {
  const colors = {
    success: { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
    warning: { bg: '#fef3c7', text: '#92400e', border: '#d97706' },
    danger: { bg: '#fce7f3', text: '#9d174d', border: '#dc2626' },
    info: { bg: '#dbeafe', text: '#1e40af', border: '#2563eb' },
  };
  const c = colors[type] || colors.info;

  ctx.save();
  ctx.font = '600 10px system-ui, sans-serif';
  const metrics = ctx.measureText(text);
  const pw = 8;
  const ph = 4;
  const bw = metrics.width + pw * 2;
  const bh = 18;

  ctx.fillStyle = c.bg;
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ===== Connector Lines (curved) =====
function drawCurvedConnector(ctx, fromX, fromY, toX, toY, options = {}) {
  const color = options.color || '#e2e8f0';
  const width = options.width || 2;
  const cpOffset = options.curveOffset || 40;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // Determine curve direction
  const dx = toX - fromX;
  const dy = toY - fromY;
  const isHorizontal = Math.abs(dx) > Math.abs(dy);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  if (isHorizontal) {
    ctx.bezierCurveTo(midX, fromY, midX, toY, toX, toY);
  } else {
    ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
  }
  ctx.stroke();
  ctx.restore();
}
