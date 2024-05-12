const Controller = artifacts.require("Controller");
const Repository = artifacts.require("Repository");

module.exports = function(deployer) {
  deployer.deploy(Repository).then(() => {
    return deployer.deploy(Controller, Repository.address);
  });
};
