const { Worker } = require('worker_threads');

let linksQueue = [];
const visitedLinks = new Set();
const workers = [];
const availableWorkers = [];

function mainLoop(err) {
    if(err) {
        // finish with error
        console.log('ERR:', err);
        workers.forEach(worker => worker.terminate());
        process.exit(1);
    }
    while (linksQueue.length > 0 && availableWorkers.length > 0) {
        // skip already visited links
        let nextIdx = 0;
        while (nextIdx < linksQueue.length && visitedLinks.has(linksQueue[nextIdx])) {
            nextIdx++;
        }
        linksQueue = linksQueue.slice(nextIdx);

        if(linksQueue.length > 0 && availableWorkers.length > 0) {
            let nextWorker = availableWorkers.shift();
            let nextLink = linksQueue.shift();
            visitedLinks.add(nextLink);
            console.log(nextLink);
            nextWorker.postMessage(nextLink);
        }
    }

    // check if there are no more links and all the workers are done
    if (linksQueue.length === 0 && availableWorkers.length === workers.length) {
        // finish successfully
        workers.forEach(worker => worker.terminate());
        process.exit(0);
    }
}

function start(host, numberOfWorkers) {
    linksQueue.push(host);

    // initialize the workers
    for(let i = 0; i < numberOfWorkers; i++) {
        let worker = new Worker(__dirname + '/worker.js');
        worker.on('message', function (data) {
            availableWorkers.push(worker);  // mark worker as available for work
            if(data.links) {
                // add discovered links to the queue
                linksQueue = linksQueue.concat(data.links);
            }
            mainLoop(data.err);
        });

        workers.push(worker);
        availableWorkers.push(worker);
    }

    mainLoop();
}


module.exports = {
    mainLoop,
    start,
}