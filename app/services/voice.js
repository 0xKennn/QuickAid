import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import * as Speech from 'expo-speech';

export const COMMANDS = {
  en: {
    next:    ['next', 'next step', 'continue', 'forward'],
    back:    ['back', 'previous', 'go back'],
    repeat:  ['repeat', 'again', 'say again'],
    readAll: ['read all', 'read all steps', 'read everything', 'read the steps'],
    stop:    ['stop', 'quiet', 'silence'],
    help:    ['help', 'call for help', 'emergency', 'call 911'],
  },
  fil: {
    next:    ['susunod', 'next', 'magpatuloy'],
    back:    ['bumalik', 'back', 'nakaraan'],
    repeat:  ['ulitin', 'repeat', 'sabihin ulit'],
    readAll: ['basahin lahat', 'basahin lahat ng hakbang', 'basahin ang lahat'],
    stop:    ['tigil', 'stop', 'tahan'],
    help:    ['tulong', 'humingi ng tulong', 'emergency'],
  },
  ceb: {
    next:    ['sunod', 'padayon', 'next'],
    back:    ['balik', 'balika', 'back'],
    repeat:  ['usba', 'balika ang sinulti', 'repeat'],
    readAll: ['basaha tanan', 'basaha ang tanan', 'basaha tanan nga lakang'],
    stop:    ['hunong', 'undang', 'stop'],
    help:    ['tabang', 'pangayo og tabang', 'emergency'],
  },
};

export function matchCommand(transcript, lang = 'en') {
  const text  = transcript.toLowerCase().trim();
  const vocab = COMMANDS[lang] || COMMANDS.en;

  // Check multi-word / longer phrases before shorter ones, so e.g.
  // "read all steps" can't accidentally get swallowed by a shorter
  // unrelated phrase first. We do this by checking longest phrases first
  // across all commands.
  const allPhrases = [];
  for (const [command, phrases] of Object.entries(vocab)) {
    for (const phrase of phrases) {
      allPhrases.push({ command, phrase });
    }
  }
  allPhrases.sort((a, b) => b.phrase.length - a.phrase.length);

  for (const { command, phrase } of allPhrases) {
    if (text.includes(phrase)) return command;
  }
  return null;
}

export async function startListening(lang = 'en') {
  const granted = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  if (!granted.granted) throw new Error('Microphone permission denied');
  await ExpoSpeechRecognitionModule.start({
    lang: lang === 'fil' ? 'fil-PH' : 'en-US',
    interimResults: false,
    continuous: false,
  });
}

export async function stopListening() {
  await ExpoSpeechRecognitionModule.stop();
}

export async function speak(text, lang = 'en') {
  await Speech.stop();
  return new Promise(resolve => {
    Speech.speak(text, {
      language: lang === 'fil' ? 'fil-PH' : 'en-US',
      rate: 0.9,
      onDone:  resolve,
      onError: resolve,
    });
  });
}

export async function stopSpeaking() {
  await Speech.stop();
}