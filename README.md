# MedCypher

MedCypher is a mobile medical document digitization app powered by on-device vision language models (VLMs). It enables clinicians and researchers to capture medical records with their camera and automatically extract structured data — all without sending patient data to any external server.

> **Privacy First**: All AI processing happens entirely on-device. Patient records, images, and extracted data never leave the device.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Extracted Fields](#extracted-fields)
- [Installation](#installation)
- [Usage](#usage)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- **On-Device OCR**: Extract medical data from document images using local vision language models — no internet required.
- **Structured Extraction**: Automatically identifies and categorizes 90+ medical fields including lab values, examination findings, SCORAD scores, and diagnoses.
- **Camera Capture**: Capture medical documents directly within the app.
- **Privacy Guaranteed**: No data leaves the device. Fully HIPAA-friendly by design.
- **Cross-Platform**: Supports both iOS and Android.
- **Offline Operation**: Works entirely without an internet connection after initial setup.

## How It Works

1. **Capture** — Point the camera at a medical document or form.
2. **Process** — A vision language model running on-device reads the document image.
3. **Extract** — Structured data is extracted into a JSON object with labelled fields.
4. **Review** — View, verify, and use the extracted results within the app.

## Extracted Fields

MedCypher is tuned to extract the following categories of medical data:

| Category | Examples |
|---|---|
| **Numerical scores** | SCORAD components (Erythema, Edema, Excoriations, Oozing, Dryness, Lichenification), Final SCORAD, subjective symptom scores |
| **Lab investigations** | Hb, Na, K, TLC, DLC, ESR, Platelet, Urea, Creatinine, ALT, FBS, Serum IgE, Serum Proteins, Serum Bilirubin, ANA, G6PD |
| **Measurements** | Birth Weight, Weight, Height, Body Surface Area Involved |
| **Examination findings** | Pulse, BP, Pallor, Cyanosis, Jaundice, Lymph Nodes; Systemic (Chest, CVS, Abdomen, CNS, Musculoskeletal); Cutaneous (Face, Scalp, Trunk, Extremities, Flexures, Palms, Soles, Nails, Mucous Membrane, Genital, Peri-anal, Nasal) |
| **Clinical history** | Duration, Site of Onset, Mode of Spread, Symptoms, Treatment History, Family History, Past History, Vaccination, Socio-Economic Status |
| **Diagnosis** | Provisional Diagnosis, Final Diagnosis |
| **Investigations** | Biopsy/Histopathology, Immunofluorescence, Chest X-ray, ECG, Echo, Ultrasound, MRI, Urine RE/ME |
| **Follow-up notes** | Treatment & Follow-up, Follow-up visits 2–5 |

## Installation

### iOS

*Coming soon on the App Store.*

### Android

*Coming soon on Google Play.*

## Usage

### Capturing a Document

1. Open the app and navigate to **Medical OCR**.
2. Tap **Capture** to open the camera.
3. Frame the medical document clearly within the viewfinder and capture.

### Processing

- The app will automatically process the captured image using the on-device model.
- A loading screen will indicate progress during extraction.

### Viewing Results

- Extracted fields are displayed in a structured results view.
- Each field is labeled and categorized (numerical, measurement, or text).
- Fields not found in the document are shown as empty.

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn**
- **React Native CLI**
- **Xcode** (for iOS)
- **Android Studio** (for Android)

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rijulsr/medcypher
   cd medcypher
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Install Pod Dependencies (iOS only)**

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the App**

   ```bash
   # iOS
   yarn ios

   # Android
   yarn android
   ```

### Scripts

```bash
yarn start        # Start Metro bundler
yarn ios          # Run on iOS simulator
yarn android      # Run on Android emulator
yarn test         # Run tests
yarn lint         # Lint the codebase
yarn typecheck    # TypeScript type check
yarn clean        # Clean build artifacts
```

## Contributing

Contributions are welcome. Please read the [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using Conventional Commits: `git commit -m "feat: add new extraction field"`
4. Push and open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
