function createDataset(fields, constraints, sortFields) { 
	
	var newDataset = DatasetBuilder.newDataset();
	
	if(fields == null){
		newDataset.addColumn("INFO");
		newDataset.addRow(["Informe uma query!"]);
		return newDataset;
	}

	var minhaQuery = fields[0]
	log.info("start - ds_sql_consulta_fluig QUERY: "+minhaQuery);
	var dataSource = "/jdbc/FluigDSRO";

	var conn = null;
	var stmt = null;
	var rs = null;
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	var created = false;
	try {
		conn = ds.getConnection();
		stmt = conn.createStatement();
		rs = stmt.executeQuery(minhaQuery);
		var columnCount = rs.getMetaData().getColumnCount();
		while(rs.next()) {
			if(!created) {
				for(var i=1;i<=columnCount; i++) {
					newDataset.addColumn(rs.getMetaData().getColumnName(i));
				}
				created = true;
			}
			var Arr = new Array();
			for(var i=1;i<=columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if(null!=obj){
					Arr[i-1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
				}
				else {
					Arr[i-1] = "null";
				}
			}
			newDataset.addRow(Arr);
		}
	} catch(e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		try{
			if(rs != null) rs.close();
			if(stmt != null) stmt.close();
			if(conn != null) conn.close();
		}catch(er){
			log.info("Erro ao fechar as conexões: " + er);
		}
	}
	return newDataset;
}