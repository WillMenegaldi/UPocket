document.getElementById('cadastro').addEventListener('click', function () {
    showform(1);
});
document.getElementById('login').addEventListener('click', function () {
    showform(2);
});


function startDB(nome) {
    let database = localStorage.getItem(nome);

    database = !database ? false : JSON.parse(database);

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

    else if (op == 2) {
        document.getElementById('box-login').style.display = 'flex';
        document.getElementById('submit1').addEventListener('click', function () {
            validUser(document.querySelector(".formulario1"), 2);
        })
    }

}

function validUser(data, op) {

    let valid = dataWorker(data, op);
    if (valid) {
        localStorage.setItem(valid.data.email, JSON.stringify(valid));
        window.location.href = "login.html";
    }
}

function dataWorker(data, op) {

    if (op == 1) {
        let email = data[1].value.toLowerCase();
        let locStor = startDB(email);
        if(locStor){locStor = locStor.data.email;}
        let dataSets = {
            data: {
                user: data[0].value,
                email: check(email, locStor, 1),
                password: check(data[2].value, data[3].value, 0),
                token: 0
            }
        }
        dataSet = dataSets.data;
        if (!dataSet.password) {
            if (!dataSet.user && !dataSet.email || !dataSet.user || !dataSet.email) {
                mensagemErro(3);
                return false;
            }
            else {
                mensagemErro(1);
                return false;
            }
        }

        else if (!dataSet.email && dataSet.user) {
            mensagemErro(4);
            return false;
        }


        if (dataSet.email == -1) {
            mensagemErro(5);
            return false;
        }


        else {
            return dataSets;
        }
    }

    else if (op == 2) {
        let inputEmail = data[0].value.toLowerCase();
        let dataSet = {
            email: inputEmail,
            password: data[1].value
        }

        let dataBase = startDB(dataSet.email);
        if (dataBase) {
            let dados = dataBase.data;
            let email = dados.email;
            let pass = dados.password
            pass = check(dataSet.password, pass, 0);

            if (!pass) {
                mensagemErro(1);
            }

            else {
                dataBase.data.token = 1;
                localStorage.setItem(email, JSON.stringify(dataBase));
                window.location.href = "index.html"
            }
        }

        else {
            mensagemErro(2);
        }
    }
}


function check(prevInsert, newInsert, funcao) {

    if (prevInsert.length < 6) {
        return false;
    }

    else if (funcao == 0 && prevInsert == newInsert || funcao == 1 && prevInsert != newInsert) {
        if (funcao == 1) {

            let email = emailCheck(prevInsert);

            return email;
        }

        return prevInsert;
    }

    else {
        return false;
    }
}

function emailCheck(email) {
    let findAt = 0;
    let findDot = 0;
    let size = email.length;
    let i = 0;

    do {

        if (email[i] == "@" || email[i] == ".") {

            if (email[i] == "@") {
                findAt += 1;
            }
            else if (email[i] == ".") {
                findDot += 1;
            }

            if (findAt == 1 && findDot >= 1) {
                return email;
            }
        }
        i += 1;

    } while (size > i)

    return -1;

}


function mensagemErro(codigo) {

    switch (codigo) {
        case 1:
            alert("Senha inválida");
            break;
        case 2:
            alert("Email não encontrado");
            break;
        case 3:
            alert("Todos os campos devem ser preenchidos corretamente!");
            break;
        case 4:
            alert("Email já cadastrado");
            break;
        case 5:
            alert("Email não é válido");
            break;
    }
}

