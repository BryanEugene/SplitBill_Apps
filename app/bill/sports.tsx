import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
};

type ExpenseItem = {
  id: string;
  name: string;
  price: string;
};

const SportsBill = () => {
  const [sportName, setSportName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [date, setDate] = useState(new Date());
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Court Fee', price: '' }
  ]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['me']);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mocked friends data
  const friends: Friend[] = [
    { id: 'me', name: 'Me (You)' },
    { id: 'friend1', name: 'John Smith' },
    { id: 'friend2', name: 'Sarah Davis' },
    { id: 'friend3', name: 'Mike Johnson' },
    { id: 'friend4', name: 'Emma Wilson' },
  ];

  const handleAddExpense = () => {
    const newId = String(expenses.length + 1);
    setExpenses([...expenses, { id: newId, name: '', price: '' }]);
  };

  const handleRemoveExpense = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      return total + (parseFloat(expense.price) || 0);
    }, 0);
  };

  const calculatePerPerson = () => {
    const total = calculateTotal();
    if (selectedFriends.length === 0) return 0;
    return total / selectedFriends.length;
  };

  const handleSaveBill = () => {
    if (!sportName || !venueName || selectedFriends.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and select at least one person');
      return;
    }

    let isValid = true;
    expenses.forEach(expense => {
      if (!expense.name || !expense.price) {
        isValid = false;
      }
    });

    if (!isValid) {
      Alert.alert('Error', 'Please fill in all expense details');
      return;
    }

    setIsLoading(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Sports bill has been saved and shared with your friends',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sports Split</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!showSummary ? (
            <>
              <View style={styles.imageContainer}>
                {/* <Image
                  source={require('../../assets/images/sports.png')}
                  style={styles.sportsImage}
                  resizeMode="contain"
                /> */}
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Sport</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Basketball, Tennis, Soccer"
                    placeholderTextColor="#9E9E9E"
                    value={sportName}
                    onChangeText={setSportName}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Venue Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter venue or location name"
                    placeholderTextColor="#9E9E9E"
                    value={venueName}
                    onChangeText={setVenueName}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <View style={styles.dateButton}>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#757575" />
                  </View>
                </View>
                
                <View style={styles.expensesContainer}>
                  <Text style={styles.sectionTitle}>Expenses</Text>
                  
                  {expenses.map((expense, index) => (
                    <View key={expense.id} style={styles.expenseItem}>
                      <View style={styles.expenseHeader}>
                        <Text style={styles.expenseNumber}>Expense {index + 1}</Text>
                        {expenses.length > 1 && (
                          <TouchableOpacity 
                            onPress={() => handleRemoveExpense(expense.id)}
                            style={styles.removeButton}
                          >
                            <AntDesign name="close" size={18} color="#FF5252" />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      <View style={styles.expenseRow}>
                        <View style={styles.expenseNameContainer}>
                          <Text style={styles.expenseLabel}>Description</Text>
                          <TextInput
                            style={styles.expenseInput}
                            placeholder="e.g., Court fee, Equipment"
                            placeholderTextColor="#9E9E9E"
                            value={expense.name}
                            onChangeText={(value) => updateExpense(expense.id, 'name', value)}
                          />
                        </View>
                        
                        <View style={styles.expensePriceContainer}>
                          <Text style={styles.expenseLabel}>Price</Text>
                          <TextInput
                            style={styles.expenseInput}
                            placeholder="0.00"
                            placeholderTextColor="#9E9E9E"
                            keyboardType="decimal-pad"
                            value={expense.price}
                            onChangeText={(value) => updateExpense(expense.id, 'price', value)}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addExpenseButton}
                    onPress={handleAddExpense}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#5B37B7" />
                    <Text style={styles.addExpenseText}>Add Expense</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.friendsContainer}>
                  <Text style={styles.sectionTitle}>Split with</Text>
                  <View style={styles.friendsList}>
                    {friends.map(friend => (
                      <TouchableOpacity
                        key={friend.id}
                        style={[
                          styles.friendChip,
                          selectedFriends.includes(friend.id) && styles.friendChipSelected
                        ]}
                        onPress={() => toggleFriend(friend.id)}
                      >
                        <Text
                          style={[
                            styles.friendChipText,
                            selectedFriends.includes(friend.id) && styles.friendChipTextSelected
                          ]}
                        >
                          {friend.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.summaryButton}
                  onPress={() => setShowSummary(true)}
                >
                  <Text style={styles.summaryButtonText}>See Split Summary</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>{sportName}</Text>
              <Text style={styles.summarySubtitle}>{venueName} • {formatDate(date)}</Text>
              
              <View style={styles.summaryDivider} />
              
              <Text style={styles.expensesSummaryTitle}>Expenses</Text>
              
              {expenses.map(expense => (
                <View key={expense.id} style={styles.summaryExpenseRow}>
                  <Text style={styles.summaryExpenseName}>{expense.name}</Text>
                  <Text style={styles.summaryExpenseValue}>${parseFloat(expense.price || '0').toFixed(2)}</Text>
                </View>
              ))}
              
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${calculateTotal().toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.participantsSection}>
                <Text style={styles.participantsTitle}>Participants ({selectedFriends.length})</Text>
                <View style={styles.participantsList}>
                  {selectedFriends.map(friendId => {
                    const friend = friends.find(f => f.id === friendId);
                    return (
                      <View key={friendId} style={styles.participantItem}>
                        <Text style={styles.participantName}>{friend?.name}</Text>
                        <Text style={styles.participantAmount}>${calculatePerPerson().toFixed(2)}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setShowSummary(false)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveBill}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save & Share</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sportsImage: {
    width: 150,
    height: 150,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  expensesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  expenseItem: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  removeButton: {
    padding: 4,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseNameContainer: {
    flex: 2,
    marginRight: 10,
  },
  expensePriceContainer: {
    flex: 1,
  },
  expenseLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 8,
  },
  expenseInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5B37B7',
  },
  addExpenseText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  friendsContainer: {
    marginBottom: 20,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  friendChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  friendChipSelected: {
    backgroundColor: '#5B37B7',
  },
  friendChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  friendChipTextSelected: {
    color: 'white',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  summaryButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  summarySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  expensesSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  summaryExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  summaryExpenseName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  summaryExpenseValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  participantsSection: {
    marginBottom: 16,
  },
  participantsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  participantsList: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 4,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  participantName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  participantAmount: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  bottomSpace: {
    height: 100,
  },
});

export default SportsBill;
