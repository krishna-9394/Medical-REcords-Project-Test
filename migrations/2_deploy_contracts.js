// const artifacts = require('truffle-artifacts');
const HelloWorld = artifacts.require("HealthCare");

module.exports = function (deployer) {
    deployer.deploy(HelloWorld);
};
