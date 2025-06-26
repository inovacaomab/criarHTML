document.getElementById('gerar').onclick = function() {
    const tituloBruto = document.getElementById('titulo').value.trim();
    const titulo = tituloBruto.length > 0 ? tituloBruto : 'Documento Scriptagger';
    const entrada = document.getElementById('conteudo').value;

    // Regex para detectar referências no formato (Mateus 10:22)
    const referenciaRegex = /\(([A-Za-zçãéíõôúêâÁÉÍÓÔÚÊÂ]{2,})\s+(\d+):(\d+)\)/g;

    // Função para mapear nomes para arquivos XML
    function livroParaArquivo(livro) {
    const map = {
        'Gênesis': 'acf-gn.xml',
        'Êxodo': 'acf-ex.xml',
        'Levítico': 'acf-lv.xml',
        'Números': 'acf-nm.xml',
        'Deuteronômio': 'acf-dt.xml',
        'Josué': 'acf-js.xml',
        'Juízes': 'acf-jz.xml',
        'Rute': 'acf-rt.xml',
        '1 Samuel': 'acf-1sm.xml',
        '2 Samuel': 'acf-2sm.xml',
        '1 Reis': 'acf-1rs.xml',
        '2 Reis': 'acf-2rs.xml',
        '1 Crônicas': 'acf-1cr.xml',
        '2 Crônicas': 'acf-2cr.xml',
        'Esdras': 'acf-ed.xml',
        'Neemias': 'acf-ne.xml',
        'Ester': 'acf-et.xml',
        'Jó': 'acf-job.xml',
        'Salmos': 'acf-sl.xml',
        'Provérbios': 'acf-pv.xml',
        'Eclesiastes': 'acf-ec.xml',
        'Cânticos': 'acf-ct.xml',
        'Isaías': 'acf-is.xml',
        'Jeremias': 'acf-jr.xml',
        'Lamentações': 'acf-lm.xml',
        'Ezequiel': 'acf-ez.xml',
        'Daniel': 'acf-dn.xml',
        'Oséias': 'acf-os.xml',
        'Joel': 'acf-jl.xml',
        'Amós': 'acf-am.xml',
        'Obadias': 'acf-ob.xml',
        'Jonas': 'acf-jn.xml',
        'Miquéias': 'acf-mq.xml',
        'Naum': 'acf-na.xml',
        'Habacuque': 'acf-hc.xml',
        'Sofonias': 'acf-sf.xml',
        'Ageu': 'acf-ag.xml',
        'Zacarias': 'acf-zc.xml',
        'Malaquias': 'acf-ml.xml',
        'Mateus': 'acf-mt.xml',
        'Marcos': 'acf-mc.xml',
        'Lucas': 'acf-lc.xml',
        'João': 'acf-jo.xml',
        'Atos': 'acf-at.xml',
        'Romanos': 'acf-rm.xml',
        '1 Coríntios': 'acf-1co.xml',
        '2 Coríntios': 'acf-2co.xml',
        'Gálatas': 'acf-gl.xml',
        'Efésios': 'acf-ef.xml',
        'Filipenses': 'acf-fp.xml',
        'Colossenses': 'acf-cl.xml',
        '1 Tessalonicenses': 'acf-1ts.xml',
        '2 Tessalonicenses': 'acf-2ts.xml',
        '1 Timóteo': 'acf-1tm.xml',
        '2 Timóteo': 'acf-2tm.xml',
        'Tito': 'acf-tt.xml',
        'Filemom': 'acf-fm.xml',
        'Hebreus': 'acf-hb.xml',
        'Tiago': 'acf-tg.xml',
        '1 Pedro': 'acf-1pe.xml',
        '2 Pedro': 'acf-2pe.xml',
        '1 João': 'acf-1jo.xml',
        '2 João': 'acf-2jo.xml',
        '3 João': 'acf-3jo.xml',
        'Judas': 'acf-jd.xml',
        'Apocalipse': 'acf-ap.xml'
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
