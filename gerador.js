document.getElementById('gerar').onclick = function() {
    const tituloBruto = document.getElementById('titulo').value.trim();
    const titulo = tituloBruto.length > 0 ? tituloBruto : 'Documento Scriptagger';
    const entrada = document.getElementById('conteudo').value;

    // Regex para detectar referências no formato (Mateus 10:22)
    const referenciaRegex = /\(([A-Za-zçãéíõôúêâÁÉÍÓÔÚÊÂ]{2,})\s+(\d+):(\d+)\)/g;

    // Função para mapear nomes para arquivos XML
    function livroParaArquivo(livro) {
        const map = {
            'Mateus': 'acf-mt.xml',
            'João': 'acf-jo.xml',
            // Adicione outros livros conforme necessário!
        };
        return map[livro] || 'acf-mt.xml';
    }

    let conteudoFormatado = entrada.replace(referenciaRegex, (match, livro, cap, vers) => {
        const arquivo = livroParaArquivo(livro);
        return `<span class="versiculo" data-ref="${arquivo}" data-chapter="${cap}" data-verse="${vers}">${livro} ${cap}:${vers}</span>`;
    });

    const htmlFinal = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <h1>${titulo}</h1>
        ${conteudoFormatado}
    </div>
    <div id="popup" class="popup">
        <div class="popup-header">
            <span>Texto citado</span>
            <button id="closePopup">X</button>
        </div>
        <div class="popup-content" id="popupContent"></div>
        <div class="popup-footer">
            Versão ACF - Uso Autorizado pela SBTB
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
    `.trim();

    // Gera nome do arquivo limpo (sem acentos e espaços viram "_")
    const nomeArquivo = 
        (tituloBruto.length > 0 ? 
            tituloBruto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
            : 'documento_scriptagger'
        ) + '.html';

    const blob = new Blob([htmlFinal], {type: "text/html"});
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('baixar');
    link.href = url;
    link.style.display = 'inline-block';
    link.textContent = 'Baixar HTML';
    link.setAttribute('download', nomeArquivo);
};
