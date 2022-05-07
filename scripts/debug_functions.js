// Popula variável global do processo
var _vars = new Object({
    gestor:     '',
    codColigada:'',
    codChapa:   '',
    objDependentes: null,
    arrAtividades: {
        'CRIACAO':			0,
        'INICIO': 			4,
        'FIM':				15
    }
});


// Popula variáveis globais
const _global = new Object({
	fluigAPI:  	null,
	url:		'window.location.href', // COM ERRO NO FLUIG APP MOBILE
	parentUrl:	'parent.window.location.href',  // top.window.location.href // COM ERRO NO FLUIG APP MOBILE
	isWcm: 		false,
	isPublic: 	false,
	isMobile:	false,
	debug: 		false,
	debugClick: true,
	debugSelector: 'i#register',
	debugCount: 0,
	debugLeval: 0,
	objVars: 	{},
	selectors: 	{},
	maskType: 	{},
	modal:		'',
	load:		'',
	autoClose:	false,
	numInterval: null,
	report: {
		companyId:	1,
		publisher:	'???',
		publisherId:'???',
		userName:	'?????????',
		userNameId:	'?????????',
		password:	'???',
		fileName:	'???',
		file:		'',
		folderName:	'',
		folder:		''
	},
	year: moment().year(),
	formMode:	  null,
	numActivity:  null,
	arrActivitys: new Object(),
	arrRequiredInputs: new Array(),
	maxRowsTable: 0,
	devGroup: 'grupoDebugFluig'
});

// Define função padrão "custom"
window.custom = new Object({
	log: function(first, ...parans){
		if(_global.debug){
			console.log(first, ...parans);
		}
	},
	alert: function(first, ...parans){
		if(_global.debug){
			alert([first, ...parans]);
		}
	},
	debug: function(level, first, ...parans){
		if(_global.debugLeval == 0  ||  _global.debugLeval >= level){
			this.log(first, ...parans);
		}
	},
	isValid: function(value, type, ignore){

		type   = (type   === undefined)? '' : type ;
		ignore = (ignore === undefined)? '' : ignore ;

		let flagOk = false;

		if(value !== null  || ignore.search('null') > -1){
			if(value !== undefined  || ignore.search('undefined') > -1){
				value = ((value === null  ||  value === undefined) && (ignore.search(/null|undefined/gi) > -1))? '' : value ;
				if(type == 'dataset'){
					if(value.values){
						if(value.values.length > 0  || ignore.search('length') > -1){
							flagOk = true;
						}
					}
				} else if(typeof(value) == 'object'){
					if(Array.isArray( value )){
						if(value.length > 0  || ignore.search('length') > -1){
							flagOk = true;
						}
					} else if(Object.keys( value ).length > 0  || ignore.search('length') > -1){
						flagOk = true;
					}
				} else {
					if(value.toString() != '0'  || ignore.search('zeronumber') > -1){
						if(value.toString() != ''  || ignore.search(/empty|null|undefined/gi) > -1){
							flagOk = true;
						}
					}
				}
			}
		}
		return flagOk;
	}
});


// Populando o objeto de variáveis globais do fluig 
if(typeof(WCMAPI) != 'undefined'){
	_global.fluigAPI = WCMAPI;
	
} else if(typeof(parent.WCMAPI) 	!= 'undefined'){
	_global.fluigAPI = parent.WCMAPI;
	
} else if(typeof(top.WCMAPI) 		!= 'undefined'){
	_global.fluigAPI = top.WCMAPI;
	
} else if(typeof(parentOBJ.WCMAPI) 	!= 'undefined'){
	_global.fluigAPI = parentOBJ.WCMAPI;
	
} else {
	_global.fluigAPI = null;
}

// Definindo variável de mobile global
_global.isMobile = (custom.isValid(_global.fluigAPI))?  _global.fluigAPI._isMobile()  :  false ;


// Definindo variável de debug global
let href = (_global.url == _global.parentUrl)? _global.url : _global.parentUrl ;
let paramDebug = new URL( href ).searchParams.get("debug");
if(paramDebug == 'true'){
	console.log('debug', paramDebug);
	_global.debug = true;
}

