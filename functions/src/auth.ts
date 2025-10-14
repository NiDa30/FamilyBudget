// functions/src/auth.ts
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcryptjs';

export const registerUser = functions.https.onCall(async (data, context) => {
  const { email, password, fullName } = data;
  
  // Validate
  if (!email || !password || password.length < 8) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid input');
  }
  
  // Check existing
  const existingUser = await admin.firestore()
    .collection('users')
    .where('email', '==', email)
    .get();
    
  if (!existingUser.empty) {
    throw new functions.https.HttpsError('already-exists', 'Email exists');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create user
  const userDoc = await admin.firestore().collection('users').add({
    email,
    passwordHash,
    fullName,
    provider: 'email',
    role: 'user',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Send verification email
  await sendVerificationEmail(email);
  
  return { userId: userDoc.id };
});

export const loginUser = functions.https.onCall(async (data, context) => {
  const { email, password } = data;
  
  const userSnapshot = await admin.firestore()
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
    
  if (userSnapshot.empty) {
    throw new functions.https.HttpsError('not-found', 'User not found');
  }
  
  const user = userSnapshot.docs[0].data();
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValid) {
    throw new functions.https.HttpsError('unauthenticated', 'Wrong password');
  }
  
  // Create custom token
  const token = await admin.auth().createCustomToken(userSnapshot.docs[0].id);
  
  return { token, user: { id: userSnapshot.docs[0].id, ...user } };
});