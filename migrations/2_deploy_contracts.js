const Patient = artifacts.require("Patient");
const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = function(deployer) {
  deployer.deploy(Patient, 1, "Alice", "1990-01-01"); // Example arguments for Patient contract
  deployer.deploy(MedicalRecord, 1, 1, "2024-05-11", "Sample Diagnosis", "Sample Treatment"); // Example arguments for MedicalRecord contract
};
