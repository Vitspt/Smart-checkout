// ============================================
// SmartCheckout — Shopping List System
// ============================================
function getShoppingList(){ 
  try{ 
    let l = JSON.parse(localStorage.getItem(ukey('list'))) || [];
    // Clean up old default items if they exist (from previous session)
    if(l.length === 5 && l.some(i => i.name === 'Dairy Milk Silk') && l.some(i => i.name === 'Coca-Cola 750ml')){
      l = [];
      saveShoppingList(l);
    }
    return l;
  } catch(e){ return []; } 
}
function saveShoppingList(l){ localStorage.setItem(ukey('list'), JSON.stringify(l)); }

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
