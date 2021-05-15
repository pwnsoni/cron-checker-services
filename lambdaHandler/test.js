const test = async (event) => {
    console.log(event);
    return `returning from here updated ${event}`;
}

module.exports.render = test;