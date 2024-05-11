// test/repository.test.js

const Repository = artifacts.require("Repository");
const Patient = artifacts.require("Patient");
const MedicalRecord = artifacts.require("MedicalRecord");

contract("Repository", (accounts) => {
    let repository;
    const [admin, user1] = accounts;

    before(async () => {
        repository = await Repository.new();
    });

    describe("Patient management", () => {
        it("should fail to add a patient with empty name or date of birth", async () => {
            try {
                await repository.addPatient("", "1990-01-01", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "revert", "Error message did not include the correct reason.");
            }
        });
    
        it("should update an existing patient's details", async () => {
            await repository.updatePatient(0, "Updated Name", "2000-01-01", { from: admin });
            const patient = await Patient.at(await repository.getPatient(0));
            const name = await patient.name();
            const dateOfBirth = await patient.dateOfBirth();
            assert.equal(name, "Updated Name", "Patient's name was not updated correctly.");
            assert.equal(dateOfBirth, "2000-01-01", "Patient's date of birth was not updated correctly.");
        });
    
        it("should fail to add a patient with existing ID", async () => {
            try {
                await repository.addPatient("John Smith", "1995-01-01", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "revert", "Error message did not include the correct reason.");
            }
        });
    
        it("should retrieve details of a specific patient", async () => {
            const patientAddress = await repository.getPatient(0);
            const patient = await Patient.at(patientAddress);
            const name = await patient.name();
            const dateOfBirth = await patient.dateOfBirth();
            assert.equal(name, "Updated Name", "Retrieved patient's name was incorrect.");
            assert.equal(dateOfBirth, "2000-01-01", "Retrieved patient's date of birth was incorrect.");
        });
    });
    

    describe("Medical record management", () => {
        it("should fail to add a medical record with invalid patient ID", async () => {
            try {
                await repository.addMedicalRecord(99, "2023-01-01", "Flu", "Rest", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "revert", "Error message did not include the correct reason.");
            }
        });
        it("should add a medical record", async () => {
            await repository.addMedicalRecord(0, "2023-01-01", "Flu", "Rest", { from: admin });
            const records = await repository.getAllMedicalRecordsOfPatient(0);
            assert.equal(records.length, 1, "Medical record was not added correctly.");
        });
    
        it("should update an existing medical record", async () => {
            await repository.updateMedicalRecord(0, 0, "2023-01-03", "Updated Diagnosis", "Updated Treatment", { from: admin });
            const records = await repository.getAllMedicalRecordsOfPatient(0);
            const record = await MedicalRecord.at(records[0]);
            const dateOfVisit = await record.dateOfVisit();
            const diagnosis = await record.diagnosis();
            const treatment = await record.treatment();
            assert.equal(dateOfVisit, "2023-01-03", "Medical record's date of visit was not updated correctly.");
            assert.equal(diagnosis, "Updated Diagnosis", "Medical record's diagnosis was not updated correctly.");
            assert.equal(treatment, "Updated Treatment", "Medical record's treatment was not updated correctly.");
        });
    
        it("should retrieve all medical records of a patient", async () => {
            const records = await repository.getAllMedicalRecordsOfPatient(0);
            assert.equal(records.length, 1, "The number of medical records retrieved was incorrect.");
        });
    });
    

    // More tests could include:
    // - Permissions testing, ensuring only authorized users can add or update patient and record data.
    // - Edge cases for data validation, e.g., adding a patient with empty name or date of birth.
});
