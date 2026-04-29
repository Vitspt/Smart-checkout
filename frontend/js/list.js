// ============================================
// SmartCheckout — Shopping List System
// ============================================
function getShoppingList(){ try{ return JSON.parse(localStorage.getItem('ssc_list')) || []; }catch(e){ return []; } }
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
