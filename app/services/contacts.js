import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'quickaid_emergency_contacts';

export async function getContacts() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    console.log('getContacts raw:', raw);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log('getContacts error:', err.message);
    return [];
  }
}

export async function saveContact(contact) {
  try {
    console.log('saveContact called with:', JSON.stringify(contact));
    const contacts = await getContacts();
    const existing = contacts.findIndex(c => c.id === contact.id);
    if (existing >= 0) {
      contacts[existing] = contact;
    } else {
      contacts.push({ ...contact, id: Date.now().toString() });
    }
    const toSave = JSON.stringify(contacts);
    console.log('About to write:', toSave);
    await AsyncStorage.setItem(KEY, toSave);
    console.log('AsyncStorage.setItem done');
  } catch (err) {
    console.log('saveContact error:', err.message);
    throw err;
  }
}

export async function deleteContact(id) {
  try {
    const contacts = await getContacts();
    const updated = contacts.filter(c => c.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch (err) {
    console.log('deleteContact error:', err.message);
  }
}