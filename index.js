const utils = require('./src/utils');
const manager = require('./src/manager');

const args = process.argv.slice(2);
if(args.length !== 3 || args[0] !== '-n' || isNaN(parseInt(args[1])) || utils.isIp(args[2])) {
    console.error('USAGE: ./crawl -n <# of workers> <URL>');
    process.exit(1);
}

const numberOfWorkers = parseInt(args[1]);
manager.start(args[2], numberOfWorkers);
