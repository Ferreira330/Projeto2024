function addCasa() {
    const casasDiv = document.getElementById('casas');
    const casaIndex = casasDiv.querySelectorAll('.casa-entry').length; 

    const novaCasaDiv = document.createElement('div');
    novaCasaDiv.classList.add('w3-section', 'casa-entry');
    novaCasaDiv.innerHTML = `
      <div class="w3-card w3-round w3-white w3-margin-bottom">
        <div class="w3-container">
          <label for="casas[${casaIndex}][número]">Número da Casa:</label>
          <input type="number" id="casas[${casaIndex}][número]" name="casas[${casaIndex}][número]" class="w3-input w3-border">

          <label for="casas[${casaIndex}][enfiteuta]">Enfiteuta:</label>
          <input type="text" id="casas[${casaIndex}][enfiteuta]" name="casas[${casaIndex}][enfiteuta]" class="w3-input w3-border">

          <label for="casas[${casaIndex}][foro]">Foro:</label>
          <input type="text" id="casas[${casaIndex}][foro]" name="casas[${casaIndex}][foro]" class="w3-input w3-border">

          <label for="casas[${casaIndex}][desc]">Descrição:</label>
          <textarea id="casas[${casaIndex}][desc]" name="casas[${casaIndex}][desc]" class="w3-input w3-border"></textarea>

          <button type="button" class="w3-button w3-red w3-small" onclick="removeCasa(this)">Remover</button>
        </div>
      </div>
    `;
    casasDiv.appendChild(novaCasaDiv);
}

function removeCasa(buttonElement) {
    const casaEntry = buttonElement.closest('.casa-entry');
    casaEntry.remove();
}

function addImageInput() {
    const newImagesSection = document.getElementById('newImagesSection');
    const imageIndex = newImagesSection.querySelectorAll('.new-image-input').length;
  
    const newImageDiv = document.createElement('div');
    newImageDiv.classList.add('w3-section', 'new-image-input');
    newImageDiv.innerHTML = `
      <label for='newImage_${imageIndex}'>Image:</label>
      <input type='file' id='newImage_${imageIndex}' name='figuras' accept='image/*' class='w3-input w3-border'>
    `;
  
    newImagesSection.appendChild(newImageDiv);
  }

function removeImage(imageURL, buttonElement) {
    if (confirm("Tem a certeza que deseja remover esta imagem? Esta ação não pode ser desfeita.")) {
        // 1. Send a request to the server to remove the image
        const url = window.location.href + `/remove-image/${imageURL}`;
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // 2. Remove the image from the page
                buttonElement.parentNode.remove();
            })
            .catch(error => console.error(error));
    }
}