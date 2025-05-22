document.addEventListener('DOMContentLoaded', function () {
    // Cria o elemento pop-up e suas partes
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

    // Cabeçalho do pop-up
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';
    popupHeader.style.display = 'flex';
    popupHeader.style.justifyContent = 'space-between';
    popupHeader.style.alignItems = 'center';
    popupHeader.style.backgroundColor = '#f0f0f0';
    popupHeader.style.borderBottom = '1px solid #ccc';
    popupHeader.style.padding = '5px 10px';
    popupHeader.style.fontWeight = 'bold';
    popupHeader.style.borderTopLeftRadius = '5px';
    popupHeader.style.borderTopRightRadius = '5px';
    popupHeader.textContent = 'Texto citado';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'black';
    closeButton.addEventListener('click', function () {
        popup.style.display = 'none';
    });
    closeButton.addEventListener('mouseover', function () {
        closeButton.style.color = 'red';
    });
    closeButton.addEventListener('mouseout', function () {
        closeButton.style.color = 'black';
    });
    popupHeader.appendChild(closeButton);
    popup.appendChild(popupHeader);

    // Conteúdo do pop-up
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.style.padding = '10px';
    popupContent.style.fontSize = '14px';
    popupContent.style.lineHeight = '1.6';
    popup.appendChild(popupContent);

    // Rodapé do pop-up
    const popupFooter = document.createElement('div');
    popupFooter.className = 'popup-footer';
    popupFooter.style.backgroundColor = '#f0f0f0';
    popupFooter.style.borderTop = '1px solid #ccc';
    popupFooter.style.textAlign = 'center';
    popupFooter.style.padding = '5px';
    popupFooter.style.fontSize = '12px';
    popupFooter.style.borderBottomLeftRadius = '5px';
    popupFooter.style.borderBottomRightRadius = '5px';
    popupFooter.textContent = 'Versão ACF';
    popup.appendChild(popupFooter);

    document.body.appendChild(popup);

    // Adiciona os eventos às referências bíblicas
    document.querySelectorAll('.versiculo').forEach(function (versiculo) {
        versiculo.addEventListener('mouseover', async function (e) {
            const file = versiculo.getAttribute('data-ref');
            const chapter = versiculo.getAttribute('data-chapter');
            const verse = versiculo.getAttribute('data-verse');
            const reference = versiculo.textContent; // Captura a referência completa
            const url = `https://inovacaomab.github.io/bibliaACFestudo/acf/${file}`;

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const xmlText = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    const chapterElement = xmlDoc.querySelector(`chapter[number="${chapter}"]`);
                    const verseElement = chapterElement?.querySelector(`verse[number="${verse}"]`);
                    const verseText = verseElement?.textContent || 'Versículo não encontrado.';
                    popupContent.innerHTML = `
                        <span style="font-weight: bold; display: block; margin-bottom: 10px;">${reference}</span>
                        <span>${verseText}</span>
                    `;
                } else {
                    popupContent.textContent = `Erro ao acessar ${url}. Status: ${response.status}`;
                }
            } catch (error) {
                popupContent.textContent = 'Erro ao carregar o versículo.';
            }

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
        });
    });

    // Fecha o pop-up ao clicar fora dele
    document.addEventListener('click', function (e) {
        if (!popup.contains(e.target) && !e.target.classList.contains('versiculo')) {
            popup.style.display = 'none';
        }
    });
});
