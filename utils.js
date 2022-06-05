function isIp(host) {
    return /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host);
}

function extractDomain(host) {
    let split = host.split('.');
    return split.slice(-2).join('.');
}

module.exports = {
    isIp,
    extractDomain
}