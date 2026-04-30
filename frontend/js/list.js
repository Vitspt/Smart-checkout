// ============================================
// SmartCheckout — Shopping List System
// ============================================
function getShoppingList(){ 
  try{ 
    const l = JSON.parse(localStorage.getItem('ssc_list'));
    if(!l || l.length === 0) {
      // Initialize with user requested categories
      const defaults = [
        { name: 'Dairy Milk Silk', found: false, id: 1 },
        { name: 'Fresh Banana', found: false, id: 2 },
        { name: 'Fortune Sunflower Oil', found: false, id: 3 },
        { name: 'Fresh Tomato', found: false, id: 4 },
        { name: 'Coca-Cola 750ml', found: false, id: 5 }
      ];
      localStorage.setItem('ssc_list', JSON.stringify(defaults));
      return defaults;
    }
    return l;
  } catch(e){ return []; } 
}
function saveShoppingList(l){ localStorage.setItem('ssc_list', JSON.stringify(l)); }

function addToList(name){
  const l = getShoppingList();
  l.push({ name, found: false, id: Date.now() });
  saveShoppingList(l);
}

function removeFromList(id){
  saveShoppingList(getShoppingList().filter(i => i.id !== id));
}

function toggleListFound(id, found){
  const l = getShoppingList();
  const idx = l.findIndex(i => i.id === id);
  if(idx >= 0){
    l[idx].found = found;
    saveShoppingList(l);
  }
}

function checkListAuto(scannedProductName){
  const l = getShoppingList();
  let updated = false;
  l.forEach(i => {
    if(!i.found && scannedProductName.toLowerCase().includes(i.name.toLowerCase())){
      i.found = true;
      updated = true;
    }
  });
  if(updated) saveShoppingList(l);
}
