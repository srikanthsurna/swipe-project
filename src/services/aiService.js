import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Define supported file types
export const SUPPORTED_MIMETYPES = {
  // Images
  "image/jpeg": ".jpg,.jpeg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",

  // PDFs
  "application/pdf": ".pdf",

  // Excel files
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
  "application/msexcel": ".xls",
  "application/x-excel": ".xls",
  "application/x-msexcel": ".xls",
  "application/vnd.oasis.opendocument.spreadsheet": ".ods",
};

const isExcelFile = (mimeType) => {
  return [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/msexcel",
    "application/x-excel",
    "application/x-msexcel",
    "application/vnd.oasis.opendocument.spreadsheet",
  ].includes(mimeType);
};

const isImageFile = (mimeType) => {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ].includes(mimeType);
};

const isPDFFile = (mimeType) => {
  return mimeType === "application/pdf";
};

const processExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Convert Excel data to structured text
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1);

        let textContent = "";
        rows.forEach((row) => {
          headers.forEach((header, index) => {
            if (row[index]) {
              textContent += `${header}: ${row[index]}\n`;
            }
          });
          textContent += "\n";
        });

        resolve(textContent);
      } catch (error) {
        reject(new Error(`Excel processing failed: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read Excel file"));
    reader.readAsArrayBuffer(file);
  });
};

const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64String = reader.result.split(",")[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      } catch (error) {
        reject(new Error(`File conversion failed: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const extractDataFromFile = async (file) => {
  try {
    console.log("Processing file:", file.name, "Type:", file.type);

    // Validate file type
    if (!SUPPORTED_MIMETYPES[file.type]) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    let content;
    let prompt;

    // Handle different file types
    if (isExcelFile(file.type)) {
      console.log("Processing Excel file");
      const textContent = await processExcelFile(file);
      content = { text: textContent };
      prompt = `Extract invoice information from this Excel data and format as JSON:`;
    } else if (isImageFile(file.type) || isPDFFile(file.type)) {
      console.log(`Processing ${isPDFFile(file.type) ? "PDF" : "image"} file`);
      content = await fileToGenerativePart(file);
      prompt = `Extract all text from this invoice ${
        isPDFFile(file.type) ? "PDF" : "image"
      } and format as JSON:`;
    } else {
      throw new Error("Unsupported file type");
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    prompt += `
    {
      "invoice": {
        "serialNumber": "",
        "customerName": "",
        "productName": "",
        "quantity": 0,
        "tax": 0,
        "totalAmount": 0,
        "date": ""
      },
      "product": {
        "name": "",
        "quantity": 0,
        "unitPrice": 0,
        "tax": 0
      },
      "customer": {
        "name": "",
        "phoneNumber": "",
        "email": "",
        "totalPurchaseAmount": 0
      }
    }
    
    Rules:
    - Use empty strings for missing text
    - Use 0 for missing numbers
    - Format dates as YYYY-MM-DD
    - Ensure response is valid JSON
    - For Excel data, match column headers to fields
    - For images/PDFs, extract all visible text first
    - Look for common invoice fields like "Invoice No", "Bill To", "Amount", etc.
    - Ensure all the products are included in the response.
    - Ensure all the customers are included in the response.
    - Ensure all the invoices are included in the response.`;

    console.log("Sending to Gemini...");
    const result = await model.generateContent([content, { text: prompt }]);

    const response = await result.response;
    const text = response.text();
    console.log("AI Response:", text);

    // Parse and validate response
    try {
      const parsedData = JSON.parse(text);
      console.log("Successfully parsed data:", parsedData);
      return parsedData;
    } catch (parseError) {
      console.log("Direct JSON parse failed, trying to extract JSON from text");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted JSON:", extractedJson);
          return extractedJson;
        } catch (e) {
          console.error("Failed to parse extracted JSON:", e);
          throw new Error("Invalid JSON format in AI response");
        }
      }
      throw new Error("Could not extract valid JSON from AI response");
    }
  } catch (error) {
    console.error("Processing error:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
};

export const validateExtractedData = (data) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!data.invoice?.serialNumber) errors.push("Missing invoice number");
  if (!data.invoice?.date) errors.push("Missing invoice date");
  if (!data.invoice?.totalAmount) errors.push("Missing total amount");

  // Customer data validation
  if (!data.customer?.name) {
    errors.push("Missing customer name");
  } else if (data.customer.name.length < 2) {
    warnings.push("Customer name seems too short");
  }

  if (!data.customer?.phoneNumber && !data.customer?.email) {
    errors.push("Missing customer contact information");
  } else {
    if (data.customer?.email && !data.customer.email.includes("@")) {
      warnings.push("Invalid email format");
    }
    if (data.customer?.phoneNumber && data.customer.phoneNumber.length < 10) {
      warnings.push("Phone number seems incomplete");
    }
  }

  // Product data validation
  if (!data.product?.name) {
    errors.push("Missing product name");
  }
  if (!data.product?.quantity || data.product.quantity <= 0) {
    errors.push("Invalid product quantity");
  }
  if (!data.product?.unitPrice || data.product.unitPrice <= 0) {
    errors.push("Invalid unit price");
  }

  // Amount validation
  if (data.invoice?.totalAmount <= 0) {
    errors.push("Invalid total amount");
  }
  if (data.invoice?.tax < 0) {
    warnings.push("Negative tax amount");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completeness: calculateCompleteness(data),
  };
};

const calculateCompleteness = (data) => {
  const totalFields = 11; // Total number of important fields
  let filledFields = 0;

  // Count filled fields
  if (data.invoice?.serialNumber) filledFields++;
  if (data.invoice?.date) filledFields++;
  if (data.invoice?.totalAmount > 0) filledFields++;
  if (data.invoice?.tax >= 0) filledFields++;
  if (data.customer?.name) filledFields++;
  if (data.customer?.phoneNumber) filledFields++;
  if (data.customer?.email) filledFields++;
  if (data.product?.name) filledFields++;
  if (data.product?.quantity > 0) filledFields++;
  if (data.product?.unitPrice > 0) filledFields++;
  if (data.product?.tax >= 0) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
};
