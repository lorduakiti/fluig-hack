function verificarGrupoDebugColaboradorLogado(usuarioFluigColaborador) {
    const GROUP_DEBUG_ID = 'grupoDebugFluig';
    let dsResultadoBusca = buscarUsuariosGrupo(GROUP_DEBUG_ID, usuarioFluigColaborador);
    return dsResultadoBusca.values.length > 0 ? true : false;
}

function buscarUsuariosGrupo(grupo, matricula) {
    const cGroupID = DatasetFactory.createConstraint("colleagueGroupPK.groupId", grupo, grupo, ConstraintType.MUST);
    const cColleagueID = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", matricula, matricula, ConstraintType.MUST);
    return DatasetFactory.getDataset("colleagueGroup", null, [cGroupID, cColleagueID], null);
}

if (verificarGrupoDebugColaboradorLogado(WKUser)) {
    alert(1);
}