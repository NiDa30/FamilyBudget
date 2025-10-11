import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const { width, height } = Dimensions.get('window');
const screenHeight = height;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Trangchu'>;

const HomeScreen = () => {
  const [date, setDate] = useState(new Date(2025, 9, 20));
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const onChangeDate = (_event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = () => {
    const now = new Date('2025-10-04T22:11:00+07:00');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime()}</Text>
          <View style={styles.statusIcons}>
            <Icon name="battery-outline" size={20} color="#000" />
            <Icon name="wifi" size={20} color="#000" />
            <Text style={styles.batteryText}>24%</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Icon name="chevron-down" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Thống kê */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Tổng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Chi tiêu</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Thu nhập</Text>
        </View>
      </View>

      {/* Input chọn ngày */}
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateInputLabel}>Chọn ngày nhập sách</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateInputText}>{formatDate(date)}</Text>
          <Icon name="calendar" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {/* ScrollView */}
      <ScrollView
        style={styles.emptyContainer}
        contentContainerStyle={styles.emptyContent}
      >
        <Icon name="file-document-outline" size={100} color="#B0B0B0" />
        <Icon name="close" size={40} color="#B0B0B0" style={styles.xIcon} />
        <Icon name="circle-outline" size={30} color="#B0B0B0" style={styles.dotIcon} />
        <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* Nhấn vào grid để đi đến màn hình Home (Quản lý phân loại) */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="view-grid" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-month-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.navItem}>
          <Icon name="heart-outline" size={24} color="red" />
          <View style={styles.vipBadge}>
            <Text style={styles.vipText}>VIP</Text>
          </View>
        </View>
        
        {/* Nút FAB chuyển đến màn hình NhapGiaoDich */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Nhap')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  statusIcons: { flexDirection: 'row', alignItems: 'center' },
  batteryText: { marginLeft: 5, fontSize: 14, color: '#000' },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { fontSize: 16, color: '#000' },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 48, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 14, color: '#000', marginTop: 5 },

  dateInputContainer: { paddingHorizontal: 20, marginBottom: 20 },
  dateInputLabel: { fontSize: 16, color: '#000', marginBottom: 10 },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  dateInputText: { fontSize: 16, color: '#000' },

  emptyContainer: { flex: 1 },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#B0B0B0', marginTop: 20 },
  xIcon: { position: 'absolute', top: 20, right: 20 },
  dotIcon: { position: 'absolute', top: 30, right: 30 },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: 'center', position: 'relative' },
  vipBadge: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    top: -5,
    right: -5,
  },
  vipText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;