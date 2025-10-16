import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../App";
import { auth, googleProvider } from "../firebaseConfig"; // Giả sử googleProvider được export từ firebaseConfig

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
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
    setLoading(true);
    try {
      // Lưu ý: signInWithPopup không hoạt động trực tiếp trên React Native (dành cho web).
      // Để dùng Google Sign-In trên RN, cần tích hợp @react-native-google-signin/google-signin hoặc expo-google-sign-in.
      // Ở đây giữ signInWithPopup để dựa theo code web, nhưng sẽ alert lỗi nếu không config.
      // Nếu dùng thư viện RN, thay bằng GoogleSignin.signIn() và firebase.auth().signInWithCredential(googleAuthProvider.credential(idToken));
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("✅ Đăng nhập Google thành công:", userCredential.user.email);

      navigation.navigate("Trangchu");
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập Google:", error.code, error.message);
      let errorMessage = "Lỗi đăng nhập Google: " + error.message;
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Bạn đã đóng cửa sổ đăng nhập Google.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Lỗi kết nối mạng khi đăng nhập Google.";
      }
      Alert.alert("Lỗi Google Sign-In", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section with Illustration */}
        <View style={styles.headerSection}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />

          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Icon name="wallet" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitle}>
            Đăng nhập để tiếp tục quản lý chi tiêu
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                isEmailFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="email-outline"
                size={22}
                color={isEmailFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="Nhập email của bạn"
                style={styles.input}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View
              style={[
                styles.inputContainer,
                isPasswordFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="lock-outline"
                size={22}
                color={isPasswordFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="Nhập mật khẩu"
                style={styles.input}
                secureTextEntry={!showPassword}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loginButtonText}>Đang đăng nhập...</Text>
              </>
            ) : (
              <>
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Icon name="google" size={24} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Icon name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Icon name="apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.signUpLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: "#1E88E5",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: 120,
    left: -40,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    bottom: 20,
    right: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "400",
  },
  formSection: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    height: 56,
  },
  inputContainerFocused: {
    borderColor: "#1E88E5",
    backgroundColor: "#fff",
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    marginLeft: 12,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#1E88E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#9E9E9E",
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 15,
    color: "#757575",
    fontWeight: "400",
  },
  signUpLink: {
    fontSize: 15,
    color: "#1E88E5",
    fontWeight: "700",
  },
});

export default LoginScreen;
