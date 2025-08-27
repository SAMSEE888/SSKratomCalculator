// SS789 • Keep original calculation logic intact
document.addEventListener('DOMContentLoaded', function() {
  const leafInput = document.getElementById('leafInput');
  const waterInput = document.getElementById('waterInput');
  const yieldInput = document.getElementById('yieldInput');
  const calculateButton = document.getElementById('calculateButton');
  const resetButton = document.getElementById('resetButton');
  const resultContainer = document.getElementById('resultContainer');

  const resultGroundLeaf = document.getElementById('resultGroundLeaf');
  const resultGroundWater = document.getElementById('resultGroundWater');
  const resultGroundYield = document.getElementById('resultGroundYield');

  const resultNotGroundLeaf1 = document.getElementById('resultNotGroundLeaf1');
  const resultNotGroundWater1 = document.getElementById('resultNotGroundWater1');
  const resultNotGroundYield1 = document.getElementById('resultNotGroundYield1');

  const resultNotGroundLeaf2 = document.getElementById('resultNotGroundLeaf2');
  const resultNotGroundWater2 = document.getElementById('resultNotGroundWater2');
  const resultNotGroundYield2 = document.getElementById('resultNotGroundYield2');

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Progressive Web App: install prompt handling
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
  });
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }

  // Press Enter to calculate
  document.getElementById('calcForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateButton.click();
    }
  });

  calculateButton.addEventListener('click', function() {
    const leaf = parseFloat(leafInput.value) || 0;
    const water = parseFloat(waterInput.value) || 0;
    const yieldDesired = parseFloat(yieldInput.value) || 0;

    if (leaf < 0 || water < 0 || yieldDesired < 0) {
      alert('⚠️ กรุณากรอกค่าที่เป็นบวกเท่านั้น!');
      return;
    }

    let groundLeaf = 0, groundWater = 0, groundYield = 0;
    let notGroundLeaf1 = 0, notGroundWater1 = 0, notGroundYield1 = 0;
    let notGroundLeaf2 = 0, notGroundWater2 = 0, notGroundYield2 = 0;

    // อัตราส่วนสำหรับวิธีบด
    const groundRatioLeafToWater = 20; // กก. ใบ : ลิตร น้ำ
    const groundRatioWaterToYield = 15 / 20; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ

    // อัตราส่วนสำหรับวิธีไม่บด ( # 0.65 # )
    const notGroundRatioLeafToWater1 = 15.38; // กก. ใบ : ลิตร น้ำ
    const notGroundRatioWaterToYield1 = 12 / 15.38; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ

    // อัตราส่วนสำหรับวิธีไม่บด ( # 0.63 # )
    const notGroundRatioLeafToWater2 = 15.873; // กก. ใบ : ลิตร น้ำ
    const notGroundRatioWaterToYield2 = 12 / 15.873; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ

    if (leaf > 0) {
      groundLeaf = leaf;
      groundWater = leaf * groundRatioLeafToWater;
      groundYield = groundWater * groundRatioWaterToYield;

      notGroundLeaf1 = leaf;
      notGroundWater1 = leaf * notGroundRatioLeafToWater1;
      notGroundYield1 = notGroundWater1 * notGroundRatioWaterToYield1;

      notGroundLeaf2 = leaf;
      notGroundWater2 = leaf * notGroundRatioLeafToWater2;
      notGroundYield2 = notGroundWater2 * notGroundRatioWaterToYield2;

    } else if (water > 0) {
      groundWater = water;
      groundLeaf = water / groundRatioLeafToWater;
      groundYield = water * groundRatioWaterToYield;

      notGroundWater1 = water;
      notGroundLeaf1 = water / notGroundRatioLeafToWater1;
      notGroundYield1 = water * notGroundRatioWaterToYield1;

      notGroundWater2 = water;
      notGroundLeaf2 = water / notGroundRatioLeafToWater2;
      notGroundYield2 = water * notGroundRatioWaterToYield2;

    } else if (yieldDesired > 0) {
      groundYield = yieldDesired;
      groundWater = yieldDesired / groundRatioWaterToYield;
      groundLeaf = groundWater / groundRatioLeafToWater;

      notGroundYield1 = yieldDesired;
      notGroundWater1 = yieldDesired / notGroundRatioWaterToYield1;
      notGroundLeaf1 = notGroundWater1 / notGroundRatioLeafToWater1;

      notGroundYield2 = yieldDesired;
      notGroundWater2 = yieldDesired / notGroundRatioWaterToYield2;
      notGroundLeaf2 = notGroundWater2 / notGroundRatioLeafToWater2;

    } else {
      alert('⚠️ กรุณากรอกค่าข้อมูลอย่างน้อยหนึ่งช่อง!');
      return;
    }

    resultGroundLeaf.textContent = `ใบกระท่อม: ${groundLeaf.toFixed(2)} กก.`;
    resultGroundWater.textContent = `น้ำ: ${groundWater.toFixed(2)} ลิตร`;
    resultGroundYield.textContent = `น้ำกระท่อมดิบ: ${groundYield.toFixed(2)} ลิตร`;

    resultNotGroundLeaf1.textContent = `ใบกระท่อม: ${notGroundLeaf1.toFixed(2)} กก.`;
    resultNotGroundWater1.textContent = `น้ำ: ${notGroundWater1.toFixed(2)} ลิตร`;
    resultNotGroundYield1.textContent = `น้ำกระท่อมดิบ: ${notGroundYield1.toFixed(2)} ลิตร`;

    resultNotGroundLeaf2.textContent = `ใบกระท่อม: ${notGroundLeaf2.toFixed(2)} กก.`;
    resultNotGroundWater2.textContent = `น้ำ: ${notGroundWater2.toFixed(2)} ลิตร`;
    resultNotGroundYield2.textContent = `น้ำกระท่อมดิบ: ${notGroundYield2.toFixed(2)} ลิตร`;

    resultContainer.classList.add('show');
  });

  resetButton.addEventListener('click', function() {
    leafInput.value = '';
    waterInput.value = '';
    yieldInput.value = '';
    resultContainer.classList.remove('show');
  });
});
