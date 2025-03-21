# SplitBill App

A modern mobile application for splitting bills and expenses with friends built with React Native and Expo.

<p align="center">
  <img src="./assets/icon.png" width="100" alt="SplitBill Logo"/>
</p>

## 📱 Features

- **Easy Bill Splitting**: Scan receipts or manually enter bills to split with friends
- **Multiple Split Types**: Support for various types of expenses:
  - Food & Drinks
  - Accommodation
  - Sports activities
  - Entertainment
  - General expenses
- **Receipt Scanning**: Upload receipt images to automatically extract data
- **Friend Management**: Add and manage friends to split bills with
- **Transaction History**: View all your past transactions
- **Analytics**: Track spending patterns and categories
- **Contact Integration**: Import contacts from your device

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional for mobile testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/splitbill.git
   cd splitbill
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Install font files:
   - Download Poppins font family from [Google Fonts](https://fonts.google.com/specimen/Poppins)
   - Extract and place the following files in the `assets/fonts` directory:
     - Poppins-Regular.ttf
     - Poppins-Medium.ttf
     - Poppins-Bold.ttf

4. Start the application:
   ```bash
   npx expo start
   ```

5. Test credentials (for demo):
   - Email: user@example.com
   - Password: password

## 📂 Project Structure

```
splitbill/
├── app/                 # Main application code using Expo Router
│   ├── (tabs)/          # Tab-based navigation screens
│   ├── auth/            # Authentication screens
│   ├── bill/            # Bill entry screens
│   └── _layout.tsx      # Root layout for navigation
├── assets/              # Static assets
│   ├── fonts/           # Font files
│   └── images/          # Image assets
├── components/          # Reusable React components
├── context/             # React Context providers
├── utils/               # Utility functions
└── README.md            # Project documentation
```

## 📱 Screens

- **Authentication**
  - Login
  - Registration

- **Main Tabs**
  - Dashboard (Home)
  - Transaction History
  - Receipt Scanner
  - Analytics
  - Friends

- **Bill Entry**
  - Manual Entry
  - Accommodation Split
  - Sports Split
  - Entertainment Split
  - Receipt Scanner

## 🛠️ Technology Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [SQLite](https://www.sqlite.org/index.html) (via Expo SQLite)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Contacts](https://docs.expo.dev/versions/latest/sdk/contacts/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check issues page.

## 📧 Contact

Developer: [Bryan Eugene](mailto:Bryantjia@gmail.com)
Developer: [Bryan Eugene](mailto:bryan.eugene@binus.ac.id)#   S p l i t B i l l s _ A p p s  
 #   S p l i t B i l l _ A p p s  
 