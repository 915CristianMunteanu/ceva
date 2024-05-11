// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./MedicalRecord.sol";

contract Repository {
    mapping(uint => address) public patients;
    uint private nextPatientId = 0;

    event PatientAdded(uint patientdId, address patientAddress);
    event MedicalRecordAdded(uint recordId, address recordAddress);
    event PatientUpdated(uint patientId, string newName, string newDateOfBirth);
    event MedicalRecordUpdated(uint patientId, uint medicalRecordId, string newDateOfVisit, string newDiagnosis, string newTreatment);

    function addPatient(string memory name, string memory dateOfBirth) public {
        Patient patient = new Patient(nextPatientId, name, dateOfBirth);
        patients[nextPatientId] = address(patient);
        emit PatientAdded(nextPatientId, address(patient));
        nextPatientId++;
    }

    function updatePatient(uint patientId, string memory newName, string memory newDateOfBirth) public {
        require(patientId < nextPatientId, "Patient does not exist!");
        Patient(patients[patientId]).updateDetails(newName, newDateOfBirth);
        emit PatientUpdated(patientId, newName, newDateOfBirth);
    }

    function addMedicalRecord(uint patientId, string memory dateOfVisit, string memory diagnosis, string memory treatment) public {
        require(patientId < nextPatientId, "Patient does not exist");
        Patient patient = Patient(patients[patientId]);
        uint nextRecordId = patient.getMedicalRecordsCount();
        MedicalRecord newRecord = new MedicalRecord(nextRecordId, patientId, dateOfVisit, diagnosis, treatment);
        patient.addMedicalRecord(address(newRecord));
        emit MedicalRecordAdded(nextRecordId, address(newRecord));
    }

    function updateMedicalRecord(uint patientId, uint medicalRecordId, string memory newDateOfVisit, string memory newDiagnosis, string memory newTreatment) public {
        require(patientId < nextPatientId, "Patient does not exist");
        Patient patient = Patient(patients[patientId]);
        uint numberOfRecords = patient.getMedicalRecordsCount();
        require(medicalRecordId < numberOfRecords, "Medical Record with the given ID does not exist for that patient");
        address[] memory recordsAddresses = patient.getMedicalRecords();
        MedicalRecord medicalRecord = MedicalRecord(recordsAddresses[medicalRecordId]);
        medicalRecord.updateRecord(newDateOfVisit, newDiagnosis, newTreatment);
        emit MedicalRecordUpdated(patientId, medicalRecordId, newDateOfVisit, newDiagnosis, newTreatment);
    }

    function getAllPatients() public view returns (address[] memory) {
        address[] memory allPatients = new address[](nextPatientId);
        for (uint i = 0; i < nextPatientId - 1; i++) {
            allPatients[i] = patients[i];
        }
        return allPatients;
    }

    function getPatient(uint patientId) public view returns (address) {
        require(patientId < nextPatientId, "Patient does not exist!");
        return patients[patientId];
    }

    function getAllMedicalRecordsOfPatient(uint patientId) public view returns (address[] memory) {
        require(patientId < nextPatientId, "Patient does not exist!");
        Patient patient = Patient(patients[patientId]);
        return patient.getMedicalRecords();
    }

    function getCertainMedicalRecordOfPatient(uint patientId, uint medicalRecordId) public view returns (address) {
        require(patientId < nextPatientId, "Patient does not exist!");
        Patient patient = Patient(patients[patientId]);
        uint numberOfRecords = patient.getMedicalRecordsCount();
        require(medicalRecordId < numberOfRecords, "Medical Record with the given ID does not exist for that patient");
        address[] memory recordsAddresses = patient.getMedicalRecords();
        return recordsAddresses[medicalRecordId - 1];
    }
}
