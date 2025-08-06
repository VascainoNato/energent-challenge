import express from "express";
import multer from "multer";
import * as XLSX from 'xlsx';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Validating S3 environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials not configured');
}

// S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || 'us-east-2'
});

const S3_BUCKET_NAME = 'my-well-dashboard-uploads';

const upload = multer({ 
  storage: multer.memoryStorage(), 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

function processExcelData(buffer: Buffer) {
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
    
    const processedData = jsonData.map((row: any, index: number) => {
      let depthValue = parseFloat(row.Depth) || parseFloat(row.depth) || parseFloat(row.DEPTH);
      if (!depthValue || depthValue < 1000) {
        depthValue = 1267 + index;
      }
      
      const parseValue = (value: any) => {
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
      depth: Math.max(...processedData.map((d: any) => d.depth)),
      data: processedData
    };
    return wellData;
    
  } catch (error) {
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
    
  } catch (error) {
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

export default router;