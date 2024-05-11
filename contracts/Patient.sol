// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Patient {
    uint public id;
    string public name;
    string public dateOfBirth;
    address[] public medicalRecords;

    constructor(uint _id, string memory _name, string memory _dateOfBirth) {
        id = _id;
        name = _name;
        dateOfBirth = _dateOfBirth;
    }

    function addMedicalRecord(address recordAddress) public {
        medicalRecords.push(recordAddress);
    }

    function getMedicalRecords() public view returns (address[] memory) {
        return medicalRecords;
    }

    function updateDetails(string memory _name, string memory _dateOfBirth) public {
        name = _name;
        dateOfBirth = _dateOfBirth;
    }

    function getMedicalRecordsCount() public view returns (uint) {
        return medicalRecords.length;
    }
}
