document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');

    // Mapeamento dos nomes dos livros bíblicos para os arquivos XML
    const bookMapping = {
        'gênesis': 'ge', 'êxodo': 'ex', 'levítico': 'lv', 'números': 'nu', 'deuteronômio': 'dt',
        'josué': 'js', 'juízes': 'jz', 'rute': 'rt', '1 samuel': '1sm', '2 samuel': '2sm',
        '1 reis': '1rs', '2 reis': '2rs', '1 crônicas': '1cr', '2 crônicas': '2cr',
        'esdras': 'ed', 'neemias': 'ne', 'ester': 'et', 'jó': 'jo', 'salmos': 'sl',
        'provérbios': 'pv', 'eclesiastes': 'ec', 'cantares': 'ct', 'isaías': 'is',
        'jeremias': 'jr', 'lamentações': 'lm', 'ezequiel': 'ez', 'daniel': 'dn',
        'oséias': 'os', 'joel': 'jl', 'amós': 'am', 'obadias': 'ob', 'jonas': 'jn',
        'miquéias': 'mq', 'naum': 'na', 'habacuque': 'hc', 'sofonias': 'sf',
        'ageu': 'ag', 'zacarias': 'zc', 'malaquias': 'ml',
        'mateus': 'mt', 'marcos': 'mc', 'lucas': 'lc', 'joão': 'jo',
        'atos': 'at', 'romanos': 'rm', '1 coríntios': '1co', '2 coríntios': '2co',
        'gálatas': 'gl', 'efésios': 'ef', 'filipenses': 'fp', 'colossenses': 'cl',
        '1 tessalonicenses': '1ts', '2 tessalonicenses': '2ts', '1 timóteo': '1tm',
        '2 timóteo': '2tm', 'tito': 'tt', 'filemom': 'fm', 'hebreus': 'hb',
        'tiago': 'tg', '1 pedro': '1pe', '2 pedro': '2pe', '1 joão': '1jo',
        '2 joão': '2jo', '3 joão': '3jo', 'judas': 'jd', 'apocalipse': 'ap'
    };

    function detectarVersiculos() {
        const content = document.querySelector('.content');
        // Regex melhorada para capturar referências bíblicas incluindo números ordinais
        const regex = /\b((?:\d+\s+)?[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][a-záéíóúâêîôûãõç]+(?:\s+[a-záéíóúâêîôûãõç]+)*)\s+(\d+):(\d+(?:-\d+)?)\b/g;
        
        content.innerHTML = content.innerHTML.replace(regex, (match, livro, capitulo, versiculo) => {
            const livroLower = livro.toLowerCase().trim();
            const bookCode = bookMapping[livroLower];
            
            if (bookCode) {
                return `<span class="versiculo" data-book="${bookCode}" data-chapter="${capitulo}" data-verse="${versiculo}" data-original="${match}">${match}</span>`;
            }
            return match; // Se não encontrou o livro, retorna o texto original
        });

        // Adiciona event listeners aos versículos encontrados
        document.querySelectorAll('.versiculo').forEach(versiculo => {
            versiculo.addEventListener('click', async function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                const bookCode = versiculo.getAttribute('data-book');
                const chapter = versiculo.getAttribute('data-chapter');
                const verse = versiculo.getAttribute('data-verse');
                const originalText = versiculo.getAttribute('data-original');
                
                // Mostra loading
                popupContent.innerHTML = '<div class="loading">Carregando versículo...</div>';
                popup.style.display = 'block';
                positionPopup(e);
                
                const url = `https://inovacaomab.github.io/bibliaACFestudo/acf/acf-${bookCode}.xml`;
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }
                    
                    const xmlText = await response.text();
                    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
                    
                    // Verifica se houve erro no parsing do XML
                    const parserError = xmlDoc.querySelector("parsererror");
                    if (parserError) {
                        throw new Error('Erro ao analisar XML');
                    }
                    
                    let verseText = 'Versículo não encontrado.';
                    
                    // Procura o capítulo e versículo
                    const chapters = xmlDoc.querySelectorAll('chapter');
                    for (let chapterElement of chapters) {
                        if (chapterElement.getAttribute('number') === chapter) {
                            // Trata range de versículos (ex: 22-24)
                            if (verse.includes('-')) {
                                const [startVerse, endVerse] = verse.split('-');
                                let verses = [];
                                for (let v = parseInt(startVerse); v <= parseInt(endVerse); v++) {
                                    const verseElement = chapterElement.querySelector(`verse[number="${v}"]`);
                                    if (verseElement) {
                                        verses.push(`${v} ${verseElement.textContent.trim()}`);
                                    }
                                }
                                if (verses.length > 0) {
                                    verseText = verses.join('<br>');
                                }
                            } else {
                                const verseElement = chapterElement.querySelector(`verse[number="${verse}"]`);
                                if (verseElement) {
                                    verseText = verseElement.textContent.trim();
                                }
                            }
                            break;
                        }
                    }
                    
                    popupContent.innerHTML = `<strong>${originalText}</strong><br><br>${verseText}`;
                    
                } catch (error) {
                    console.error('Erro ao carregar versículo:', error);
                    popupContent.innerHTML = `<div class="error">Erro ao carregar o versículo.<br>Detalhes: ${error.message}</div>`;
                }
            });
        });
    }

    function positionPopup(e) {
        const popupWidth = popup.offsetWidth || 350;
        const popupHeight = popup.offsetHeight || 200;
        
        let left = e.pageX + 10;
        let top = e.pageY + 10;

        // Ajusta posição se sair da tela
        if (left + popupWidth > window.innerWidth + window.scrollX) {
            left = e.pageX - popupWidth - 10;
        }
        if (top + popupHeight > window.innerHeight + window.scrollY) {
            top = e.pageY - popupHeight - 10;
        }

        // Garante que não saia da tela
        left = Math.max(10, left);
        top = Math.max(10, top);

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    // Inicializa a detecção de versículos
    detectarVersiculos();

    // Event listener para fechar popup
    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Fecha popup ao clicar fora dele
    document.addEventListener('click', function (e) {
        if (!popup.contains(e.target) && !e.target.classList.contains('versiculo')) {
            popup.style.display = 'none';
        }
    });

    // Fecha popup com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popup.style.display = 'none';
        }
    });
});
