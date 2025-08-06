"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const XLSX = __importStar(require("xlsx"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// Validating S3 environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('AWS credentials not configured');
}
// S3 Configuration
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-2'
});
const S3_BUCKET_NAME = 'my-well-dashboard-uploads';
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        }
        else {
            cb(new Error('Only Excel files are allowed'));
        }
    }
});
function processExcelData(buffer) {
    try {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error('No spreadsheets found in the file');
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error('Spreadsheet not found');
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const processedData = jsonData.map((row, index) => {
            let depthValue = parseFloat(row.Depth) || parseFloat(row.depth) || parseFloat(row.DEPTH);
            if (!depthValue || depthValue < 1000) {
                depthValue = 1267 + index;
            }
            const parseValue = (value) => {
                if (typeof value === 'string') {
                    return parseFloat(value.replace(',', '.')) || 0;
                }
                return parseFloat(value) || 0;
            };
            const processed = {
                depth: depthValue,
                SH: parseValue(row.SH || row['%SH']) * 100,
                SS: parseValue(row.SS || row['%SS']) * 100,
                LS: parseValue(row.LS || row['%LS']) * 100,
                DOL: parseValue(row.DOL || row['%DOL']) * 100,
                ANH: parseValue(row.ANH || row['%ANH']) * 100,
                Coal: parseValue(row.Coal || row['%Coal']) * 100,
                Salt: parseValue(row.Salt || row['%Salt']) * 100,
                DT: parseValue(row.DT),
                GR: parseValue(row.GR),
                MINFINAL: parseInt(row.MINFINAL) || 0,
                UCS: parseValue(row.UCS),
                FA: parseValue(row.FA),
                RAT: parseValue(row.RAT),
                ROP: parseValue(row.ROP),
            };
            return processed;
        });
        const wellData = {
            id: `well-${Date.now()}`,
            name: `Well ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            depth: Math.max(...processedData.map((d) => d.depth)),
            data: processedData
        };
        return wellData;
    }
    catch (error) {
        throw new Error('Error processing Excel file');
    }
}
router.post("/well-data", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        // Processa o arquivo Excel
        const wellData = processExcelData(req.file.buffer);
        // Salva o arquivo no S3
        const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'private', // Arquivo privado por padrão
        };
        const s3Result = await s3.upload(s3Params).promise();
        res.json({
            success: true,
            message: "File processed and uploaded successfully",
            wells: [wellData],
            s3Url: s3Result.Location, // URL do arquivo no S3
            s3Key: s3Result.Key // Chave do arquivo no S3
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        // Tratamento específico para erros do S3
        if (error instanceof Error && error.message.includes('S3')) {
            return res.status(500).json({
                success: false,
                message: "Error uploading file to S3. Please check your AWS configuration."
            });
        }
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Error processing file"
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map