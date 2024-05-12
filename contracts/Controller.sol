// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Repository.sol";

contract Controller {
    Repository public repository;

    event MedicalRecordCreated(uint patientId, uint recordId);

    constructor(Repository _repository) {
        repository = _repository;
    }

    modifier notEmptyString(string memory str) {
        require(bytes(str).length > 0, "String must not be empty");
        _;
    }

    function addPatient(string memory name, string memory dateOfBirth) public notEmptyString(name) notEmptyString(dateOfBirth){
        repository.addPatient(name, dateOfBirth);
    }

    function updatePatient(uint patientId, string memory newName, string memory newDateOfBirth) public notEmptyString(newName) notEmptyString(newDateOfBirth){
        repository.updatePatient(patientId, newName, newDateOfBirth);
    }

    function addMedicalRecord(uint patientId, string memory dateOfVisit, string memory diagnosis, string memory treatment) public notEmptyString(dateOfVisit) notEmptyString(diagnosis) notEmptyString(treatment){
        repository.addMedicalRecord(patientId, dateOfVisit, diagnosis, treatment);
        emit MedicalRecordCreated(patientId, repository.getAllMedicalRecordsOfPatient(patientId).length - 1);
    }

    function updateMedicalRecord(uint patientId, uint medicalRecordId, string memory newDateOfVisit, string memory newDiagnosis, string memory newTreatment) public notEmptyString(newDateOfVisit) notEmptyString(newDiagnosis) notEmptyString(newTreatment){
        repository.updateMedicalRecord(patientId, medicalRecordId, newDateOfVisit, newDiagnosis, newTreatment);
    }

}

