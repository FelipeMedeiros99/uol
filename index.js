//------------ variáveis --------// 
const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/participants'
const statusOnline = "https://mock-api.driven.com.br/api/v4/uol/status"
let main = document.querySelector('main')


//------------ funçoes ----------//
function mostraRetorno(dado){
    console.log('deu certo')
    console.log(dado)
}

function mostraErro(erro){
    console.log('deu erro')
    console.log(erro)
}

function entrarNaSala(dado){
    plotaMensagem("entrada", nomeUsuario, "entrou na sala...")
}

function plotaMensagem(tipo, usuario, mensagem){
    let hora = Date().substring(16, 24);
    // tipo: alerta de usuario entrando/saindo, 
    // mensagens gerais e mensagens privadas.
    if (tipo == 'entrada' || tipo == 'saida'){
        main.innerHTML += `
        <div class=${tipo}>
            <p>
                <span>(${hora})</span>  <strong>${usuario}</strong> ${mensagem}
            </p>
        </div>
            `
    }

}

function manterOnline(){
    axios.post(statusOnline, {name: nomeUsuario})
}

// ------------ código ----------//

// pegando dados do usuário
let nomeUsuario = prompt('Insira seu nome: ')

// enviando para o axios e entrando na sala
let promessaEnvio = axios.post(repositorio, {name: nomeUsuario})
promessaEnvio.then(entrarNaSala)
promessaEnvio.catch(mostraErro)

// ficando online
setInterval(manterOnline, 3000)


// let promessa = axios.get(repositorio)
// promessa.then(mostraRetorno)
// promessa.catch(mostraErro)
