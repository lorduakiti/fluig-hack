// Função completa que oculta ou marca linhas com um campo dentro de table PaixFilho que está com uma condição específica:

var _globalDebugOk = false
function fnOcultaLinhasPaiFilho(tableName, inputPrincipal, inputCondicao, valCondicao, inputCondicaoNegativa, valCondicaoNegativa){
console.log('fnOcultaLinhasPaiFilho: ', tableName, inputPrincipal, inputCondicao, valCondicao, inputCondicaoNegativa, valCondicaoNegativa);

	var auxRetorno 	= '';
	var flagCondicao= false;
	var Ids 		= [];
	Ids = fnBuscaIdsPaiFilho(tableName, inputPrincipal);
	if(inputCondicaoNegativa === undefined) { inputCondicaoNegativa = ''; }
	if(valCondicaoNegativa 	 === undefined) { valCondicaoNegativa   = ''; }

	if( Ids.length > 0 ){
		Ids.forEach(function(id) {
console.log($('#' + inputCondicao + '___' + id).val(), '==', valCondicao, ($('#' + inputCondicao + '___' + id).val() == valCondicao), $('#' + inputCondicaoNegativa + '___' + id).val(), '==', valCondicaoNegativa, ($('#' + inputCondicaoNegativa + '___' + id).val() != valCondicaoNegativa), ' -->', $('#' + inputPrincipal + '___' + id).val());

			if((inputCondicao != '') && (inputCondicaoNegativa != '')){
				flagCondicao = (  ($('#' + inputCondicao + '___' + id).val() == valCondicao) && ($('#' + inputCondicaoNegativa + '___' + id).val() != valCondicaoNegativa)  );
				
			} else if(inputCondicao != ''){
				flagCondicao = ($('#' + inputCondicao + '___' + id).val() == valCondicao);
				
			} else if(inputCondicaoNegativa != ''){
				flagCondicao = ($('#' + inputCondicaoNegativa + '___' + id).val() != valCondicaoNegativa);
			}
			
			if(flagCondicao){
				if(auxRetorno == ''){
					auxRetorno = id;
					fnDebug('OK: [' + auxRetorno + ']', 'c');
				}			
			} else {
				if(_globalDebugOk){
					$('#' + inputPrincipal + '___' + id).parent('div').parent('td').parent('tr').addClass('has-error');
				} else {
					$('#' + inputPrincipal + '___' + id).parent('div').parent('td').parent('tr').hide();
					$('#' + inputPrincipal + '___' + id).parent('div').parent('td').parent('tr').find('input').attr('readonly', 'readonly');
				}
			}
		});
	}
	return auxRetorno;
}