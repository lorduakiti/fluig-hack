function createDataset(fields, constraints, sortFields) {

    /** Vamos limpar o log para que seja mais fácil a análise do retorno */
    var retorno = new java.nio.file.Path.of("/opt/fluig/appserver/domain/servers/fluig1/log/server.log");
    var retorno3 = new java.nio.file.Files.writeString(retorno, "");
    log.info(retorno3);
}