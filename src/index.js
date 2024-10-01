import * as readline from "node:readline/promises";
import QRcode from "qrcode";
import path from "node:path";
import *  as fs from "node:fs"
import dotenv from "dotenv";
import { mkdir } from "node:fs/promises";
import {
    stdin as input,
    stdout as output,
    cwd,
    env
} from "node:process"
import {
    question,
    note,
    bad,
    good,
    end,
    autocompleter,
    URLLOCAL,
    getDate,
    getHour,
    generateHash
} from "./Functions.js";
dotenv.config()
let index = 0;
const main = async () => {
    index === 0 ? console.log('\t\tSeja Bemvindo ao el-fetcher.\n') : console.log('\t\tBemvindo novamente <3\n');
    let private_key = "05eed8ea9650a92b85ce9106bf517612c67c6975"
    let public_key = "7560bd217b40b79bfa4279deea44bdf2"
    let ts = getDate() + getHour();

    const rl = readline.createInterface({ input, output, completer: autocompleter })
    let link;
    while (true) {
        // fazendo a leitura do link
        const regexLink = /^(^https:\/\/|^http:\/\/)+[a-zA-Z0-9:.]+(\/[a-zA-Z0-9-.]+)+/gu
        link = await rl.question(question('\tColoque o link da API') + end());
        link = ((link.toLowerCase() == "marvel") ? `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${'7560bd217b40b79bfa4279deea44bdf2'}&hash=${generateHash(private_key, public_key)}` : link)
        if (!link || link === "") continue;
        if (regexLink.test(link) && link) break;
    }
    // buscando dados do link
    console.log('\tFazendo uma requisição para este Link: ' + note(link + " ") + URLLOCAL(link));
    const resp = await fetch(link)
    let data = await resp.json()
    if (resp.status == 200 || resp.ok) { // caso a busca der certo 
        console.log(good('\tRequisição feita com sucesso ✅\n'))
        try {
            let code = await QRcode.toDataURL(link)
            console.log(code);
            
        } catch (err) { }
        data = JSON.stringify(data)
        link = undefined;
    } else { // caso der errado
        console.log(JSON.stringify(resp))
        console.log(resp.text);
        return console.log(bad('\tAconteceu algum erro na Requisição ❌'));
    }

    // obtendo o nome do ficheiro em que serão salvos os dados
    const filename = await rl.question(question('\tQual o nome do arquivo em que os dados serão armazenados ???') + end());
    if (filename == "") console.log(note('\tOs dados serão salvos em API.txt')); //caso o nome nao for informado

    // criando o ficheiro
    const dir = await mkdir('./data', { recursive: true })
    if (dir) {
        console.log(good('\tDirectório data criado'));
    }

    const destino = path.join(cwd(), `./data/${filename || "API"}.txt`);
    try {
        const file = fs.createWriteStream(destino, { encoding: 'utf-8', flags: 'w' });
        file.write(data)
    } catch (error) {
        console.log(bad('\terro no file'));
    }


    // Monstrar dados ao usuario
    console.log(good(`
        Operação feita com sucesso ✔\n\tOs dados da API foram guardados.
        Data: ${getDate()},
        Hora: ${getHour()},
        Caminho: file://${destino},
        Conteúdo: ${data.slice(0, destino.length)}...
        `));

    rl.on("SIGINT", async () => {
        console.log(question('\tVolte sempre'.toUpperCase()) + end());
    })
}


while (true) {
    try {
        await main();
        ++index;
    } catch (error) {
        console.log(bad('Aconteceu algum na aplicação'.toLocaleUpperCase()));
        console.log(error);
    }
}
