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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Trim whitespace
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Lỗi", "Email không đúng định dạng");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      console.log("✅ Đăng nhập thành công:", userCredential.user.email);

      // Clear form
      setEmail("");
      setPassword("");

      navigation.navigate("Trangchu");
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.code, error.message);

      let errorTitle = "Đăng nhập thất bại";
      let errorMessage = "Vui lòng thử lại";

      switch (error.code) {
        case "auth/invalid-email":
          errorTitle = "Email không hợp lệ";
          errorMessage = "Định dạng email không đúng";
          break;
        case "auth/user-disabled":
          errorTitle = "Tài khoản bị khóa";
          errorMessage =
            "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.";
          break;
        case "auth/user-not-found":
          errorTitle = "Tài khoản không tồn tại";
          errorMessage =
            "Email này chưa được đăng ký. Vui lòng tạo tài khoản mới.";
          break;
        case "auth/wrong-password":
          errorTitle = "Sai mật khẩu";
          errorMessage = "Mật khẩu không đúng. Vui lòng thử lại.";
          break;
        case "auth/invalid-credential":
          errorTitle = "Thông tin không chính xác";
          errorMessage =
            "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
          break;
        case "auth/network-request-failed":
          errorTitle = "Lỗi kết nối";
          errorMessage =
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra internet.";
          break;
        case "auth/too-many-requests":
          errorTitle = "Quá nhiều lần thử";
          errorMessage =
            "Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = error.message || "Đã xảy ra lỗi không xác định";
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      "Thông báo",
      "Đăng nhập Google cần cấu hình thêm. Vui lòng sử dụng email/password hoặc tham khảo hướng dẫn thêm."
    );
  };

  return (
    <View style={styles.container}>
      <Icon
        name="credit-card-outline"
        size={60}
        color="#007BFF"
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>

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
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="lock-outline"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password!</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>Login with</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signUpLink}>Don't have an account? Signup</Text>
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
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    width: "80%",
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    color: "#000",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    marginTop: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  forgotPassword: {
    color: "red",
    textAlign: "right",
    width: "80%",
    marginTop: 5,
  },
  signUpText: {
    marginVertical: 12,
    textAlign: "center",
    color: "#000",
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    marginTop: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  signUpLink: {
    marginTop: 14,
    color: "#007BFF",
    textAlign: "center",
  },
});

export default LoginScreen;
