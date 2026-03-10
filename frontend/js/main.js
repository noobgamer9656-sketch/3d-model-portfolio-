async function loadModels() {
  const grid = document.getElementById('modelsGrid');
  const models = await fetchModels();

  if (models.length === 0) {
    grid.innerHTML = '<p style="color: #cbd5e1;">No models yet. Visit admin to add!</p>';
    return;
  }

  grid.innerHTML = models.map(m => `
    <div class="model-card">
      <model-viewer 
        src="${m.fileUrl}" 
        alt="${m.name}"
        auto-rotate 
        camera-controls
        ar
      ></model-viewer>
      <div class="model-info">
        <h3>${m.name}</h3>
        <p>${m.description || 'No description'}</p>
        <div class="model-actions">
          <button class="btn btn-download" onclick="downloadModel('${m.fileUrl}', '${m.name}')">⬇️ Download</button>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadModels();
  setupDonateButton();
});