# swipe-project

## Overview

This React-based application processes invoices, products, and customer data from various file formats using AI-powered data extraction. It provides a user-friendly interface for managing and viewing extracted information through organized tabs.

## Features

- File upload support for multiple formats:
  - Images (JPEG, PNG, WebP, HEIC/HEIF)
  - Documents (PDF)
  - Spreadsheets (Excel: XLS, XLSX, ODS)
- AI-powered data extraction using Google's Generative AI
- Organized data viewing and management through tabs:
  - Invoices
  - Products
  - Customers
- Real-time data validation
- Editable records with instant updates
- Error boundary protection

## Technology Stack

- React 18
- Redux Toolkit for state management
- Material-UI (MUI) for UI components
- Google Generative AI for data extraction
- PDF.js for PDF processing
- XLSX for Excel file processing
- Tesseract.js for OCR capabilities

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Google Generative AI API key

## Installation

1. Clone the repository
   bash
   git clone <repository-url>
   cd swipe-project

2. Install dependencies
   bash
   npm install
   or
   yarn install

3. Create a `.env` file in the root directory and add your Google Generative AI API key:
   bash
   REACT_APP_GEMINI_API_KEY=your_api_key_here

## Running the Application

For development:

```bash
npm start
```

For production build:

```bash
npm run build
```

## Project Structure

The application follows a feature-based structure:

```
src/
├── components/         # Reusable UI components
├── features/          # Redux slices and related logic
├── services/          # API and utility services
├── store/            # Redux store configuration
└── App.js            # Main application component
```

## Key Components

### File Upload

Handles file selection and processing using AI-powered extraction.
Reference:

```javascript:src/components/FileUpload.js
startLine: 1
endLine: 173
```

### Data Management Tabs

- **Invoices Tab**: Displays processed invoice data
- **Products Tab**: Manages product information
- **Customers Tab**: Handles customer records

### Services

The AI service handles data extraction and validation:

```javascript:src/services/aiService.js
startLine: 1
endLine: 278
```

## State Management

The application uses Redux Toolkit with three main slices:

- Invoices
- Products
- Customers

Each slice manages its respective data with actions for adding, updating, and setting items.

## Error Handling

The application includes:

- Comprehensive error boundaries
- Input validation
- File type verification
- Processing status feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
