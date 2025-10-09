const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Register user with email/password
 * @param {object} data - User registration data
 * @param {object} context - Function context
 * @return {Promise<object>}
 */
exports.registerUser = functions.https.onCall(async (data, context) => {
  const {email, password, fullName} = data;

  // Validation
  if (!email || !password || password.length < 8) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid email or password (min 8 chars)",
    );
  }

  try {
    // Check if user exists
    const existingUser = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (!existingUser.empty) {
      throw new functions.https.HttpsError(
          "already-exists",
          "Email already registered",
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: fullName,
    });

    // Create Firestore document
    await db.collection("users").doc(userRecord.uid).set({
      email: email,
      passwordHash: passwordHash,
      fullName: fullName,
      provider: "email",
      role: "user",
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send verification email
    await admin.auth().generateEmailVerificationLink(email);

    return {
      success: true,
      userId: userRecord.uid,
      message: "User registered successfully. Please verify email.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Login user with email/password
 * @param {object} data - Login credentials
 * @param {object} context - Function context
 * @return {Promise<object>}
 */
exports.loginUser = functions.https.onCall(async (data, context) => {
  const {email, password} = data;

  try {
    // Get user from Firestore
    const userSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (userSnapshot.empty) {
      throw new functions.https.HttpsError("not-found", "User not found");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if active
    if (!userData.isActive) {
      throw new functions.https.HttpsError(
          "permission-denied",
          "Account is disabled",
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
        password,
        userData.passwordHash,
    );

    if (!isValidPassword) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Invalid password",
      );
    }

    // Create custom token
    const customToken = await admin.auth().createCustomToken(userDoc.id);

    // Update last login
    await db.collection("users").doc(userDoc.id).update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      token: customToken,
      user: {
        id: userDoc.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// ============================================
// BUDGET TRACKING FUNCTIONS
// ============================================

/**
 * Check budget daily (scheduled at 8 PM)
 */
exports.scheduledBudgetCheck = functions.pubsub
    .schedule("0 20 * * *")
    .timeZone("Asia/Ho_Chi_Minh")
    .onRun(async (context) => {
      console.log("Running daily budget check...");

      try {
        const usersSnapshot = await db.collection("users").get();

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;

          // Get user's budget
          const budgetSnapshot = await db
              .collection("users")
              .doc(userId)
              .collection("budgets")
              .where("isActive", "==", true)
              .limit(1)
              .get();

          if (budgetSnapshot.empty) continue;

          const budget = budgetSnapshot.docs[0].data();

          // Get current month expenses
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const expensesSnapshot = await db
              .collection("users")
              .doc(userId)
              .collection("expenses")
              .where("date", ">=", startOfMonth)
              .get();

          // Calculate expenses by category
          const expensesByCategory = {};
          expensesSnapshot.docs.forEach((doc) => {
            const expense = doc.data();
            expensesByCategory[expense.categoryId] =
            (expensesByCategory[expense.categoryId] || 0) + expense.amount;
          });

          // Check each category
          for (const [categoryId, limit] of Object.entries(budget.limits)) {
            const spent = expensesByCategory[categoryId] || 0;
            const percent = (spent / limit) * 100;

            // Send notification if over 80%
            if (percent >= 80 && percent < 100) {
              await sendNotification(userId, {
                title: "⚠️ Cảnh báo chi tiêu",
                body: `Bạn đã chi ${percent.toFixed(0)}% hạn mức.`,
              });
            } else if (percent >= 100) {
              await sendNotification(userId, {
                title: "🚨 Vượt hạn mức",
                body: `Bạn đã vượt ${(spent - limit).toLocaleString()} ₫.`,
              });
            }
          }
        }

        console.log("Budget check completed");
        return null;
      } catch (error) {
        console.error("Budget check error:", error);
        return null;
      }
    });

/**
 * Send notification to user
 * @param {string} userId - User ID
 * @param {object} notification - Notification object
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @return {Promise<void>}
 */
async function sendNotification(userId, {title, body}) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const fcmToken = userDoc.data().fcmToken;

    if (!fcmToken) return;

    await admin.messaging().send({
      token: fcmToken,
      notification: {title, body},
      android: {
        priority: "high",
        notification: {
          sound: "default",
          color: "#4CAF50",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    });

    console.log(`Notification sent to user ${userId}`);
  } catch (error) {
    console.error("Notification error:", error);
  }
}

// ============================================
// EMAIL FUNCTIONS
// ============================================

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
});

/**
 * Send email to user
 * @param {object} data - Email data
 * @param {object} context - Function context
 * @return {Promise<object>}
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Verify authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be logged in",
    );
  }

  const {email, subject, body} = data;

  const mailOptions = {
    from: "Expense Tracker <noreply@expensetracker.com>",
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
              color: white; 
              padding: 30px 20px; 
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content { 
              padding: 30px 20px; 
              background: #f5f5f5;
              border-radius: 0 0 8px 8px;
            }
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #757575; 
              font-size: 12px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>💰 Expense Tracker</h2>
            </div>
            <div class="content">
              <p>${body}</p>
            </div>
            <div class="footer">
              <p>Bạn nhận được email này vì đã đăng ký nhận thông báo.</p>
              <p><a href="#">Hủy đăng ký</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Email error:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email");
  }
});

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

/**
 * Get admin statistics
 * @param {object} data - Request data
 * @param {object} context - Function context
 * @return {Promise<object>}
 */
exports.getAdminStats = functions.https.onCall(async (data, context) => {
  // Verify admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be logged in",
    );
  }

  const userDoc = await db.collection("users").doc(context.auth.uid).get();

  if (userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }

  try {
    // Total users
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;

    // New users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newUsersSnapshot = await db
        .collection("users")
        .where("createdAt", ">=", startOfMonth)
        .get();
    const newUsersThisMonth = newUsersSnapshot.size;

    // Active users (logged in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsersSnapshot = await db
        .collection("users")
        .where("lastLoginAt", ">=", sevenDaysAgo)
        .get();
    const activeUsers = activeUsersSnapshot.size;

    // Total transactions today
    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    let todayTransactions = 0;

    for (const userDoc of usersSnapshot.docs) {
      const expensesSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("expenses")
          .where("date", ">=", startOfDay)
          .get();
      todayTransactions += expensesSnapshot.size;
    }

    return {
      totalUsers,
      newUsersThisMonth,
      activeUsers,
      todayTransactions,
    };
  } catch (error) {
    console.error("Stats error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
