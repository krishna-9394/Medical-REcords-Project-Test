// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthCare {
    struct Patient {
        string name;
        bool isRegistered;
        uint[] bloodSugarLevels;  // Raw blood sugar levels
        string publicKey;         // Will be set when patient decides to share data
        string secretKey;         // Will be set when patient decides to share data
        string[] encryptedBloodSugarLevels;  // Encrypted values
        bool hasEncryptedData;    // Flag to check if encryption is done
        mapping(address => bool) authorizedDoctors;
    }
    
    struct Doctor {
        string name;
        string specialization;
        bool isRegistered;
    }
    
    struct ComputedResult {
        string encryptedResult;
        bool isComputed;
        address computedByDoctor;
    }
    
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => ComputedResult) public patientResults;
    
    address[] public patientList;
    address[] public doctorList;
    
    // Events
    event PatientRegistered(address indexed patientAddress, string name);
    event DoctorRegistered(address indexed doctorAddress, string name);
    event BloodSugarAdded(address indexed patientAddress, uint value);
    event EncryptionKeysSet(address indexed patientAddress);
    event ComputationCompleted(address indexed patientAddress, address indexed doctorAddress);
    
    // Modifiers
    modifier onlyRegisteredPatient() {
        require(patients[msg.sender].isRegistered, "Not a registered patient");
        _;
    }
    
    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isRegistered, "Not a registered doctor");
        _;
    }
    
    // Patient Registration
    function registerPatient(string memory _name) external {
        require(!patients[msg.sender].isRegistered, "Patient already registered");
        
        patients[msg.sender].name = _name;
        patients[msg.sender].isRegistered = true;
        patientList.push(msg.sender);
        
        emit PatientRegistered(msg.sender, _name);
    }

    // Check if the address is a registered patient
    function isPatient(address _address) external view returns (bool) {
        return patients[_address].isRegistered;
    }

    // Check if the address is a registered doctor
    function isDoctor(address _address) external view returns (bool) {
        return doctors[_address].isRegistered;
    }


    
    // Doctor Registration
    function registerDoctor(string memory _name, string memory _specialization) external {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");
        
        doctors[msg.sender].name = _name;
        doctors[msg.sender].specialization = _specialization;
        doctors[msg.sender].isRegistered = true;
        doctorList.push(msg.sender);
        
        emit DoctorRegistered(msg.sender, _name);
    }
    
    // Add blood sugar level
    function addBloodSugarLevel(uint _value) external onlyRegisteredPatient {
        patients[msg.sender].bloodSugarLevels.push(_value);
        emit BloodSugarAdded(msg.sender, _value);
    }
    
    // Set encryption keys and encrypted data
    function setEncryptionData(
        string memory _publicKey, 
        string memory _secretKey, 
        string[] memory _encryptedLevels
    ) external onlyRegisteredPatient {
        require(!patients[msg.sender].hasEncryptedData, "Encryption data already set");
        
        patients[msg.sender].publicKey = _publicKey;
        patients[msg.sender].secretKey = _secretKey;
        patients[msg.sender].encryptedBloodSugarLevels = _encryptedLevels;
        patients[msg.sender].hasEncryptedData = true;
        
        emit EncryptionKeysSet(msg.sender);
    }
    
    // Authorize doctor
    function authorizeDoctor(address _doctorAddress) external onlyRegisteredPatient {
        require(doctors[_doctorAddress].isRegistered, "Doctor not registered");
        patients[msg.sender].authorizedDoctors[_doctorAddress] = true;
    }
    
    // Revoke doctor's authorization
    function revokeDoctor(address _doctorAddress) external onlyRegisteredPatient {
        patients[msg.sender].authorizedDoctors[_doctorAddress] = false;
    }

    function getMyBloodSugarLevels() 
        external 
        view 
        onlyRegisteredPatient 
        returns (uint[] memory) 
    {
        return patients[msg.sender].bloodSugarLevels;
    }
    
    // Get patient's encrypted data (only for authorized doctors)
    function getPatientEncryptedData(address _patientAddress) 
        external 
        view 
        onlyRegisteredDoctor 
        returns (
            string[] memory encryptedData,
            string memory publicKey,
            bool hasEncryptedData
        ) 
    {
        require(patients[_patientAddress].isRegistered, "Patient not registered");
        require(patients[_patientAddress].authorizedDoctors[msg.sender], "Doctor not authorized");
        
        return (
            patients[_patientAddress].encryptedBloodSugarLevels,
            patients[_patientAddress].publicKey,
            patients[_patientAddress].hasEncryptedData
        );
    }
    
    // Store computed result
    function storeComputedResult(
        address _patientAddress, 
        string memory _encryptedResult
    ) external onlyRegisteredDoctor {
        require(patients[_patientAddress].authorizedDoctors[msg.sender], "Doctor not authorized");
        
        patientResults[_patientAddress].encryptedResult = _encryptedResult;
        patientResults[_patientAddress].isComputed = true;
        patientResults[_patientAddress].computedByDoctor = msg.sender;
        
        emit ComputationCompleted(_patientAddress, msg.sender);
    }
    
    // Get computed result (for patient)
    function getComputedResult() 
        external 
        view 
        onlyRegisteredPatient 
        returns (
            string memory encryptedResult,
            bool isComputed,
            address computedByDoctor
        ) 
    {
        ComputedResult memory result = patientResults[msg.sender];
        return (result.encryptedResult, result.isComputed, result.computedByDoctor);
    }
    
    // Get patient's secret key
    function getSecretKey() 
        external 
        view 
        onlyRegisteredPatient 
        returns (string memory) 
    {
        return patients[msg.sender].secretKey;
    }
    
    // Get all doctors list
    function getAllDoctors() external view returns (address[] memory) {
        return doctorList;
    }
    
    // Get all patients list (only for doctors)
    function getAllPatients() 
        external 
        view 
        onlyRegisteredDoctor 
        returns (address[] memory) 
    {
        return patientList;
    }
}