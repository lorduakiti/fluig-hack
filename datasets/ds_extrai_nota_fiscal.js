function createDataset(fields, constraints, sortFields) {
    var codigoDocumento = null;

    for (var i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == "codigoDocumento") {
            codigoDocumento = constraints[i].initialValue;
        }
    }

    if (codigoDocumento == null) {
        throw 'O parâmetro codigoDocumento deve ser informado.';
    }

    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn('Numero');
    dataset.addColumn('Competencia');
    dataset.addColumn('Valor');
    dataset.addColumn('CNPJ');

    try {
        var dto = docAPI.getDocumentVersion(parseInt(codigoDocumento), 1000);

        var documentProvider = ServiceManager.getServiceInstance('ECMDocumentService');
        var serviceLocator = documentProvider.instantiate('com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService');
        var documentService = serviceLocator.getDocumentServicePort();

        var connector = DatasetFactory.getDataset('dsConnector', null, null, null);

        var result = documentService.getDocumentContent(
            connector.getValue(0, 'fUser'),
            connector.getValue(0, 'fSenha'),
            1,
            parseInt(dto.getDocumentId()),
            getValue('WKUser'),
            1000,
            dto.getPhisicalFile()
        );

        var xmlString = '';
        for (var i = 0; i < result.length; ++i) { xmlString += (String.fromCharCode(result[i])); }

        xmlString = removerInformacoesDesnecessarias(xmlString);

        var xml = new XML(xmlString);

        var competencia = String(xml.Nfse.InfNfse.Competencia);
        var dtCompetencia = new Date(competencia.substr(0, 4), competencia.substr(5, 2), competencia.substr(8, 2));

        dataset.addRow([
            String(xml.Nfse.InfNfse.Numero),
            ('0' + dtCompetencia.getDate()).slice(-2) + '/' + ('0' + dtCompetencia.getMonth()).slice(-2) + '/' + dtCompetencia.getFullYear(),
            convertFloat(String(xml.Nfse.InfNfse.Servico.Valores.ValorServicos)),
            String(xml.Nfse.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj)
        ]);

    } catch (e) {
        log.error("--Debug--: Problemas na extração do documento:\n" + e);

        throw e.message;
    }


    return dataset;

}

function convertFloat(number) {
    if (number == undefined) return '';

    number = parseFloat(number).toFixed(2);

    return number.replace('.', ',');
}

/* 
* Removendo informacoes desnecessarias seguindo a documentação 
* https://tdn.totvs.com/pages/releaseview.action?pageId=152798259 
*/
function removerInformacoesDesnecessarias(xmlString) {
    // Removendo <?xml 
    while (xmlString.indexOf("<?") > -1) {
        var auxStr = xmlString.substr(xmlString.indexOf("<?"), xmlString.indexOf("?>") + 2);

        xmlString = xmlString.replace(auxStr, '');
    }

    // Removendo <!-- 
    while (xmlString.indexOf("<!") > -1) {
        var auxStr = xmlString.substr(xmlString.indexOf("<!--"), xmlString.indexOf("-->") + 3);

        xmlString = xmlString.replace(auxStr, '');
    }

    // Removendo namespaces do XML
    return xmlString.replace(/\s\w*=\"(.*?)\"/g, '');
}