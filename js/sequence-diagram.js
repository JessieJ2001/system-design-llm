/**
 * Sequence-diagram renderer.
 * Scans for [data-flow] elements and replaces them with an SVG sequence diagram.
 *
 * Usage:
 *   <div class="flow-diagram" data-flow='{"participants":[{"name":"App","color":"blue"},...],
 *                                          "steps":[{"from":"App","to":"Cache","label":"GET user:42"},
 *                                                   {"from":"Cache","to":"App","label":"MISS","style":"dashed"},
 *                                                   {"note":"Background","span":["Cache","DB"]}]}' ></div>
 *
 * Participant colors: blue, cyan, amber, green, violet, slate. Default = slate.
 * Step kinds: regular (solid), dashed (response), async (dashed + async tag), note (dashed gray).
 */
(function() {
  'use strict';

  var COLORS = {
    blue:   { fill: '#eff6ff', stroke: '#2563eb', text: '#1e3a8a' },
    cyan:   { fill: '#ecfeff', stroke: '#0891b2', text: '#155e75' },
    amber:  { fill: '#fef3c7', stroke: '#d97706', text: '#92400e' },
    green:  { fill: '#d1fae5', stroke: '#059669', text: '#065f46' },
    violet: { fill: '#ede9fe', stroke: '#7c3aed', text: '#5b21b6' },
    rose:   { fill: '#fee2e2', stroke: '#dc2626', text: '#991b1b' },
    slate:  { fill: '#f8fafc', stroke: '#475569', text: '#1e293b' }
  };

  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function colorFor(p) {
    return COLORS[(p && p.color) || 'slate'];
  }

  function renderDiagram(spec) {
    var participants = spec.participants.map(function(p) {
      return typeof p === 'string' ? { name: p, color: 'slate' } : p;
    });
    var steps = spec.steps || [];

    var W = spec.width || 760;
    var pCount = participants.length;
    var pBoxW = 100;
    var pBoxH = 32;
    var topPad = 18;
    var headerY = topPad;
    var lifelineTop = topPad + pBoxH + 4;

    // Compute x for each participant
    var lane = (W - 60) / pCount;
    var xs = participants.map(function(p, i) {
      return 30 + lane * (i + 0.5);
    });
    var nameToIdx = {};
    participants.forEach(function(p, i) { nameToIdx[p.name] = i; });

    // Step layout
    var stepGap = 38;
    var stepStart = lifelineTop + 22;
    var H = stepStart + steps.length * stepGap + 18;

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      'preserveAspectRatio': 'xMidYMid meet',
      'font-family': 'system-ui, -apple-system, "Segoe UI", sans-serif',
      'font-size': '12'
    });

    // Defs: arrow markers per color
    var defs = svgEl('defs');
    Object.keys(COLORS).forEach(function(name) {
      var col = COLORS[name];
      var marker = svgEl('marker', { id: 'flow-arr-' + name, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' });
      var path = svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: col.stroke });
      marker.appendChild(path);
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    // Participants
    participants.forEach(function(p, i) {
      var col = colorFor(p);
      var rx = xs[i] - pBoxW / 2;
      svg.appendChild(svgEl('rect', {
        x: rx, y: headerY, width: pBoxW, height: pBoxH, rx: 6,
        fill: col.fill, stroke: col.stroke, 'stroke-width': 1.5
      }));
      var t = svgEl('text', {
        x: xs[i], y: headerY + pBoxH / 2 + 4,
        'text-anchor': 'middle', fill: col.text, 'font-weight': 600
      });
      t.textContent = p.name;
      svg.appendChild(t);
      // Lifeline
      svg.appendChild(svgEl('line', {
        x1: xs[i], y1: lifelineTop, x2: xs[i], y2: H - 8,
        stroke: '#cbd5e1', 'stroke-dasharray': '3 4'
      }));
    });

    // Steps
    steps.forEach(function(s, si) {
      var y = stepStart + si * stepGap;

      if (s.note) {
        // Note spanning some participants (or the whole diagram)
        var x1, x2;
        if (s.span) {
          x1 = xs[nameToIdx[s.span[0]]];
          x2 = xs[nameToIdx[s.span[1]]];
        } else {
          x1 = xs[0]; x2 = xs[xs.length - 1];
        }
        var nx = Math.min(x1, x2) - 6;
        var nw = Math.abs(x2 - x1) + 12;
        svg.appendChild(svgEl('rect', {
          x: nx, y: y - 13, width: nw, height: 22, rx: 4,
          fill: '#f1f5f9', stroke: '#94a3b8', 'stroke-dasharray': '2 3'
        }));
        var nt = svgEl('text', { x: nx + nw / 2, y: y + 2, 'text-anchor': 'middle', fill: '#475569', 'font-style': 'italic' });
        nt.textContent = s.note;
        svg.appendChild(nt);
        return;
      }

      var fromIdx = nameToIdx[s.from];
      var toIdx = nameToIdx[s.to];
      if (fromIdx === undefined || toIdx === undefined) return;
      var fromX = xs[fromIdx];
      var toX = xs[toIdx];

      // Determine color
      var stepColor = s.color;
      if (!stepColor) {
        var fromColor = participants[fromIdx].color || 'slate';
        stepColor = fromColor;
      }
      var col = COLORS[stepColor] || COLORS.slate;

      // Self-call (loop)
      if (fromIdx === toIdx) {
        var ax = fromX;
        var px = svgEl('path', {
          d: 'M ' + ax + ' ' + (y - 4) + ' C ' + (ax + 50) + ' ' + (y - 12) + ', ' + (ax + 50) + ' ' + (y + 12) + ', ' + ax + ' ' + (y + 4),
          fill: 'none', stroke: col.stroke, 'stroke-width': 1.5,
          'marker-end': 'url(#flow-arr-' + stepColor + ')'
        });
        if (s.style === 'dashed' || s.style === 'async') px.setAttribute('stroke-dasharray', '5 3');
        svg.appendChild(px);
        var lt = svgEl('text', { x: ax + 56, y: y + 2, fill: col.text });
        lt.textContent = (si + 1) + '. ' + s.label;
        svg.appendChild(lt);
        return;
      }

      // Number circle at the from-side
      var dir = toX > fromX ? 1 : -1;
      var cx = fromX + dir * 8;
      var nodeX1 = fromX + dir * 16;
      var nodeX2 = toX - dir * 8;
      var line = svgEl('line', {
        x1: nodeX1, y1: y, x2: nodeX2, y2: y,
        stroke: col.stroke, 'stroke-width': 1.5,
        'marker-end': 'url(#flow-arr-' + stepColor + ')'
      });
      if (s.style === 'dashed' || s.style === 'async') line.setAttribute('stroke-dasharray', '5 3');
      svg.appendChild(line);

      // Step number badge
      var num = svgEl('circle', { cx: cx, cy: y, r: 8.5, fill: col.stroke });
      svg.appendChild(num);
      var nt2 = svgEl('text', { x: cx, y: y + 4, 'text-anchor': 'middle', fill: '#fff', 'font-size': 10, 'font-weight': 700 });
      nt2.textContent = (si + 1);
      svg.appendChild(nt2);

      // Label above arrow
      var midX = (nodeX1 + nodeX2) / 2;
      var lt2 = svgEl('text', { x: midX, y: y - 5, 'text-anchor': 'middle', fill: '#334155' });
      lt2.textContent = s.label || '';
      svg.appendChild(lt2);

      // Optional sub-label below
      if (s.detail) {
        var dt = svgEl('text', { x: midX, y: y + 14, 'text-anchor': 'middle', fill: '#64748b', 'font-size': 11 });
        dt.textContent = s.detail;
        svg.appendChild(dt);
      }

      // Tag for async
      if (s.style === 'async') {
        var tagX = toX + dir * 8;
        var tag = svgEl('text', { x: tagX, y: y - 5, 'text-anchor': dir > 0 ? 'start' : 'end', fill: col.stroke, 'font-size': 11, 'font-style': 'italic' });
        tag.textContent = '(async)';
        svg.appendChild(tag);
      }
    });

    return svg;
  }

  function init() {
    var els = document.querySelectorAll('[data-flow]');
    els.forEach(function(el) {
      var raw = el.getAttribute('data-flow');
      var spec;
      try { spec = JSON.parse(raw); }
      catch (e) {
        el.textContent = '[invalid data-flow JSON]';
        return;
      }
      var svg = renderDiagram(spec);
      el.innerHTML = '';
      el.appendChild(svg);
      el.classList.add('flow-diagram-rendered');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
