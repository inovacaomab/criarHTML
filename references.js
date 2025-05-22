document.addEventListener('DOMContentLoaded', function () {
    // Criando o pop-up dinamicamente
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
    popupHeader.style.display = 'flex';
    popupHeader.style.justifyContent = 'space-between';
    popupHeader.style.alignItems = 'center';
    popupHeader.style.backgroundColor = '#f0f0f0';
    popupHeader.style.padding = '5px 10px';
    popupHeader.style.fontWeight = 'bold';
    popupHeader.textContent = 'Texto citado';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => popup.style.display = 'none');
    popupHeader.appendChild(closeButton);
    popup.appendChild(popupHeader);

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.style.padding = '10px';
    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    function detectarVersiculos() {
        const content = document.querySelector('.content');
        const regex = /\b([A-ZÁÉÍÓÚ][a-záéíóú]+)\s(\d+):(\d+(-\d+)?)\b/g;

        content.innerHTML = content.innerHTML.replace(regex, (match, livro, capitulo, versiculo) => {
            const ref = `acf-${livro.toLowerCase().replace(/\s/g, '')}.xml`;
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

                    // Correção: buscar o capítulo e versículo corretamente
                    const chapters = xmlDoc.querySelectorAll('chapter');
                    let verseText = 'Versículo não encontrado.';

                    chapters.forEach(chapterElement => {
                        if (chapterElement.getAttribute('number') === chapter) {
                            const verseElement = chapterElement.querySelector(`verse[number="${verse}"]`);
                            if (verseElement) {
                                verseText = verseElement.textContent;
                            }
                        }
                    });

                    popupContent.innerHTML = `<strong>${versiculo.textContent}</strong><br>${verseText}`;
                    popup.style.display = 'block';
                    const popupWidth = popup.offsetWidth;
                    const popupHeight = popup.offsetHeight;
                    let left = e.pageX + 10;
                    let top = e.pageY + 10;

                    if (left + popupWidth > window.innerWidth) {
                        left = window.innerWidth - popupWidth - 10;
                    }
                    if (top + popupHeight > window.innerHeight) {
                        top = window.innerHeight - popupHeight - 10;
                    }

                    popup.style.left = `${left}px`;
                    popup.style.top = `${top}px`;
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
