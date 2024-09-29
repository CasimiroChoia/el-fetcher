// import nodefetch from "node-fetch";
import * as readline from "node:readline/promises";
import path from "node:path";
import *  as fs from "node:fs"
import { mkdir } from "node:fs/promises";
import {
    stdin as input,
    stdout as output,
    cwd
} from "node:process"
import {
    question,
    note,
    bad,
    good,
    end,
    autocompleter,
    URLLOCAL
} from "./Functions.js";

let index =0
const main = async () => {
    if (index===0) {
        console.log('\t\tSeja Bemvindo ao el-fetcher.\n')
    } else {
        console.log('\t\tBemvindo novamente <3\n')
    }
    const rl = readline.createInterface({ input, output, completer: autocompleter })
    let link;
    while (true) {
        // fazendo a leitura do link
        const regexLink = /^(^https:\/\/|^http:\/\/)+[a-zA-Z0-9:.]+(\/[a-zA-Z0-9-.]+)+/gu
        link = await rl.question(question('\tColoque o link da API') + end());
        console.log('\tFazendo uma requisição para este Link: ' + note(link+" ") + URLLOCAL(link) );
        if (regexLink.test(link)) break;
    }

    // buscando dados do link
    const resp = await fetch(link)
    let data = await resp.json()
    if (resp.status == 200 || resp.ok) { // caso a busca der certo 
        console.log(good('\tRequisição feita com sucesso ✅\n'))
        data = JSON.stringify(data)
    } else { // caso der errado
        console.log(resp.text);
        return console.log(bad('\tAconteceu algum erro na Requisição ❌'));
    }

    // obtendo o nome do ficheiro em que serão salvos os dados
    const filename = await rl.question(question('\tQual o nome do arquivo em que os dados serão armazenados ???') + end());
    // criando o ficheiro
    const dir = await mkdir('./data', { recursive: true })
    if (dir) {
        console.log(good('Directório data criado'));
    }

    const destino = path.join(cwd(), `./data/${filename}.txt`);
    try {
        const file = fs.createWriteStream(destino, { encoding: 'utf-8', flags: 'w' });
        file.write(data)
    } catch (error) {
        console.log(bad('erro no file'));
    }


    // Monstrar dados ao usuario
    // \t
    console.log(good(`
        Operação feita com sucesso ✔\n\tOs dados da API foram guardados.
        Caminho: file://${destino},
        Conteúdo: ${data}
        `));


    // console.log(good('\tOperação feita com sucesso ✔\nOs dados da API foram guardados '));
    // console.log(data);

    rl.on("SIGINT", async () => {
        console.log(question('\tVolte sempre'.toUpperCase()) + end());
        // while (true) {
        // const answer = await rl.question(question('\tQueres mesmo sair (Y/N) ? ') + end());
        //     if (answer === "N" || answer === "n") break;
        //     if (answer === "Y" || answer === "y") rl.close();
        //     continue;
        // }
    })
}

while (true) {
    try {
        await main();
        ++index;
    } catch (error) {
        console.log(bad('Aconteceu algum na aplicação'.toLocaleUpperCase()));
    }
    // const answer = await rl.question(question('\tQueres mesmo sair (Y/N) ? ') + end());
    // if (answer === "N" || answer === "n") continue;
    // if (answer === "Y" || answer === "y") {
    //     console.log(good('Tenha uma continuação de bom dia'));
    //     rl.close()
    //     break;
    // };
}
