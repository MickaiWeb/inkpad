window.InkCanvas = (() => {
  function setup(canvas, onChange) {
    const context = canvas.getContext('2d');
    const history = [], future = [];
    let drawing = false; let tool = 'pen'; let color = '#7c6ef0'; let size = 3;
    function resize() { const ratio = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect(); const image = canvas.width ? canvas.toDataURL() : null; canvas.width = Math.max(1, rect.width * ratio); canvas.height = Math.max(1, rect.height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0); if (image) { const restored = new Image(); restored.onload = () => context.drawImage(restored, 0, 0, rect.width, rect.height); restored.src = image; } }
    function point(event) { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
    function snapshot() { history.push(canvas.toDataURL()); if (history.length > 30) history.shift(); future.length = 0; onChange?.(); }
    function start(event) { event.preventDefault(); snapshot(); drawing = true; canvas.setPointerCapture(event.pointerId); const p = point(event); context.beginPath(); context.moveTo(p.x, p.y); }
    function move(event) { if (!drawing) return; const p = point(event); context.lineTo(p.x, p.y); context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'; context.strokeStyle = color; context.lineWidth = tool === 'highlighter' ? size * 4 : size; context.globalAlpha = tool === 'highlighter' ? .3 : 1; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke(); }
    function end() { drawing = false; context.closePath(); context.globalAlpha = 1; context.globalCompositeOperation = 'source-over'; onChange?.(); }
    canvas.addEventListener('pointerdown', start); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end); window.addEventListener('resize', resize); resize();
    return { setTool(value) { tool = value; }, setColor(value) { color = value; }, setSize(value) { size = Number(value); }, resize, clear() { snapshot(); context.clearRect(0, 0, canvas.width, canvas.height); onChange?.(); }, reset() { context.clearRect(0, 0, canvas.width, canvas.height); history.length = 0; future.length = 0; }, undo() { const previous = history.pop(); if (!previous) return; future.push(canvas.toDataURL()); restore(previous); onChange?.(); }, redo() { const next = future.pop(); if (!next) return; history.push(canvas.toDataURL()); restore(next); onChange?.(); }, canUndo() { return history.length > 0; }, canRedo() { return future.length > 0; }, toDataUrl() { return canvas.toDataURL(); }, restore };
    function restore(source) { const image = new Image(); image.onload = () => { context.clearRect(0, 0, canvas.width, canvas.height); const rect = canvas.getBoundingClientRect(); context.drawImage(image, 0, 0, rect.width, rect.height); onChange?.(); }; image.src = source; }
  }
  return { setup };
})();
