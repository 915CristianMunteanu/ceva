// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    uint public id;
    uint public patientId;
    string public dateOfVisit;
    string public diagnosis;
    string public treatment;

    constructor(uint _id, uint _patientId, string memory _dateOfVisit, string memory _diagnosis, string memory _treatment) {
        id = _id;
        patientId = _patientId;
        dateOfVisit = _dateOfVisit;
        diagnosis = _diagnosis;
        treatment = _treatment;
    }

    function updateRecord(string memory _dateOfVisit, string memory _diagnosis, string memory _treatment) public {
        dateOfVisit = _dateOfVisit;
        diagnosis = _diagnosis;
        treatment = _treatment;
    }
}
