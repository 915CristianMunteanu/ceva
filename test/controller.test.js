const Controller = artifacts.require("Controller");
const Repository = artifacts.require("Repository");
const Patient = artifacts.require("Patient");
const MedicalRecord = artifacts.require("MedicalRecord");

contract("Controller", (accounts) => {
    let controller;
    let repository;
    const [admin, user1] = accounts;

    before(async () => {
        repository = await Repository.new();
        controller = await Controller.new(repository.address);
    });

    describe("Patient management", () => {
        it("should fail to add a patient with empty name", async () => {
            try {
                await controller.addPatient("", "1990-01-01", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "String must not be empty", "Error message did not include the correct reason.");
            }
        });

        it("should fail to add a patient with empty date of birth", async () => {
            try {
                await controller.addPatient("John Doe", "", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "String must not be empty", "Error message did not include the correct reason.");
            }
        });

        it("should add a patient", async () => {
            await controller.addPatient("John Doe", "1990-01-01", { from: admin });
            const patientAddress = await repository.getPatient(0);
            const patient = await Patient.at(patientAddress);
            const name = await patient.name();
            const dateOfBirth = await patient.dateOfBirth();
            assert.equal(name, "John Doe", "Patient's name was not set correctly.");
            assert.equal(dateOfBirth, "1990-01-01", "Patient's date of birth was not set correctly.");
        });

        it("should update an existing patient's details", async () => {
            await controller.updatePatient(0, "Jane Doe", "1980-01-01", { from: admin });
            const patientAddress = await repository.getPatient(0);
            const patient = await Patient.at(patientAddress);
            const name = await patient.name();
            const dateOfBirth = await patient.dateOfBirth();
            assert.equal(name, "Jane Doe", "Patient's name was not updated correctly.");
            assert.equal(dateOfBirth, "1980-01-01", "Patient's date of birth was not updated correctly.");
        });
    });

    describe("Medical record management", () => {
        before(async () => {
            await controller.addPatient("John Doe", "1990-01-01", { from: admin });
        });

        it("should fail to add a medical record with empty date of visit", async () => {
            try {
                await controller.addMedicalRecord(0, "", "Flu", "Rest", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "String must not be empty", "Error message did not include the correct reason.");
            }
        });

        it("should fail to add a medical record with empty diagnosis", async () => {
            try {
                await controller.addMedicalRecord(0, "2023-01-01", "", "Rest", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "String must not be empty", "Error message did not include the correct reason.");
            }
        });

        it("should fail to add a medical record with empty treatment", async () => {
            try {
                await controller.addMedicalRecord(0, "2023-01-01", "Flu", "", { from: admin });
                assert.fail("The transaction should have reverted.");
            } catch (error) {
                assert.include(error.message, "String must not be empty", "Error message did not include the correct reason.");
            }
        });

        it("should add a medical record", async () => {
            await controller.addMedicalRecord(0, "2023-01-01", "Flu", "Rest", { from: admin });
            const records = await repository.getAllMedicalRecordsOfPatient(0);
            assert.equal(records.length, 1, "Medical record was not added correctly.");
            const recordAddress = records[0];
            const record = await MedicalRecord.at(recordAddress);
            const dateOfVisit = await record.dateOfVisit();
            const diagnosis = await record.diagnosis();
            const treatment = await record.treatment();
            assert.equal(dateOfVisit, "2023-01-01", "Medical record's date of visit was not set correctly.");
            assert.equal(diagnosis, "Flu", "Medical record's diagnosis was not set correctly.");
            assert.equal(treatment, "Rest", "Medical record's treatment was not set correctly.");
        });

        it("should update an existing medical record", async () => {
            await controller.updateMedicalRecord(0, 0, "2023-01-03", "Updated Diagnosis", "Updated Treatment", { from: admin });
            const records = await repository.getAllMedicalRecordsOfPatient(0);
            const recordAddress = records[0];
            const record = await MedicalRecord.at(recordAddress);
            const dateOfVisit = await record.dateOfVisit();
            const diagnosis = await record.diagnosis();
            const treatment = await record.treatment();
            assert.equal(dateOfVisit, "2023-01-03", "Medical record's date of visit was not updated correctly.");
            assert.equal(diagnosis, "Updated Diagnosis", "Medical record's diagnosis was not updated correctly.");
            assert.equal(treatment, "Updated Treatment", "Medical record's treatment was not updated correctly.");
        });
    });
});
