# QuickAid

QuickAid is a mobile first-aid assistance application developed using **React Native (Expo)**. It combines **artificial intelligence**, **image classification**, and **interactive first-aid guidance** to help users quickly identify common injuries and receive appropriate emergency care instructions.

The application is designed to provide immediate assistance during emergency situations by recognizing wounds through the device camera, recommending first-aid procedures, and allowing users to interact with an AI-powered chatbot for additional guidance.

---

# Features

## AI Injury Detection
- Capture or upload an image of an injury.
- Uses a TensorFlow Lite / TensorFlow.js image classification model.
- Detects common wound types such as:
  - Burns
  - Abrasions
  - Lacerations
  - Bruises
  - Normal Skin
- Displays prediction confidence.

---

## First Aid Guide

Provides evidence-based first aid instructions for detected injuries including:

- Immediate treatment steps
- Recommended supplies
- Safety reminders
- Severity indicators
- Recovery tips

---

## AI Chat Assistant

Integrated chatbot that allows users to:

- Ask first aid questions
- Receive emergency guidance
- Learn proper treatment procedures
- Obtain health-related recommendations

---

## User Authentication

Powered by Firebase Authentication.

Users can:

- Register
- Login
- Manage profile information
- Securely access personal data

---

## Cloud Database

Firebase Firestore stores:

- User information
- Scan history
- Chat history
- Profile data

---

## 📷 Camera Integration

Uses Expo Camera for:

- Capturing injury images
- Image preview
- Classification pipeline

---

## 🧠 Machine Learning

The application uses a custom-trained image classification model built using TensorFlow.

Model workflow:

```
Image
      ↓
Image Preprocessing
      ↓
TensorFlow Model
      ↓
Predicted Injury
      ↓
First Aid Recommendation
```

---

# Technologies Used

| Technology | Purpose |
|------------|---------|
| React Native | Mobile Development |
| Expo SDK 54 | Cross-platform framework |
| Firebase Authentication | User login |
| Firestore | Database |
| TensorFlow.js | Image Classification |
| Expo Camera | Camera Access |
| Expo File System | Image Processing |
| React Navigation | Navigation |
| Lucide Icons | UI Icons |

---

# Project Structure

```
QuickAid
│
├── app
│   ├── components
│   ├── navigation
│   ├── screens
│   │     ├── auth
│   │     ├── user
│   │     ├── admin
│   │     └── chat
│   ├── services
│   │     ├── classifier.js
│   │     ├── firebase.js
│   │     └── chatbot.js
│   └── utils
│
├── assets
│   ├── images
│   └── model
│        ├── model.json
│        ├── group1-shard1ofX.bin
│        └── labels.json
│
├── App.js
├── package.json
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/0xKennn/QuickAid.git
```

---

## Navigate to the Project

```bash
cd QuickAid
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
npm install --legacy-peer-deps
```

(if TensorFlow dependencies produce peer dependency warnings)

---

## Install Expo Dependencies

```bash
npx expo install
```

---

## Start Development Server

```bash
npx expo start
```

Choose:

- Android Emulator
- Physical Android Device
- Expo Go (where compatible)

---

# Required Packages

Main packages include:

```text
expo
react-native
firebase
@react-navigation/native
@tensorflow/tfjs
@tensorflow/tfjs-react-native
expo-camera
expo-file-system
expo-gl
expo-gl-cpp
react-native-svg
```

---

# Firebase Configuration

Create a Firebase project.

Enable:

- Authentication
- Firestore Database
- Storage (optional)

Update the Firebase configuration inside:

```
app/services/firebase.js
```

with your Firebase credentials.

---

# TensorFlow Model

The model files should be placed inside:

```
assets/model/
```

Required files:

```
model.json
labels.json
group1-shard1ofX.bin
```

These files are loaded using:

```javascript
bundleResourceIO(modelJson, modelWeights)
```

---

# Running the Image Classifier

The classifier performs the following steps:

1. Capture image
2. Read image using Expo FileSystem
3. Decode JPEG
4. Resize to 224 × 224
5. Normalize pixel values
6. Run TensorFlow prediction
7. Display injury prediction
8. Show first aid recommendations

---

# Usage

## User

1. Register/Login
2. Open Camera
3. Capture injury image
4. Wait for AI prediction
5. View recommended first aid
6. Ask additional questions using the chatbot

---

## Administrator

The administrator can:

- Manage users
- View scan history
- Monitor application usage
- Maintain emergency information
- Manage chatbot responses (if applicable)

---

# Dataset

The image classification model was trained using a custom wound dataset exported from Roboflow.

Detected classes include:

- Burn
- Abrasion
- Laceration
- Bruise
- Normal Skin

---

# Future Improvements

- Offline image classification
- Multi-language support
- Emergency hospital locator
- GPS integration
- Voice assistant
- Medical professional consultation
- Expanded injury dataset
- Improved classification accuracy

---

# Contributors

QuickAid was developed as part of an academic capstone project.

Contributors:

- Project Developers
- Faculty Adviser
- Research Team

(Add team member names here.)

---

# License

This project is intended for educational and research purposes.

QuickAid should **not** replace professional medical advice, diagnosis, or emergency medical services. Always seek assistance from qualified healthcare professionals during serious medical emergencies.

---

# Disclaimer

The AI predictions generated by QuickAid are intended only as decision-support tools and may not always be accurate. Users should verify recommendations with appropriate medical professionals whenever possible.
