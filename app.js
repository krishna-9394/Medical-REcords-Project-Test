


const express = require("express");
const { Web3 } = require("web3");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const contractAddress = process.env.CONTRACT_ADDRESS
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "BloodSugarAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctorAddress",
                "type": "address"
            }
        ],
        "name": "ComputationCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctorAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "DoctorRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            }
        ],
        "name": "EncryptionKeysSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "PatientRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "doctorList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "doctors",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "specialization",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "patientList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "patientResults",
        "outputs": [
            {
                "internalType": "string",
                "name": "encryptedResult",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isComputed",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "computedByDoctor",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "patients",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "publicKey",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "secretKey",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "hasEncryptedData",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "registerPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "isPatient",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "isDoctor",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_specialization",
                "type": "string"
            }
        ],
        "name": "registerDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "addBloodSugarLevel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_publicKey",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_secretKey",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "_encryptedLevels",
                "type": "string[]"
            }
        ],
        "name": "setEncryptionData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_doctorAddress",
                "type": "address"
            }
        ],
        "name": "authorizeDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_doctorAddress",
                "type": "address"
            }
        ],
        "name": "revokeDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMyBloodSugarLevels",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_patientAddress",
                "type": "address"
            }
        ],
        "name": "getPatientEncryptedData",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "encryptedData",
                "type": "string[]"
            },
            {
                "internalType": "string",
                "name": "publicKey",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "hasEncryptedData",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_patientAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_encryptedResult",
                "type": "string"
            }
        ],
        "name": "storeComputedResult",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getComputedResult",
        "outputs": [
            {
                "internalType": "string",
                "name": "encryptedResult",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isComputed",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "computedByDoctor",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getSecretKey",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getAllDoctors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getAllPatients",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

const web3 = new Web3(process.env.GANACHE_RPC_URL || "http://127.0.0.1:7545");
const healthcareContract = new web3.eth.Contract(contractABI, contractAddress);

app.post("/api/patient/register", async (req, res) => {
    const { address, name } = req.body;
    try {
        // let gasEstimate = await healthcareContract.methods.registerPatient(name).estimateGas({ from: address });
        // Convert gasEstimate to a string or number (to prevent BigInt serialization issues)
        // gasEstimate = bigIntToString(gasEstimate); // or you could use Number(gasEstimate)

        // Execute the transaction with the estimated gas limit
        const tx = await healthcareContract.methods.registerPatient(name).send({
            from: address,
            gas: 6721975, // Pass gasEstimate as a string
        });

        res.json({ success: true, transaction: tx });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Check if the address is a registered patient
app.post("/api/patient/isPatient", async (req, res) => {
    const { address } = req.body;
    try {
        const isPatient = await healthcareContract.methods.isPatient(address).call();
        res.json({ success: true, isPatient });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Check if the address is a registered doctor
app.post("/api/doctor/isDoctor", async (req, res) => {
    const { address } = req.body;
    try {
        const isDoctor = await healthcareContract.methods.isDoctor(address).call();
        res.json({ success: true, isDoctor });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post("/api/doctor/register", async (req, res) => {
    const { address, name, specialization } = req.body;
    try {

        const tx = await healthcareContract.methods.registerDoctor(name, specialization).send({ from: address, gas: 6721975, });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post("/api/patient/blood-sugar", async (req, res) => {
    const { address, value } = req.body;
    try {
        const tx = await healthcareContract.methods.addBloodSugarLevel(value).send({ from: address });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get("/api/patient/blood-sugar/:address", async (req, res) => {
    try {
        const levels = await healthcareContract.methods.getMyBloodSugarLevels().call({ from: req.params.address });
        res.json({ success: true, data: levels });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get("/api/doctors", async (req, res) => {
    try {
        const doctors = await healthcareContract.methods.getAllDoctors().call();
        res.json({ success: true, data: doctors });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

function bigIntToString(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Connected to contract at: ${contractAddress}`);
});