import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native'; // ✅ Thêm useRoute
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native'; // ✅ Thêm RouteProp
import { RootStackParamList, Category } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

type NhapGiaoDichNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nhap'>;
type NhapGiaoDichRouteProp = RouteProp<RootStackParamList, 'Nhap'>; // ✅ Thêm route type

const NhapGiaoDich = () => {
  const navigation = useNavigation<NhapGiaoDichNavigationProp>();
  const route = useRoute<NhapGiaoDichRouteProp>(); // ✅ Thêm useRoute
  
  // ✅ Nhận category và transaction type từ params
  const initialCategory = route.params?.selectedCategory || null;
  const initialTransactionType = route.params?.transactionType || 'expense';
  
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>(initialTransactionType); // ✅ Sử dụng params
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory); // ✅ Sử dụng params
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedExpense = await AsyncStorage.getItem('expenseCategories');
      const storedIncome = await AsyncStorage.getItem('incomeCategories');
      
      if (storedExpense) {
        const parsed = JSON.parse(storedExpense);
        setExpenseCategories(parsed);
        // ✅ Chỉ set category mặc định nếu chưa có category từ params
        if (!initialCategory && parsed.length > 0) {
          setSelectedCategory(parsed[0]);
        }
      }
      if (storedIncome) {
        setIncomeCategories(JSON.parse(storedIncome));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleNumberPress = (num: string) => {
    if (amount === '0') {
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
      const result = eval(amount);
      setAmount(result.toString());
    } catch (error) {
      setAmount('0');
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setSelectedCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: selectedCategory?.color || '#2196F3' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => setShowCategoryModal(true)}
        >
          {selectedCategory && (
            <View style={[styles.selectedCategoryIcon, { backgroundColor: selectedCategory.color }]}>
              <Icon name={selectedCategory.icon} size={32} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{amount}</Text>
          <Icon name="menu-down" size={24} color="#fff" />
        </View>
        
        <Text style={styles.equalText}>{amount}=</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.formRow}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar-blank" size={24} color="#666" />
          <Text style={styles.formLabel}>Ngày tháng</Text>
          <Text style={styles.formValue}>Hôm nay</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.formRow}
          onPress={() => setShowTimePicker(true)}
        >
          <Icon name="clock-outline" size={24} color="#666" />
          <Text style={styles.formLabel}>Thời gian</Text>
          <Text style={styles.formValue}>{formatTime(time)}</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.formRow}>
          <Icon name="pencil" size={24} color="#666" />
          <Text style={styles.formLabel}>Ghi chú</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Nhập ghi chú"
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

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
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('7')}>
            <Text style={styles.calcButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('8')}>
            <Text style={styles.calcButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('9')}>
            <Text style={styles.calcButtonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButtonBlue} onPress={() => handleOperatorPress('/')}>
            <Icon name="division" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('4')}>
            <Text style={styles.calcButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('5')}>
            <Text style={styles.calcButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('6')}>
            <Text style={styles.calcButtonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButtonBlue} onPress={() => handleOperatorPress('*')}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('1')}>
            <Text style={styles.calcButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('2')}>
            <Text style={styles.calcButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('3')}>
            <Text style={styles.calcButtonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButtonBlue} onPress={() => handleOperatorPress('-')}>
            <Icon name="minus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.calculatorRow}>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('.')}>
            <Text style={styles.calcButtonText}>,</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButton} onPress={() => handleNumberPress('0')}>
            <Text style={styles.calcButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButtonBlue} onPress={handleBackspace}>
            <Icon name="backspace-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calcButtonBlue} onPress={() => handleOperatorPress('+')}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* FAB Check button */}
      <TouchableOpacity style={styles.fabCheck} onPress={handleCalculate}>
        <Icon name="check" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={[styles.modalTab, activeTab === 'expense' && styles.modalTabActive]}
                onPress={() => setActiveTab('expense')}
              >
                <Text style={[styles.modalTabText, activeTab === 'expense' && styles.modalTabTextActive]}>
                  CHI TIÊU
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTab, activeTab === 'income' && styles.modalTabActive]}
                onPress={() => setActiveTab('income')}
              >
                <Text style={[styles.modalTabText, activeTab === 'income' && styles.modalTabTextActive]}>
                  THU NHẬP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="cog" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={4}
              contentContainerStyle={styles.categoryGrid}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  categoryButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  selectedCategoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  equalText: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'right',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  formLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  formValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  calculator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  calculatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  calcButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  calcButtonBlue: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  calcButtonText: {
    fontSize: 32,
    color: '#000',
  },
  fabCheck: {
    position: 'absolute',
    bottom: 280,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  modalTabText: {
    fontSize: 14,
    color: '#666',
  },
  modalTabTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  categoryGrid: {
    padding: 8,
  },
  categoryItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});

export default NhapGiaoDich;