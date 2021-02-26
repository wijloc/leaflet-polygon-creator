function deletePolygon(id) { 
    document.querySelector(`.deleteIcon_${id}`).style.display = 'none';
    document.querySelector(`.deleteConfirm_${id}`).style.display = 'flex';
    document.querySelector(`.deleteCancel_${id}`).style.display = 'flex';
}

function hideChoiceButtons(id){
  document.querySelector(`.deleteIcon_${id}`).style.display = 'flex';
  document.querySelector(`.deleteConfirm_${id}`).style.display = 'none';
  document.querySelector(`.deleteCancel_${id}`).style.display = 'none';
}

function deleteCancel(id) {   
  hideChoiceButtons(id);
}

function deleteConfirm(id){  
  hideChoiceButtons(id);
  window.location.href = `delete-polygon?id=${id}`;
}