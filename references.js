document.addEventListener('DOMContentLoaded', function () {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'absolute';
    popup.style.display = 'none';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
    popup.style.zIndex = '1000';
    popup.style.width = '350px';
    popup.style.borderRadius = '5px';

    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';
    popupHeader.textContent = 'Texto citado';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => popup.style.display = 'none');
    popupHeader.appendChild(closeButton);
    popup.appendChild(popupHeader);

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popup.appendChild(popupContent);

    document.body.appendChild(popup);

    function detectarVersiculos(texto) {
        const regex = /\b([A-ZÁÉÍÓÚ][a-záéíóú]+)\s(\d+):(\d+(-\d+)?)\b/g;
        return texto.replace(regex, (match, livro, capitulo, versiculo) => {
            const ref = `acf-${livro.toLowerCase().slice(0,2)}.xml`;
            return `<span class="versiculo" data-ref="${ref}" data-chapter="${capitulo}" data-verse="${versiculo}">${match}</span>`;
        });
    }

    const content = document.querySelector('.content');
    content.innerHTML = detectarVersiculos(content.innerHTML);

    document.querySelectorAll('.versiculo').forEach(versiculo => {
        versiculo.addEventListener('click', async function (e) {
            const file = versiculo.getAttribute('data-ref');
            const chapter = versiculo.getAttribute('data-chapter');
            const verse = versiculo.getAttribute('data-verse');
            const url = `https://inovacaomab.github.io/bibliaACFestudo/acf/${file}`;

            try {
                const response = await fetch(url);
                const xmlText = await response.text();
                const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
                const verseText = xmlDoc.querySelector(`chapter[number="${chapter}"] verse[number="${verse}"]`)?.textContent || 'Versículo não encontrado.';
                popupContent.innerHTML = `<strong>${versiculo.textContent}</strong><br>${verseText}`;
                popup.style.display = 'block';
                popup.style.left = `${e.pageX + 10}px`;
                popup.style.top = `${e.pageY + 10}px`;
            } catch {
                popupContent.innerHTML = 'Erro ao carregar o versículo.';
            }
        });
    });
});
