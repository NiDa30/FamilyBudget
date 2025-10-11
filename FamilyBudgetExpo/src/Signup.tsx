import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (
    password: string
  ): { color: string; text: string } => {
    if (password.length === 0) return { color: "#999", text: "" };
    if (password.length < 6) return { color: "#f44336", text: "Quá yếu" };
    if (password.length < 8) return { color: "#ff9800", text: "Yếu" };

    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasNumber && hasLetter && hasSpecial) {
      return { color: "#4caf50", text: "Mạnh" };
    }
    return { color: "#ffc107", text: "Trung bình" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignUp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedUsername) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người dùng");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Lỗi", "Email không đúng định dạng");
      return;
    }

    if (!trimmedPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      await updateProfile(userCredential.user, {
        displayName: trimmedUsername,
      });

      console.log("✅ Đăng ký thành công:", userCredential.user.email);

      Alert.alert(
        "🎉 Chúc mừng!",
        `Chào mừng ${trimmedUsername}! Tài khoản của bạn đã được tạo thành công.`,
        [
          {
            text: "Đăng nhập ngay",
            onPress: () => {
              setUsername("");
              setEmail("");
              setPassword("");
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.code);

      let errorTitle = "Lỗi đăng ký";
      let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
      let showLoginButton = false;

      switch (error.code) {
        case "auth/email-already-in-use":
          errorTitle = "Email đã được sử dụng";
          errorMessage =
            "Email này đã được đăng ký. Bạn có muốn đăng nhập không?";
          showLoginButton = true;
          break;
        case "auth/invalid-email":
          errorTitle = "Email không hợp lệ";
          errorMessage = "Định dạng email không đúng. Vui lòng kiểm tra lại.";
          break;
        case "auth/operation-not-allowed":
          errorTitle = "Tính năng chưa được bật";
          errorMessage =
            "Đăng ký bằng email/password chưa được kích hoạt. Vui lòng liên hệ quản trị viên.";
          break;
        case "auth/weak-password":
          errorTitle = "Mật khẩu yếu";
          errorMessage =
            "Mật khẩu quá đơn giản. Vui lòng sử dụng mật khẩu mạnh hơn (ít nhất 6 ký tự).";
          break;
        case "auth/network-request-failed":
          errorTitle = "Lỗi kết nối";
          errorMessage =
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.";
          break;
        case "auth/too-many-requests":
          errorTitle = "Quá nhiều yêu cầu";
          errorMessage =
            "Bạn đã thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.";
          break;
        default:
          errorMessage = error.message || "Đã xảy ra lỗi không xác định.";
      }

      if (showLoginButton) {
        Alert.alert(errorTitle, errorMessage, [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert(errorTitle, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name="credit-card-outline"
        size={60}
        color="#007BFF"
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.title}>Sign Up</Text>

      {/* Username */}
      <View style={styles.inputContainer}>
        <Icon
          name="account-outline"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Tên người dùng"
          style={styles.input}
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
        />
        {username.length > 0 && (
          <Icon name="check-circle" size={20} color="#4caf50" />
        )}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Icon
          name="email-outline"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {email.length > 0 && isValidEmail(email) && (
          <Icon name="check-circle" size={20} color="#4caf50" />
        )}
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Icon
          name="lock-outline"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Mật khẩu (ít nhất 6 ký tự)"
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Password Strength Indicator */}
      {password.length > 0 && (
        <View style={styles.passwordStrengthContainer}>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthBarFill,
                {
                  width: `${Math.min((password.length / 12) * 100, 100)}%`,
                  backgroundColor: passwordStrength.color,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.strengthText, { color: passwordStrength.color }]}
          >
            {passwordStrength.text}
          </Text>
        </View>
      )}

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.signUpText}>Hoặc đăng ký với</Text>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleButton} disabled={loading}>
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>TIẾP TỤC VỚI GOOGLE</Text>
      </TouchableOpacity>

      {/* Link to Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      >
        <Text style={styles.signUpLink}>
          Đã có tài khoản? <Text style={styles.signUpLinkBold}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    width: "85%",
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: "#000",
    fontSize: 15,
  },
  passwordStrengthContainer: {
    width: "85%",
    marginBottom: 15,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 5,
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 2,
    // transition: 'width 0.3s ease',
  },
  strengthText: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    width: "85%",
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  signUpText: {
    marginVertical: 15,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 8,
    width: "85%",
    marginTop: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  signUpLink: {
    marginTop: 20,
    color: "#666",
    textAlign: "center",
    fontSize: 14,
  },
  signUpLinkBold: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
