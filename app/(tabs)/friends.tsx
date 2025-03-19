import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

type Friend = {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  isFromContacts?: boolean;
};

const FriendsScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendPhone, setNewFriendPhone] = useState('');
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [deviceContacts, setDeviceContacts] = useState<Friend[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    // Simulate fetching friends from database
    setTimeout(() => {
      setFriends([
        { id: '1', name: 'John Smith', phoneNumber: '+1 234 567 8901', email: 'john@example.com' },
        { id: '2', name: 'Sarah Davis', phoneNumber: '+1 234 567 8902', email: 'sarah@example.com' },
        { id: '3', name: 'Mike Johnson', phoneNumber: '+1 234 567 8903', email: 'mike@example.com' },
        { id: '4', name: 'Emma Wilson', phoneNumber: '+1 234 567 8904', email: 'emma@example.com' },
        { id: '5', name: 'David Brown', phoneNumber: '+1 234 567 8905', email: 'david@example.com' },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleImportContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        return;
      }
      
      setLoadingContacts(true);
      setShowContactsModal(true);
      
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });
      
      if (data.length > 0) {
        const formattedContacts = data
          .filter(contact => contact.name && (contact.phoneNumbers?.length || contact.emails?.length))
          .map(contact => ({
            id: contact.id,
            name: contact.name || 'Unknown',
            phoneNumber: contact.phoneNumbers?.[0]?.number,
            email: contact.emails?.[0]?.email,
            isFromContacts: true
          }));
        
        setDeviceContacts(formattedContacts);
      }
      
      setLoadingContacts(false);
    } catch (error) {
      console.error('Error importing contacts:', error);
      Alert.alert('Error', 'Failed to import contacts');
      setShowContactsModal(false);
      setLoadingContacts(false);
    }
  };

  const handleAddFriend = () => {
    if (!newFriendName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendName.trim(),
      phoneNumber: newFriendPhone.trim() || undefined,
      email: newFriendEmail.trim() || undefined
    };
    
    setFriends(prevFriends => [...prevFriends, newFriend]);
    setShowAddModal(false);
    resetNewFriendForm();
  };

  const handleAddContactAsFriend = (contact: Friend) => {
    // Check if contact already exists as friend
    const exists = friends.some(friend => 
      (friend.phoneNumber && contact.phoneNumber && friend.phoneNumber === contact.phoneNumber) ||
      (friend.email && contact.email && friend.email === contact.email)
    );
    
    if (exists) {
      Alert.alert('Already Added', 'This contact is already in your friends list');
      return;
    }
    
    setFriends(prevFriends => [...prevFriends, { ...contact, id: Date.now().toString() }]);
    Alert.alert('Success', `${contact.name} added to your friends list`);
  };

  const handleDeleteFriend = (friendId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
          },
          style: 'destructive'
        },
      ]
    );
  };

  const resetNewFriendForm = () => {
    setNewFriendName('');
    setNewFriendPhone('');
    setNewFriendEmail('');
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.email && friend.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (friend.phoneNumber && friend.phoneNumber.includes(searchQuery))
  );

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.phoneNumber && <Text style={styles.friendDetail}>{item.phoneNumber}</Text>}
        {item.email && <Text style={styles.friendDetail}>{item.email}</Text>}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteFriend(item.id)}
      >
        <AntDesign name="delete" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  const renderContactItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => handleAddContactAsFriend(item)}
    >
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.phoneNumber && <Text style={styles.friendDetail}>{item.phoneNumber}</Text>}
        {item.email && <Text style={styles.friendDetail}>{item.email}</Text>}
      </View>
      <View style={styles.addContactIcon}>
        <AntDesign name="plus" size={20} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAddModal(true)}
        >
          <AntDesign name="adduser" size={20} color="#5B37B7" />
          <Text style={styles.actionButtonText}>Add Friend</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleImportContacts}
        >
          <Ionicons name="people" size={20} color="#5B37B7" />
          <Text style={styles.actionButtonText}>Import Contacts</Text>
        </TouchableOpacity>
      </View>
      
      {filteredFriends.length > 0 ? (
        <FlatList
          data={filteredFriends}
          renderItem={renderFriendItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.friendsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="users" size={60} color="#E0E0E0" />
          <Text style={styles.emptyText}>No friends found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery.length > 0 
              ? 'Try a different search term' 
              : 'Add friends to split bills with them'}
          </Text>
        </View>
      )}
      
      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Friend</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  resetNewFriendForm();
                }}
              >
                <Ionicons name="close" size={24} color="#212121" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter friend's name"
                  placeholderTextColor="#9E9E9E"
                  value={newFriendName}
                  onChangeText={setNewFriendName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="phone-pad"
                  value={newFriendPhone}
                  onChangeText={setNewFriendPhone}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newFriendEmail}
                  onChangeText={setNewFriendEmail}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddFriend}
              >
                <Text style={styles.addButtonText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Contacts Modal */}
      <Modal
        visible={showContactsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Contacts</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowContactsModal(false)}
              >
                <Ionicons name="close" size={24} color="#212121" />
              </TouchableOpacity>
            </View>
            
            {loadingContacts ? (
              <View style={styles.contactsLoadingContainer}>
                <ActivityIndicator size="large" color="#5B37B7" />
                <Text style={styles.contactsLoadingText}>Loading contacts...</Text>
              </View>
            ) : (
              <>
                <View style={styles.contactsSearchContainer}>
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search contacts"
                      placeholderTextColor="#9E9E9E"
                    />
                  </View>
                </View>
                
                {deviceContacts.length > 0 ? (
                  <FlatList
                    data={deviceContacts}
                    renderItem={renderContactItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.contactsList}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.emptyContactsContainer}>
                    <FontAwesome name="address-book" size={60} color="#E0E0E0" />
                    <Text style={styles.emptyText}>No contacts found</Text>
                    <Text style={styles.emptySubtext}>
                      Make sure your contacts are synced with your device
                    </Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={() => setShowContactsModal(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F5F5F7',
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  clearButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  friendsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 4,
  },
  friendDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
  addButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  contactsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5B37B7',
    fontFamily: 'Poppins-Medium',
  },
  contactsSearchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  contactsList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  addContactIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E4F9EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  doneButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});

export default FriendsScreen;
