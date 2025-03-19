import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
};

type FriendSelectorProps = {
  title?: string;
  selectedFriends: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
};

export const FriendSelector: React.FC<FriendSelectorProps> = ({
  title = 'Select Friends',
  selectedFriends,
  onSelectionChange,
  multiSelect = true
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real app, this would come from a context or props
  const friends: Friend[] = [
    { id: 'me', name: 'Me (You)', phoneNumber: '', email: 'user@example.com' },
    { id: 'friend1', name: 'John Smith', phoneNumber: '+1 234 567 8901', email: 'john@example.com' },
    { id: 'friend2', name: 'Sarah Davis', phoneNumber: '+1 234 567 8902', email: 'sarah@example.com' },
    { id: 'friend3', name: 'Mike Johnson', phoneNumber: '+1 234 567 8903', email: 'mike@example.com' },
    { id: 'friend4', name: 'Emma Wilson', phoneNumber: '+1 234 567 8904', email: 'emma@example.com' },
    { id: 'friend5', name: 'David Brown', phoneNumber: '+1 234 567 8905', email: 'david@example.com' },
  ];

  const toggleFriendSelection = (friendId: string) => {
    if (multiSelect) {
      // For multi-select mode
      if (selectedFriends.includes(friendId)) {
        onSelectionChange(selectedFriends.filter(id => id !== friendId));
      } else {
        onSelectionChange([...selectedFriends, friendId]);
      }
    } else {
      // For single-select mode
      onSelectionChange([friendId]);
      setModalVisible(false);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFriendsData = friends.filter(friend => 
    selectedFriends.includes(friend.id)
  );

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
      </View>
      
      <View style={styles.checkboxContainer}>
        {selectedFriends.includes(item.id) ? (
          <View style={styles.checkedBox}>
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        ) : (
          <View style={styles.uncheckedBox} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSelectedFriendChip = (friend: Friend) => (
    <View key={friend.id} style={styles.selectedFriendChip}>
      <Text style={styles.selectedFriendName}>{friend.name}</Text>
      {multiSelect && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => toggleFriendSelection(friend.id)}
        >
          <AntDesign name="close" size={16} color="#757575" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedFriends.length === 0 
            ? 'Select friends' 
            : selectedFriends.length === 1 
              ? `${selectedFriendsData[0]?.name}` 
              : `${selectedFriendsData[0]?.name} +${selectedFriends.length - 1} more`
          }
        </Text>
        <Ionicons name="chevron-down" size={20} color="#5B37B7" />
      </TouchableOpacity>
      
      {selectedFriends.length > 0 && (
        <View style={styles.selectedFriendsContainer}>
          {selectedFriendsData.map(renderSelectedFriendChip)}
        </View>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#212121" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends"
                placeholderTextColor="#9E9E9E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color="#757575" />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredFriends}
              renderItem={renderFriendItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.friendsList}
              showsVerticalScrollIndicator={false}
            />
            
            {multiSelect && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  selectedFriendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  selectedFriendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFriendName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#5B37B7',
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  clearButton: {
    padding: 4,
  },
  friendsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
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
  },
  checkboxContainer: {
    marginLeft: 8,
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BDBDBD',
  },
  checkedBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#5B37B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});
