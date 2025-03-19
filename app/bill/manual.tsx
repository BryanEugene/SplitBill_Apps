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
  Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
};

type BillItem = {
  id: string;
  name: string;
  price: string;
  assignedTo: string[];
};

const ManualBillEntry = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: '', price: '', assignedTo: [] }
  ]);
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mocked friends data - in a real app, this would come from a context or database
  const friends: Friend[] = [
    { id: 'me', name: 'Me (You)' },
    { id: 'friend1', name: 'John Smith' },
    { id: 'friend2', name: 'Sarah Davis' },
    { id: 'friend3', name: 'Mike Johnson' },
  ];

  const handleAddItem = () => {
    const newId = String(items.length + 1);
    setItems([...items, { id: newId, name: '', price: '', assignedTo: [] }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | string[]) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleFriendForItem = (itemId: string, friendId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedAssignedTo = item.assignedTo.includes(friendId)
          ? item.assignedTo.filter(id => id !== friendId)
          : [...item.assignedTo, friendId];
        
        return { ...item, assignedTo: updatedAssignedTo };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    let subtotal = 0;
    items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      subtotal += price;
    });
    
    const taxAmount = parseFloat(tax) || 0;
    const tipAmount = parseFloat(tip) || 0;
    
    return {
      subtotal,
      tax: taxAmount,
      tip: tipAmount,
      total: subtotal + taxAmount + tipAmount
    };
  };

  const calculateSplitAmounts = () => {
    const result: Record<string, number> = {};
    const totals = calculateTotal();
    
    // Initialize all friends with 0
    friends.forEach(friend => {
      result[friend.id] = 0;
    });
    
    // Calculate each friend's portion for items
    items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      if (price > 0 && item.assignedTo.length > 0) {
        const pricePerPerson = price / item.assignedTo.length;
        
        item.assignedTo.forEach(friendId => {
          result[friendId] = (result[friendId] || 0) + pricePerPerson;
        });
      }
    });
    
    // Add proportional tax and tip
    const subtotal = totals.subtotal;
    if (subtotal > 0) {
      Object.keys(result).forEach(friendId => {
        if (result[friendId] > 0) {
          const proportion = result[friendId] / subtotal;
          result[friendId] += proportion * totals.tax + proportion * totals.tip;
        }
      });
    }
    
    return result;
  };

  const handleSaveBill = async () => {
    // Validate form
    if (!restaurantName.trim()) {
      Alert.alert('Error', 'Please enter the restaurant name');
      return;
    }
    
    let isValid = true;
    items.forEach(item => {
      if (!item.name.trim() || !item.price.trim() || item.assignedTo.length === 0) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      Alert.alert('Error', 'Please fill in all item details and assign each item to at least one person');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Bill has been saved and shared with your friends',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    }, 1500);
  };

  const totals = calculateTotal();
  
  const renderFriendSelector = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return null;
    
    return (
      <View style={styles.friendSelector}>
        <Text style={styles.sectionLabel}>Assign to:</Text>
        <View style={styles.friendList}>
          {friends.map(friend => (
            <TouchableOpacity
              key={friend.id}
              style={[
                styles.friendChip,
                item.assignedTo.includes(friend.id) && styles.friendChipSelected
              ]}
              onPress={() => toggleFriendForItem(itemId, friend.id)}
            >
              <Text
                style={[
                  styles.friendChipText,
                  item.assignedTo.includes(friend.id) && styles.friendChipTextSelected
                ]}
              >
                {friend.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Manual Receipt Entry</Text>
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
            // Bill Entry Form
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Restaurant Name</Text>
                <TextInput
                  style={styles.restaurantInput}
                  placeholder="Enter restaurant name"
                  placeholderTextColor="#9E9E9E"
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                />
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Items</Text>
                
                {items.map((item, index) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemNumber}>Item {index + 1}</Text>
                      {items.length > 1 && (
                        <TouchableOpacity 
                          onPress={() => handleRemoveItem(item.id)}
                          style={styles.removeButton}
                        >
                          <AntDesign name="close" size={18} color="#FF5252" />
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <View style={styles.itemRow}>
                      <View style={styles.itemNameContainer}>
                        <Text style={styles.itemLabel}>Item Name</Text>
                        <TextInput
                          style={styles.itemInput}
                          placeholder="e.g., Pizza"
                          placeholderTextColor="#9E9E9E"
                          value={item.name}
                          onChangeText={(value) => updateItem(item.id, 'name', value)}
                        />
                      </View>
                      
                      <View style={styles.itemPriceContainer}>
                        <Text style={styles.itemLabel}>Price</Text>
                        <TextInput
                          style={styles.itemInput}
                          placeholder="0.00"
                          placeholderTextColor="#9E9E9E"
                          keyboardType="decimal-pad"
                          value={item.price}
                          onChangeText={(value) => updateItem(item.id, 'price', value)}
                        />
                      </View>
                    </View>
                    
                    {renderFriendSelector(item.id)}
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={handleAddItem}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#5B37B7" />
                  <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Additional Costs</Text>
                
                <View style={styles.additionalCostsRow}>
                  <View style={styles.taxContainer}>
                    <Text style={styles.itemLabel}>Tax</Text>
                    <TextInput
                      style={styles.additionalCostInput}
                      placeholder="0.00"
                      placeholderTextColor="#9E9E9E"
                      keyboardType="decimal-pad"
                      value={tax}
                      onChangeText={setTax}
                    />
                  </View>
                  
                  <View style={styles.tipContainer}>
                    <Text style={styles.itemLabel}>Tip</Text>
                    <TextInput
                      style={styles.additionalCostInput}
                      placeholder="0.00"
                      placeholderTextColor="#9E9E9E"
                      keyboardType="decimal-pad"
                      value={tip}
                      onChangeText={setTip}
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ${totals.total.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.splitSummaryButton}
                  onPress={() => setShowSummary(true)}
                >
                  <Text style={styles.splitSummaryButtonText}>See Split Summary</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Bill Summary View
            <>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>{restaurantName}</Text>
                <Text style={styles.summarySubtitle}>Bill Split Summary</Text>
                
                <View style={styles.summaryTotals}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${totals.subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>${totals.tax.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tip</Text>
                    <Text style={styles.summaryValue}>${totals.tip.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalSummaryLabel}>Total</Text>
                    <Text style={styles.totalSummaryValue}>${totals.total.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.friendSummaryContainer}>
                  <Text style={styles.friendSummaryTitle}>Each Person Pays:</Text>
                  
                  {Object.entries(calculateSplitAmounts()).map(([friendId, amount]) => {
                    if (amount <= 0) return null;
                    const friend = friends.find(f => f.id === friendId);
                    if (!friend) return null;
                    
                    return (
                      <View key={friendId} style={styles.friendSummaryRow}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendAmount}>${amount.toFixed(2)}</Text>
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
                  <Text style={styles.editButtonText}>Edit Bill</Text>
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
            </>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  restaurantInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  removeButton: {
    padding: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemNameContainer: {
    flex: 2,
    marginRight: 12,
  },
  itemPriceContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 8,
  },
  itemInput: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  friendSelector: {
    marginTop: 8,
  },
  friendList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  friendChip: {
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  addItemButton: {
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
  addItemText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  additionalCostsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taxContainer: {
    flex: 1,
    marginRight: 12,
  },
  tipContainer: {
    flex: 1,
  },
  additionalCostInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  actionButtons: {
    marginBottom: 20,
  },
  splitSummaryButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  splitSummaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 20,
  },
  summaryTotals: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  totalSummaryLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  totalSummaryValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  friendSummaryContainer: {
    marginTop: 8,
  },
  friendSummaryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 16,
  },
  friendSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  friendAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  editButton: {
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  saveButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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

export default ManualBillEntry;
