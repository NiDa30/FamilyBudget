import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Category } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
type HomeRouteProp = RouteProp<RootStackParamList, "Home">;

// Định nghĩa categories mặc định cho CHI TIÊU
const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: "1", name: "Ăn uống", icon: "food-apple", color: "#FF6347", count: 29 },
  { id: "2", name: "Quần áo", icon: "tshirt-crew", color: "#32CD32", count: 5 },
  {
    id: "3",
    name: "Hoa quả",
    icon: "fruit-cherries",
    color: "#00CED1",
    count: 3,
  },
  { id: "4", name: "Mua sắm", icon: "shopping", color: "#FF69B4", count: 4 },
  { id: "5", name: "Giao thông", icon: "bus", color: "#ADFF2F", count: 2 },
  { id: "6", name: "Nhà ở", icon: "home", color: "#FFA500", count: 6 },
  { id: "7", name: "Du lịch", icon: "airplane", color: "#20B2AA", count: 1 },
  {
    id: "8",
    name: "Rượu và đồ uống",
    icon: "glass-wine",
    color: "#BA55D3",
    count: 2,
  },
  {
    id: "9",
    name: "Chi phí điện nước",
    icon: "water",
    color: "#4682B4",
    count: 3,
  },
  { id: "10", name: "Quà", icon: "gift", color: "#FF4500", count: 2 },
  { id: "11", name: "Giáo dục", icon: "school", color: "#FFD700", count: 1 },
];

// Định nghĩa categories mặc định cho THU NHẬP
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: "i1",
    name: "Lương",
    icon: "cash-multiple",
    color: "#4CAF50",
    count: 12,
  },
  { id: "i2", name: "Thưởng", icon: "gift", color: "#FF9800", count: 3 },
  { id: "i3", name: "Đầu tư", icon: "chart-line", color: "#2196F3", count: 5 },
  { id: "i4", name: "Kinh doanh", icon: "store", color: "#9C27B0", count: 8 },
  { id: "i5", name: "Freelance", icon: "laptop", color: "#00BCD4", count: 6 },
  { id: "i6", name: "Cho thuê", icon: "home-city", color: "#795548", count: 4 },
  { id: "i7", name: "Lãi suất", icon: "percent", color: "#607D8B", count: 2 },
  { id: "i8", name: "Bán hàng", icon: "sale", color: "#E91E63", count: 7 },
  {
    id: "i9",
    name: "Khác",
    icon: "dots-horizontal",
    color: "#9E9E9E",
    count: 1,
  },
];

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeRouteProp>();
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(
    DEFAULT_EXPENSE_CATEGORIES
  );
  const [incomeCategories, setIncomeCategories] = useState<Category[]>(
    DEFAULT_INCOME_CATEGORIES
  );

  // Lấy categories hiện tại dựa trên tab đang active
  const currentCategories =
    activeTab === "expense" ? expenseCategories : incomeCategories;
  const totalCount = currentCategories.reduce((sum, cat) => sum + cat.count, 0);

  // Tải danh sách categories từ AsyncStorage khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const storedExpense = await AsyncStorage.getItem("expenseCategories");
        const storedIncome = await AsyncStorage.getItem("incomeCategories");

        if (storedExpense) {
          const parsedExpense = JSON.parse(storedExpense);
          if (Array.isArray(parsedExpense) && parsedExpense.length > 0) {
            setExpenseCategories(parsedExpense);
          } else {
            await AsyncStorage.setItem(
              "expenseCategories",
              JSON.stringify(DEFAULT_EXPENSE_CATEGORIES)
            );
          }
        } else {
          await AsyncStorage.setItem(
            "expenseCategories",
            JSON.stringify(DEFAULT_EXPENSE_CATEGORIES)
          );
        }

        if (storedIncome) {
          const parsedIncome = JSON.parse(storedIncome);
          if (Array.isArray(parsedIncome) && parsedIncome.length > 0) {
            setIncomeCategories(parsedIncome);
          } else {
            await AsyncStorage.setItem(
              "incomeCategories",
              JSON.stringify(DEFAULT_INCOME_CATEGORIES)
            );
          }
        } else {
          await AsyncStorage.setItem(
            "incomeCategories",
            JSON.stringify(DEFAULT_INCOME_CATEGORIES)
          );
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Cập nhật danh sách khi nhận dữ liệu mới từ CategoryManagementScreen
  useEffect(() => {
    if (route.params?.updatedCategories) {
      const updatedCategories = route.params.updatedCategories;
      if (Array.isArray(updatedCategories)) {
        if (activeTab === "expense") {
          setExpenseCategories(updatedCategories);
          AsyncStorage.setItem(
            "expenseCategories",
            JSON.stringify(updatedCategories)
          );
        } else {
          setIncomeCategories(updatedCategories);
          AsyncStorage.setItem(
            "incomeCategories",
            JSON.stringify(updatedCategories)
          );
        }
      }
    }
  }, [route.params?.updatedCategories, activeTab]);

  const handleDeleteCategory = async (id: string) => {
    if (activeTab === "expense") {
      const updatedCategories = expenseCategories.filter(
        (cat) => cat.id !== id
      );
      setExpenseCategories(updatedCategories);
      await AsyncStorage.setItem(
        "expenseCategories",
        JSON.stringify(updatedCategories)
      );
    } else {
      const updatedCategories = incomeCategories.filter((cat) => cat.id !== id);
      setIncomeCategories(updatedCategories);
      await AsyncStorage.setItem(
        "incomeCategories",
        JSON.stringify(updatedCategories)
      );
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      {/* Icon Trừ bên trái */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCategory(item.id)}
      >
        <Icon name="minus-circle" size={24} color="#2196F3" />
      </TouchableOpacity>

      {/* Icon category với background tròn */}
      <View
        style={[styles.categoryIconContainer, { backgroundColor: item.color }]}
      >
        <Icon name={item.icon} size={28} color="#fff" />
      </View>

      {/* Tên category */}
      <Text style={styles.categoryName}>{item.name}</Text>

      {/* Icon pencil */}
      <TouchableOpacity style={styles.editButton}>
        <Icon name="pencil" size={20} color="#9E9E9E" />
      </TouchableOpacity>

      {/* Icon hamburger menu */}
      <TouchableOpacity style={styles.menuButton}>
        <Icon name="menu" size={24} color="#9E9E9E" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header với nút back và title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Trangchu")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân loại quản lý</Text>
      </View>

      {/* Tab Container */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "expense" && styles.tabActive]}
          onPress={() => setActiveTab("expense")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expense" && styles.tabTextActive,
            ]}
          >
            CHI TIÊU(
            {expenseCategories.reduce((sum, cat) => sum + cat.count, 0)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "income" && styles.tabActive]}
          onPress={() => setActiveTab("income")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "income" && styles.tabTextActive,
            ]}
          >
            THU NHẬP({incomeCategories.reduce((sum, cat) => sum + cat.count, 0)}
            )
          </Text>
        </TouchableOpacity>
      </View>

      {/* List categories */}
      <FlatList
        data={currentCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        key={activeTab} // Force re-render khi đổi tab
      />

      {/* Nút thêm phân loại mới */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Nhappl")}
      >
        <Icon name="plus" size={20} color="#000" />
        <Text style={styles.addButtonText}>THÊM PHÂN LOẠI MỚI</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#E3F2FD",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    fontWeight: "600",
    color: "#fff",
  },
  listContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  deleteButton: {
    marginRight: 12,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  menuButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default Home;
