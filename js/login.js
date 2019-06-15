document.getElementById('cadastro').addEventListener('click', function () {
    showform(1);
});
document.getElementById('login').addEventListener('click', function () {
    showform(2);
});

document.getElementById('back-button').addEventListener('click', function () {
    document.getElementById('boxes').style.display = 'none';
    document.getElementById('option').style.display = 'flex';
});

function startDB(nome) {
    let database = localStorage.getItem(nome);

    database = !database ? [] : JSON.parse(database);

    return database;
}

function showform(op) {
    document.getElementById('option').style.display = 'none';
    if (op == 1) {
        document.getElementById('box-registro').style.display = 'flex';
        document.getElementById('submit0').addEventListener('click', function () {
            validUser(document.querySelector(".formulario0"), 1);
        })
    }
    if (op == 2) {
        document.getElementById('box-login').style.display = 'flex';
        document.getElementById('submit1').addEventListener('click', function () {
            validUser(document.querySelector(".formulario1"), 2);
        })
    }
}

function validUser(data, op) {
    let valid = dataWorker(data, op);
    console.log(valid)
    if (valid) {
        localStorage.setItem(valid.email, JSON.stringify(valid));
        window.location.href = "login.html";
    }
}

function dataWorker(data, op) {

    if (op == 1) {
        let email = data[1].value;
        let locStor = startDB(email);
        locStor = locStor.email;
        let dataSet = {
            user: data[0].value,
            email: check(data[1].value, locStor, 1),
            password: check(data[2].value, data[3].value, 0)
        }

        if (!dataSet.password) {
            if (!dataSet.user || !dataSet.email) {
                mensagemErro(3);
            }
            else {
                mensagemErro(1);
            }
        }

        else if (!dataSet.email && dataSet.user) {
            mensagemErro(4);
        }

        else {
            return dataSet;
        }
    }

    if (op == 2) {
        let dataSet = {
            email: data[0].value,
            password: data[1].value
        }
        let dados = startDB(dataSet.email);
        let email = dados.email;
        let pass = dados.password
        pass = check(dataSet.password, pass, 0);
        email = check(dataSet.email, email, 0);

        if (!email) {
            mensagemErro(2);
        }

        else if (!pass) {
            mensagemErro(1);
        }

        else if(email && pass){
            window.location.href = "index.html"
        }
    }
}


function check(prevInsert, newInsert, funcao) {

    console.log(prevInsert.length);

    if(prevInsert.length < 6){
        prevInsert = 0;
        if(prevInsert == newInsert){
            return false;
        }
    }

    else if(funcao == 0 && prevInsert == newInsert || funcao == 1 && prevInsert != newInsert) {
        return prevInsert;
    }
    else {
        return false;
    }
}


function mensagemErro(codigo) {
    if (codigo == 1) {
        alert("Senha inválida");
    }
    else if (codigo == 2) {
        alert("Email não encontrado");
    }
    else if (codigo == 3) {
        alert("Todos os campos devem ser preenchidos corretamente!")
    }
    else if (codigo == 4) {
        alert("Email já foi cadastrado");
    }
}

