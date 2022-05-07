function createDataset(fields, constraints, sortFields) {

consulta = "UPDATE WCM_APPLICATION SET APPLICATION_EXTENSIBLE = 'true'  where APPLICATION_CODE = 'log_fluig' ";            

var consultaP = DatasetFactory.createConstraint('QUERY', consulta, consulta, ConstraintType.MUST);
DatasetFactory.getDataset('dsBD', null, Array(consultaP), null);


}