//------------ variáveis --------// 

//------------ funçoes ----------//
mostraRetorno(dado){
    console.log(dado.data)
}

mostraErro(erro){
    console.log(erro)
}


// ------------ código ----------//
let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants ')
promessa.then(mostraRetorno)
promessa.catch(mostraErro)
