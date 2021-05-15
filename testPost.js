
const test = async (event) => {
    console.log(event);
    return `returning from here ${event}`;
}

module.exports.render = test