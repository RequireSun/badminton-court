const Main = require('../lib/main').default;
const formatterOutput = require('../lib/cmd/formatterOutput').default;
const readline = require('readline');

const main = new Main();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (input) => {
    if (!input.trim()) {
        const lines = formatterOutput(main.output());

        for (line of lines) {
            console.log(line);
        }

        rl.close();
    } else {
        const result = main.input(input);

        if (result) {
            console.log(result);
        } else {
            console.log('Success: the booking is accepted!');
        }
    }
});
