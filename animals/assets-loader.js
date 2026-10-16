/* ══════════════════════════════════════════════════════════════
   📦 بارگذارنده فایل assets.json
   ══════════════════════════════════════════════════════════════ */

   let ASSETS = null;

   /* بارگذاری فایل assets.json */
   async function loadAssets() {
     if (ASSETS) return ASSETS;
     
     try {
       const response = await fetch('assets.json');
       if (!response.ok) throw new Error('فایل assets.json پیدا نشد');
       ASSETS = await response.json();
       console.log('✅ فایل assets.json بارگذاری شد:', ASSETS.animals.length, 'حیوان');
       return ASSETS;
     } catch (err) {
       console.error('❌ خطا در بارگذاری assets.json:', err);
       ASSETS = { animals: [], effects: {}, backgrounds: {} };
       return ASSETS;
     }
   }
   
   /* گرفتن مسیر تصویر یک حیوان */
   function getAnimalImage(id) {
     if (!ASSETS) return null;
     const animal = ASSETS.animals.find(a => a.id === id);
     return animal ? animal.image : null;
   }
   
   /* گرفتن مسیر صدای یک حیوان */
   function getAnimalSound(id) {
     if (!ASSETS) return null;
     const animal = ASSETS.animals.find(a => a.id === id);
     return animal ? animal.sound : null;
   }
   
   /* گرفتن اطلاعات کامل یک حیوان */
   function getAnimal(id) {
     if (!ASSETS) return null;
     return ASSETS.animals.find(a => a.id === id) || null;
   }
   
   /* گرفتن همه حیوانات یک دسته */
   function getAnimalsByType(type) {
     if (!ASSETS) return [];
     return ASSETS.animals.filter(a => a.type === type);
   }
   
   /* پخش صدا از فایل */
   function playSoundFile(path, volume = 1) {
     if (!path) return;
     try {
       const audio = new Audio(path);
       audio.volume = volume;
       audio.play().catch(err => console.warn('خطا در پخش صدا:', err));
     } catch (err) {
       console.warn('خطا:', err);
     }
   }
   
   /* پخش صدا اثر */
   function playEffect(effectName, volume = 1) {
     if (!ASSETS || !ASSETS.effects || !ASSETS.effects[effectName]) return;
     playSoundFile(ASSETS.effects[effectName], volume);
   }
   
   /* ⭐ تابع کمکی برای ساخت کارت تصویر حیوان */
   function createAnimalCard(animal, onClickCallback) {
     const card = document.createElement('div');
     card.className = 'option-card';
     card.dataset.animalId = animal.id;
     
     // اگر تصویر وجود داشت، آن را نمایش بده، وگرنه emoji
     let content = '';
     if (animal.image && animal.image.trim() !== '') {
       content = `
         <img src="${animal.image}" alt="${animal.name}" 
              style="width: 75%; height: 75%; object-fit: contain;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
         <div class="animal-emoji" style="display:none;">${animal.emoji}</div>
       `;
     } else {
       content = `<div class="animal-emoji">${animal.emoji}</div>`;
     }
     
     card.innerHTML = `
       ${content}
       <div class="animal-name">${animal.name}</div>
     `;
     
     if (onClickCallback) {
       card.addEventListener('click', () => onClickCallback(animal, card));
     }
     
     return card;
   }