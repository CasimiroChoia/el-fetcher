import chalk from "chalk";



export const good = (string) => chalk.green(string)
export const bad = (string) => chalk.red(string)
export const question = (string) => chalk.yellow(string)
export const note = (string) => chalk.blue(string)
export const end = () => "\n\t"
export const URLLOCAL =(link) => {
    if (link.includes("localhost")) return note('URL Local');
}


export const autocompleter = (line) => {
    const words = ['https://','.com', new RegExp('https:\/\/[a-z0-9]{1,}\.com','i')]
    const hits = words.filter(word => word.startsWith(line))
    return [hits.length ? hits : words, line]
}