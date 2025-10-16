import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Category, RootStackParamList } from "../App";

type NhapGiaoDichNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Nhap"
>;
type NhapGiaoDichRouteProp = RouteProp<RootStackParamList, "Nhap">;

const NhapGiaoDich = () => {
  const navigation = useNavigation<NhapGiaoDichNavigationProp>();
  const route = useRoute<NhapGiaoDichRouteProp>();

  // Nhận category và transaction type từ params
  const initialCategory = route.params?.selectedCategory || null;
  const initialTransactionType = route.params?.transactionType || "expense";

  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">(
    initialTransactionType
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory
  );
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedExpense = await AsyncStorage.getItem("expenseCategories");
      const storedIncome = await AsyncStorage.getItem("incomeCategories");

      if (storedExpense) {
        const parsed = JSON.parse(storedExpense);
        setExpenseCategories(parsed);
        // Chỉ set category mặc định nếu chưa có category từ params
        if (!initialCategory && parsed.length > 0) {
          setSelectedCategory(parsed[0]);
        }
      }
      if (storedIncome) {
        setIncomeCategories(JSON.parse(storedIncome));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatAmount = (value: string): string => {
    if (value === "0") return "0";
    // Remove existing commas
    const cleanValue = value.replace(/,/g, "");
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleNumberPress = (num: string) => {
    if (amount === "0") {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleOperatorPress = (op: string) => {
    setAmount(amount + op);
  };

  const handleCalculate = () => {
    try {
      // Remove commas before evaluation
      const cleanAmount = amount.replace(/,/g, "");
      const result = eval(cleanAmount);
      setAmount(result.toString());
    } catch (error) {
      Alert.alert("Lỗi", "Phép tính không hợp lệ");
      setAmount("0");
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleClear = () => {
    setAmount("0");
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục");
      return;
    }

    if (amount === "0" || amount === "") {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền");
      return;
    }

    try {
      // Calculate final amount
      const cleanAmount = amount.replace(/,/g, "");
      const finalAmount = eval(cleanAmount);

      const transaction = {
        id: Date.now().toString(),
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
        categoryColor: selectedCategory.color,
        amount: finalAmount,
        type: activeTab,
        note: note,
        date: date.toISOString(),
        time: time.toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Save to AsyncStorage
      const existingTransactions = await AsyncStorage.getItem("transactions");
      const transactions = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];
      transactions.push(transaction);
      await AsyncStorage.setItem("transactions", JSON.stringify(transactions));

      Alert.alert("Thành công", "Giao dịch đã được lưu", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      // Reset form
      setAmount("0");
      setNote("");
      setDate(new Date());
      setTime(new Date());
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert("Lỗi", "Không thể lưu giao dịch");
    }
  };

  const currentCategories =
    activeTab === "expense" ? expenseCategories : incomeCategories;

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setSelectedCategory(item);
        setShowCategoryModal(false);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={26} color="#fff" />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with gradient effect */}
      <View
        style={[
          styles.header,
          { backgroundColor: selectedCategory?.color || "#1E88E5" },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {activeTab === "expense" ? "Thêm chi tiêu" : "Thêm thu nhập"}
          </Text>

          <TouchableOpacity style={styles.moreButton} activeOpacity={0.8}>
            <Icon name="dots-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Selection */}
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.8}
        >
          {selectedCategory && (
            <>
              <View style={styles.selectedCategoryIconWrapper}>
                <View
                  style={[
                    styles.selectedCategoryIcon,
                    { backgroundColor: selectedCategory.color },
                  ]}
                >
                  <Icon name={selectedCategory.icon} size={36} color="#fff" />
                </View>
              </View>
              <Text style={styles.selectedCategoryName}>
                {selectedCategory.name}
              </Text>
              <Icon
                name="chevron-down"
                size={20}
                color="rgba(255,255,255,0.8)"
              />
            </>
          )}
        </TouchableOpacity>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₫</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.amountText}>{formatAmount(amount)}</Text>
          </ScrollView>
        </View>
      </View>

      {/* Form Section */}
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <TouchableOpacity
            style={styles.formRow}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.formIconWrapper}>
              <Icon name="calendar-blank" size={22} color="#1E88E5" />
            </View>
            <View style={styles.formContent}>
              <Text style={styles.formLabel}>Ngày giao dịch</Text>
              <Text style={styles.formValue}>{formatDate(date)}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#BDBDBD" />
          </TouchableOpacity>

          <View style={styles.formDivider} />

          <TouchableOpacity
            style={styles.formRow}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.formIconWrapper}>
              <Icon name="clock-outline" size={22} color="#1E88E5" />
            </View>
            <View style={styles.formContent}>
              <Text style={styles.formLabel}>Thời gian</Text>
              <Text style={styles.formValue}>{formatTime(time)}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#BDBDBD" />
          </TouchableOpacity>

          <View style={styles.formDivider} />

          <View style={styles.formRow}>
            <View style={styles.formIconWrapper}>
              <Icon name="pencil-outline" size={22} color="#1E88E5" />
            </View>
            <View style={styles.formContent}>
              <Text style={styles.formLabel}>Ghi chú</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Thêm ghi chú (không bắt buộc)"
                placeholderTextColor="#BDBDBD"
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>
        </View>

        {/* Quick Notes */}
        <View style={styles.quickNotesSection}>
          <Text style={styles.quickNotesTitle}>Ghi chú nhanh</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickNotesContainer}>
              {["Ăn trưa", "Ăn tối", "Cà phê", "Xăng xe", "Mua sắm"].map(
                (quickNote) => (
                  <TouchableOpacity
                    key={quickNote}
                    style={styles.quickNoteChip}
                    onPress={() => setNote(quickNote)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickNoteText}>{quickNote}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      {/* Calculator */}
      <View style={styles.calculator}>
        <View style={styles.calculatorRow}>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("7")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("8")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("9")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButtonOperator}
            onPress={() => handleOperatorPress("/")}
            activeOpacity={0.7}
          >
            <Icon name="division" size={24} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("4")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("5")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("6")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButtonOperator}
            onPress={() => handleOperatorPress("*")}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("1")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("2")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("3")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButtonOperator}
            onPress={() => handleOperatorPress("-")}
            activeOpacity={0.7}
          >
            <Icon name="minus" size={24} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonTextSecondary}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => handleNumberPress("0")}
            activeOpacity={0.7}
          >
            <Text style={styles.calcButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={handleBackspace}
            activeOpacity={0.7}
          >
            <Icon name="backspace-outline" size={24} color="#757575" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calcButtonOperator}
            onPress={() => handleOperatorPress("+")}
            activeOpacity={0.7}
          >
            <Icon name="plus" size={24} color="#1E88E5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: selectedCategory?.color || "#1E88E5" },
        ]}
        onPress={handleSave}
        activeOpacity={0.9}
      >
        <Icon name="check-circle" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={[
                  styles.modalTab,
                  activeTab === "expense" && styles.modalTabActive,
                ]}
                onPress={() => setActiveTab("expense")}
                activeOpacity={0.7}
              >
                <Icon
                  name="arrow-up-circle"
                  size={20}
                  color={activeTab === "expense" ? "#F44336" : "#9E9E9E"}
                />
                <Text
                  style={[
                    styles.modalTabText,
                    activeTab === "expense" && styles.modalTabTextActive,
                  ]}
                >
                  Chi tiêu
                </Text>
              </TouchableOpacity>

              <View style={styles.modalDivider} />

              <TouchableOpacity
                style={[
                  styles.modalTab,
                  activeTab === "income" && styles.modalTabActive,
                ]}
                onPress={() => setActiveTab("income")}
                activeOpacity={0.7}
              >
                <Icon
                  name="arrow-down-circle"
                  size={20}
                  color={activeTab === "income" ? "#4CAF50" : "#9E9E9E"}
                />
                <Text
                  style={[
                    styles.modalTabText,
                    activeTab === "income" && styles.modalTabTextActive,
                  ]}
                >
                  Thu nhập
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={4}
              contentContainerStyle={styles.categoryGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: "center",
    marginBottom: 20,
    gap: 8,
  },
  selectedCategoryIconWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCategoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    minHeight: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    marginRight: 8,
  },
  amountText: {
    fontSize: 48,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: -1,
  },
  formContainer: {
    flex: 1,
    marginTop: -16,
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  formIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formContent: {
    flex: 1,
  },
  formLabel: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 4,
    fontWeight: "500",
  },
  formValue: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "600",
  },
  formDivider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginLeft: 68,
  },
  noteInput: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "500",
    padding: 0,
  },
  quickNotesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickNotesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 12,
  },
  quickNotesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  quickNoteChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  quickNoteText: {
    fontSize: 13,
    color: "#424242",
    fontWeight: "500",
  },
  calculator: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  calculatorRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  calcButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  calcButtonOperator: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  calcButtonText: {
    fontSize: 28,
    color: "#212121",
    fontWeight: "400",
  },
  calcButtonTextSecondary: {
    fontSize: 24,
    color: "#757575",
    fontWeight: "600",
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  modalTabActive: {
    backgroundColor: "#F5F5F5",
  },
  modalTabText: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  modalTabTextActive: {
    color: "#212121",
    fontWeight: "700",
  },
  modalDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  categoryGrid: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 12,
    color: "#424242",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default NhapGiaoDich;
