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

    function detectarVersiculos() {
        const content = document.querySelector('.content');
        const regex = /\b([A-ZÁÉÍÓÚ][a-záéíóú]+)\s(\d+):(\d+(-\d+)?)\b/g;
        
        content.innerHTML = content.innerHTML.replace(regex, (match, livro, capitulo, versiculo) => {
            const ref = `acf-${livro.toLowerCase().replace(/\s/g, '')}.xml`; // Ajuste no nome do arquivo
            return `<span class="versiculo" data-ref="${ref}" data-chapter="${capitulo}" data-verse="${versiculo}">${match}</span>`;
        });

        document.querySelectorAll('.versiculo').forEach(versiculo => {
            versiculo.addEventListener('click', async function (e) {
                const file = versiculo.getAttribute('data-ref');
                const chapter = versiculo.getAttribute('data-chapter');
                const verse = versiculo.getAttribute('data-verse');
                const url = `https://inovacaomab.github.io/bibliaACFestudo/acf/${file}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Erro ao acessar ${url}`);

                    const xmlText = await response.text();
                    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
                    
                    // Ajuste na busca dentro do XML
                    const chapterElement = xmlDoc.querySelector(`chapter[number="${chapter}"]`);
                    const verseElement = chapterElement ? chapterElement.querySelector(`verse[number="${verse}"]`) : null;
                    const verseText = verseElement ? verseElement.textContent : 'Versículo não encontrado.';

                    popupContent.innerHTML = `<strong>${versiculo.textContent}</strong><br>${verseText}`;
                    popup.style.display = 'block';
                    popup.style.left = `${e.pageX + 10}px`;
                    popup.style.top = `${e.pageY + 10}px`;
                } catch (error) {
                    popupContent.innerHTML = `Erro ao carregar o versículo: ${error.message}`;
                }
            });
        });
    }

    detectarVersiculos();

    document.addEventListener('click', function (e) {
        if (!popup.contains(e.target) && !e.target.classList.contains('versiculo')) {
            popup.style.display = 'none';
        }
    });
});
