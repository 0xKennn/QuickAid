import * as FileSystem from 'expo-file-system/legacy';

const API_BASE = 'https://quickaid-api-1.onrender.com';

// Minimum confidence to accept a result
const CONFIDENCE_THRESHOLD = 0.65;

export async function checkApiHealth() {
  try {
    const res  = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

export async function classifyImage(imageUri) {
  try {
    console.log('Reading image:', imageUri);

    const base64Image = await FileSystem.readAsStringAsync(
      imageUri,
      { encoding: 'base64' }
    );

    console.log('Sending to API...');

    const response = await fetch(`${API_BASE}/classify`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('Result:', result.rawClass, result.confidence);

    // If confidence is below threshold — treat as unrecognized
    if (result.confidence < CONFIDENCE_THRESHOLD) {
      return {
        ...result,
        injuryType: 'Unrecognized',
        severity:   'mild',
        confidence: result.confidence,
        isNormal:   false,
        isUnknown:  true,
      };
    }

    return {
      ...result,
      isUnknown: false,
    };

  } catch (err) {
    console.error('Classification error:', err.message);
    throw err;
  }
}