//_global.isWcm    = true;
//_global.isPublic = false;


const modalData = new Object({
	getDataset(dataset, objParams){
		let DS_RETORNO = null;
		if(dataset && objParams){
			let arrFields   = (objParams['fields'])?    objParams['fields'] : null ;
			let arrOrderBy  = (objParams['orderby'])?   objParams['orderby'] : null ;
			let arrCns      = new Array();
			for(let Cns in objParams['constraints']){
				if(Cns){
					let field        = Cns;
					let initialValue = (objParams['constraints'][Cns]['initialValue'])? objParams['constraints'][Cns]['initialValue']   : null ;
					let finalValue   = (objParams['constraints'][Cns]['finalValue'])?   objParams['constraints'][Cns]['finalValue']     : null ;
					if(objParams['constraints'][Cns]['value']){
						initialValue = objParams['constraints'][Cns]['value'];
						finalValue	 = initialValue;
					}
					let type         = (objParams['constraints'][Cns]['type'])?         objParams['constraints'][Cns]['type']           : ConstraintType.MUST ;
					let cn = DatasetFactory.createConstraint(field, initialValue, finalValue, type);
					if(objParams['constraints'][Cns]['likeSearch']){  cn.setLikeSearch(true);  }
					arrCns.push( cn );
				}
			}
			let DS = DatasetFactory.getDataset(dataset, arrFields, arrCns, arrOrderBy);
			if(DS){
				if(DS['values']){
					if(DS.values.length > 0 ){
						let error = (DS.values[0]['ERROR'] == 'false'  ||  DS.values[0]['ERROR'] === undefined)? false : DS.values[0]['ERROR'] ;
						if(!error){
							DS['error'] 	= false;
							DS['rowsCount'] = DS.values.length;
                            DS_RETORNO = DS;
						} else {
                            DS_RETORNO = new Object({'error': true, 'values': [{ERROR: DS.values[0]['ERROR'], DS_RETORNO: DS.values[0]['DS_RETORNO']}], 'rowsCount': 1});
						}
					} else {
						DS_RETORNO = new Object({'error': false, 'values': [], 'rowsCount': 0});
					}
				}
			}
		}
		return DS_RETORNO;
	},
        FLUIG:		null,
        RM:  		null,
	PROTHEUS: 	null,
	DATASUL: 	null
});

modalData.FLUIG = {
    read: {
        validateUserGroup(userId, groupId){
            // filtros: userId, groupId
            let objParams = {
                constraints: {
                    'colleagueGroupPK.colleagueId': {
                        value: userId
                    },
                    'colleagueGroupPK.groupId': {
                        value: groupId
                    }
                }
            };
            let DS = modalData.getDataset('colleagueGroup', objParams);
            if(DS){
                if(DS.rowsCount > 0){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}

function fnShowDebug( msg ){
	// custom.log(arguments.callee.name);
	let html = '' +
		'<div id="topDebugAlert" class="row" >' +
		'	<span class="label label-danger col-lg-12 col-md-12 col-sm-12 col-xs-12">' + 
			msg + 
		'	</span>' +
		'</div>';
	$('body > div.fluig-style-guide').prepend( html );
}

function fnValidaDebug(){
	// custom.log(arguments.callee.name);
	_vars.gestor = false;
	if(typeof(_global.fluigAPI['userCode']) != 'undefined'){
		if(modalData.FLUIG.read.validateUserGroup( _global.fluigAPI['userCode'], _global.devGroup )){
			if( confirm("Iniciar debug?") ){
				let codChapa = prompt("Deseja alterar a chapa?", _vars.codChapa);
				_vars.codChapa = ( custom.isValid( codChapa) )? codChapa : _vars.codChapa ;
				fnShowDebug( 'Debug ativado para o chapa: <b>[' + _vars.codChapa + ']</b>!' );
				_vars.gestor = true;
			}
		}
	}

    return _vars.gestor;
}

// Executa chamada da função de debug
fnValidaDebug()