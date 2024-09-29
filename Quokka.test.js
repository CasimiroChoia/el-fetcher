let regex = /^(^https:\/\/|^http:\/\/)+[a-zA-Z0-9:.]+(\/[a-zA-Z0-9-.]+)+/gu

let values = [
'http://asdasasdasasdasasdashst:000/users',
'https://asdasasdasasdasasdashst:000/use-rs',
'http://apo.com/us-.ers',
'http://apo.com/us-.ers',
'https://apo.com/users'
]

let result = regex.test(values[3])

result //?
result