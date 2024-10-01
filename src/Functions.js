import chalk from "chalk";
import md5 from 'md5';



export const good = (string) => chalk.green(string)
export const bad = (string) => chalk.red(string)
export const question = (string) => chalk.yellow(string)
export const note = (string) => chalk.blue(string)
export const end = () => "\n\t"
export const URLLOCAL = (link) => {
    if (link.includes("localhost")) return note('URL Local');
    return ''
}


export const autocompleter = (line) => {
    const words = ['https://', '.com', 'http://localhost:5000/users']
    const hits = words.filter(word => word.startsWith(line))
    return [hits.length ? hits : words, line]
}
export const getDate = (date = new Date()) => {
    let year = date.getFullYear();
    let month_of_year = date.getMonth() + 1;
    let day_of_month = date.getDate();

    return `${day_of_month}${month_of_year}${year}`;
}
export const getHour = (date = new Date()) => {
    let hour = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let min = date.getMinutes();
    min = min < 10 ? '0' + min : min;
    let sec = date.getSeconds();
    sec = sec < 10 ? '0' + sec : sec;

    return `${hour}${min}${sec}`;
}

export const generateHash = (private_key, public_key, ts = (getDate() + getHour())) => {
    return md5(ts + private_key + public_key);
}