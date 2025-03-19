import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { PieChart } from 'react-native-chart-kit';

type ExpenseCategory = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type MonthlyData = {
  month: string;
  amount: number;
};

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'year'>('month');
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeFilter]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    const mockCategories: ExpenseCategory[] = [
      {
        name: 'Food',
        amount: 230.75,
        color: '#FF9800',
        legendFontColor: '#212121',
        legendFontSize: 13
      },
      {
        name: 'Entertainment',
        amount: 180.50,
        color: '#5B37B7',
        legendFontColor: '#212121',
        legendFontSize: 13
      },
      {
        name: 'Sports',
        amount: 120.25,
        color: '#4CAF50',
        legendFontColor: '#212121',
        legendFontSize: 13
      },
      {
        name: 'Accommodation',
        amount: 210.50,
        color: '#FF5722',
        legendFontColor: '#212121',
        legendFontSize: 13
      }
    ];

    const mockMonthlyData: MonthlyData[] = [
      { month: 'Jan', amount: 120 },
      { month: 'Feb', amount: 150 },
      { month: 'Mar', amount: 180 },
      { month: 'Apr', amount: 120 },
      { month: 'May', amount: 200 },
      { month: 'Jun', amount: 250 }
    ];

    setCategories(mockCategories);
    setMonthlyData(mockMonthlyData);
    setTotalSpent(mockCategories.reduce((sum, category) => sum + category.amount, 0));
    setLoading(false);
  };

  const screenWidth = Dimensions.get('window').width - 40;

  const renderFilterButtons = () => (
    <View style={styles.filterButtons}>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'week' && styles.activeFilterButton]}
        onPress={() => setActiveFilter('week')}
      >
        <Text
          style={[styles.filterButtonText, activeFilter === 'week' && styles.activeFilterButtonText]}
        >
          This Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'month' && styles.activeFilterButton]}
        onPress={() => setActiveFilter('month')}
      >
        <Text
          style={[styles.filterButtonText, activeFilter === 'month' && styles.activeFilterButtonText]}
        >
          This Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'year' && styles.activeFilterButton]}
        onPress={() => setActiveFilter('year')}
      >
        <Text
          style={[styles.filterButtonText, activeFilter === 'year' && styles.activeFilterButtonText]}
        >
          This Year
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Spending Analytics</Text>
      </View>
      
      {renderFilterButtons()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}>
          <Text style={styles.totalCardTitle}>Total Spent</Text>
          <Text style={styles.totalCardAmount}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.totalCardPeriod}>
            {activeFilter === 'week' ? 'This Week' : activeFilter === 'month' ? 'This Month' : 'This Year'}
          </Text>
        </View>
        
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Spending by Category</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <PieChart
            data={categories}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Category Breakdown</Text>
        </View>
        
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.categoryValueContainer}>
              <Text style={styles.categoryValue}>{formatCurrency(category.amount)}</Text>
              <Text style={styles.categoryPercentage}>
                {Math.round((category.amount / totalSpent) * 100)}%
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Top Expenses</Text>
        </View>
        
        <View style={styles.expenseList}>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Ionicons name="restaurant-outline" size={24} color="#FF9800" />
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Dinner at Olive Garden</Text>
              <Text style={styles.expenseDate}>Oct 15, 2023</Text>
            </View>
            <Text style={styles.expenseAmount}>$86.50</Text>
          </View>
          
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Ionicons name="bed-outline" size={24} color="#FF5722" />
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Weekend Cabin</Text>
              <Text style={styles.expenseDate}>Sep 25, 2023</Text>
            </View>
            <Text style={styles.expenseAmount}>$210.50</Text>
          </View>
          
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Ionicons name="film-outline" size={24} color="#5B37B7" />
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Concert Tickets</Text>
              <Text style={styles.expenseDate}>Sep 15, 2023</Text>
            </View>
            <Text style={styles.expenseAmount}>$180.00</Text>
          </View>
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5B37B7',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  activeFilterButton: {
    backgroundColor: '#5B37B7',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#757575',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  totalCard: {
    backgroundColor: '#5B37B7',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalCardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  totalCardAmount: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 4,
  },
  totalCardPeriod: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
  },
  sectionTitleText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  categoryValueContainer: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  expenseList: {
    marginHorizontal: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  bottomSpace: {
    height: 100,
  },
});

export default Analytics;
