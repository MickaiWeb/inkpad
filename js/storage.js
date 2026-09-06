window.InkStorage = (() => {
  const key = 'inkpad-data-v1';
  const starter = { folders: [], notebooks: [{ id: 'starter', name: 'My First Notebook', color: '#8b7cf6', pages: [{ id: 'page-1', name: 'Welcome Page', text: '' }] }], calendar: {} };
  function load() { try { const saved = JSON.parse(localStorage.getItem(key)) || structuredClone(starter); if (!Array.isArray(saved.folders)) saved.folders = []; saved.notebooks.forEach(notebook => { if (!Object.prototype.hasOwnProperty.call(notebook, 'folderId')) notebook.folderId = null; }); return saved; } catch (error) { return JSON.parse(JSON.stringify(starter)); } }
  let data = load();
  function save() { localStorage.setItem(key, JSON.stringify(data)); document.dispatchEvent(new CustomEvent('inkpad:saved')); }
  return { get data() { return data; }, save, reset() { data = JSON.parse(JSON.stringify(starter)); save(); }, export() { return JSON.stringify(data, null, 2); }, import(value) { data = JSON.parse(value); save(); } };
})();
