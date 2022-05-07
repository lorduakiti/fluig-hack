//Você só precisa saber o caminho do arquio, que geralmente o próprio log te dá
//INSTALL_ROOT = C:\fluig\appserver
//JBOSS_SERVER_NAME = fluig1
function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();

    try {
        dataset.addColumn("ID");
        dataset.addColumn("RETORNO");

        var retorno = new java.nio.file.Path.of("C:\\fluig\\appserver\\domain\\servers\\fluig1\\log\\server.log");
        var retorno2 = new java.nio.file.Files.writeString(retorno, "");

        var DOC_ID = "OK";
        dataset.addRow([DOC_ID, String(retorno)]);
        dataset.addRow([DOC_ID, String(retorno2)]);

    } catch (e) {
        var dataset = DatasetBuilder.newDataset();
        dataset.addColumn("MENSAGEM");
        dataset.addColumn("LINHA");
        dataset.addRow([e.message, e.lineNumber]);
    }

    return dataset;
}