async function loadModelsAdmin() {
  const list = document.getElementById('modelsList');
  const models = await fetchModels();

  if (models.length === 0) {
    list.innerHTML = '<p style="color: #cbd5e1;">No models. Create one above!</p>';
    return;
  }

  list.innerHTML = models.map(m => `
    <div class="list-item">
      <div>
        <h4>${m.name}</h4>
        <p>${m.description || 'No description'}</p>
      </div>
      <button class="btn btn-delete" onclick="deleteModelAdmin('${m._id}')">🗑️ Delete</button>
    </div>
  `).join('');
}

async function deleteModelAdmin(id) {
  if (confirm('Delete this model?')) {
    await deleteModel(id);
    loadModelsAdmin();
  }
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const desc = document.getElementById('description').value;
  const url = document.getElementById('fileUrl').value;

  await addModel(name, desc, url);
  document.getElementById('addForm').reset();
  loadModelsAdmin();
  alert('✅ Model added!');
});

document.addEventListener('DOMContentLoaded', () => {
  loadModelsAdmin();
  setupDonateButton();
});