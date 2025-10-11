import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

type CategoryManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nhappl'>;

const CategoryManagementScreen = () => {
  const navigation = useNavigation<CategoryManagementScreenNavigationProp>();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('food-apple');
  const [selectedColor, setSelectedColor] = useState('#FF6347');

  const colors = [
    '#FF6347', '#FF4500', '#FF69B4', '#FF1493', '#FF8C00',
    '#FFD700', '#FFEB3B', '#FFA500', '#32CD32', '#00FF00',
    '#ADFF2F', '#7FFF00', '#00CED1', '#00BFFF', '#1E90FF',
    '#4169E1', '#0000FF', '#8A2BE2', '#9370DB', '#BA55D3',
    '#4682B4', '#5F9EA0', '#20B2AA', '#3CB371', '#2E8B57',
  ];

  const iconList = [
    'food-apple', 'credit-card', 'cash-multiple', 'coffee', 'account',
    'cursor-pointer', 'eye', 'pill', 'hospital-box', 'needle',
    'tooth', 'camera', 'printer', 'monitor', 'laptop',
    'watch', 'headphones', 'cellphone', 'satellite-variant', 'domain',
    'notebook', 'palette', 'guitar', 'piano', 'calculator',
    'corn', 'presentation', 'volleyball', 'currency-usd', 'football',
    'basketball', 'baseball', 'skiing', 'earth', 'cards-playing',
    'table-tennis', 'swim', 'sailing', 'dice-multiple', 'target',
    'bed', 'bowl', 'gamepad-variant', 'human-male-female', 'run',
  ];

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCategoryName,
        icon: selectedIcon,
        color: selectedColor,
        count: 0,
      };

      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        const updatedCategories = [...categories, newCategory];
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        navigation.navigate('Home', { updatedCategories });
        setNewCategoryName('');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lưu danh mục. Vui lòng thử lại.');
        console.error('Error saving category:', error);
      }
    } else {
      Alert.alert('Thông báo', 'Vui lòng nhập tên phân loại');
    }
  };

  const renderIconItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.iconItem,
        selectedIcon === item && styles.selectedIconItem,
      ]}
      onPress={() => setSelectedIcon(item)}
    >
      <Icon 
        name={item} 
        size={32} 
        color={selectedIcon === item ? '#2196F3' : '#666'} 
      />
    </TouchableOpacity>
  );

  const renderColorItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.colorItem,
        { backgroundColor: item },
        selectedColor === item && styles.selectedColorItem,
      ]}
      onPress={() => setSelectedColor(item)}
    >
      {selectedColor === item && (
        <Icon name="check" size={16} color="#fff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân loại quản lý</Text>
        <TouchableOpacity 
          onPress={handleAddCategory}
          style={styles.checkButton}
        >
          <Icon name="check" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Selected Icon Display và Input Section */}
      <View style={styles.topSection}>
        {/* Icon đã chọn */}
        <View style={[styles.selectedIconContainer, { backgroundColor: selectedColor }]}>
          <Icon name={selectedIcon} size={36} color="#fff" />
        </View>

        {/* Input với counter */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên phân loại"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholderTextColor="#BDBDBD"
            maxLength={15}
          />
          <Text style={styles.counter}>{newCategoryName.length}/15</Text>
        </View>
      </View>

      {/* Color Picker Section */}
      <View style={styles.colorSection}>
        <View style={styles.colorIconContainer}>
          <Icon name="palette" size={32} color="#9E9E9E" />
          <Text style={styles.vipLabel}>VIP</Text>
        </View>
        
        {/* Thanh chọn màu - scroll ngang */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.colorScrollView}
        >
          <FlatList
            data={colors}
            renderItem={renderColorItem}
            keyExtractor={(item) => item}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.colorList}
          />
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Icon Selection Grid */}
      <FlatList
        data={iconList}
        renderItem={renderIconItem}
        keyExtractor={(item) => item}
        numColumns={5}
        contentContainerStyle={styles.iconGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 16,
  },
  checkButton: {
    padding: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  selectedIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  counter: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    fontSize: 12,
    color: '#9E9E9E',
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  colorIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  vipLabel: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  colorScrollView: {
    flex: 1,
  },
  colorList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedColorItem: {
    borderColor: '#2196F3',
    borderWidth: 3,
    elevation: 4,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  iconGrid: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  iconItem: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedIconItem: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
});

export default CategoryManagementScreen;