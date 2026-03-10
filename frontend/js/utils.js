const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : '/api';

function isPhone() {
  const userAgent = navigator.userAgent;
  const isAndroid = /Android.+Mobile/i.test(userAgent);
  const isIPhone = /iPhone/i.test(userAgent);
  return (isAndroid || isIPhone) && window.innerWidth < 768;
}

function setupDonateButton() {
  const btn = document.getElementById('donateBtn');
  if (btn) {
    btn.onclick = () => {
      const upiId = '9656406283@fam';
      const upiName = 'ADWAITH R';
      
      if (isPhone()) {
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`;
        window.location.href = upiLink;
      } else {
        alert('📱 Donations via UPI are available on mobile. Please use your mobile phone!');
      }
    };
  }
}

async function fetchModels() {
  try {
    const res = await fetch(`${API_BASE}/models`);
    return await res.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function addModel(name, description, fileUrl) {
  const res = await fetch(`${API_BASE}/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, fileUrl })
  });
  return await res.json();
}

async function deleteModel(id) {
  return await fetch(`${API_BASE}/models/${id}`, { method: 'DELETE' });
}

function downloadModel(fileUrl, name) {
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = `${name}.glb`;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}