function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();

    try {
        dataset.addColumn('1')
        dataset.addColumn('2')

        var retorno = new java.lang.Runtime.getRuntime().exec("cmd /c \"echo sc stop fluig > lista.bat && echo taskkill /f /im java* >> lista.bat && echo @timeout /t 10 /nobreak >> lista.bat &&  echo sc start fluig >> lista.bat\"");
        var retorno2 = new java.lang.Runtime.getRuntime().exec("cmd /c lista.bat");

        var DOC_ID = "OK";
        dataset.addRow([DOC_ID, String(retorno)]);
        dataset.addRow([DOC_ID, String(retorno2)]);

    } catch (e) {
        dataset = DatasetBuilder.newDataset();
        dataset.addColumn('1')
        dataset.addColumn('2')
        dataset.addRow([e.message, e.lineNumber]);
    }

    return dataset;
}