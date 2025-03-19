import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean;
  error: Error | null;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let database: SQLite.SQLiteDatabase | null = null;

    const initDatabase = async () => {
      try {
        // Open database
        database = await SQLite.openDatabaseAsync("splitbill.db");

        // Initialize tables
        await createTables(database);

        setDb(database);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown database error")
        );
        console.error("Database initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();

    // Cleanup function
    return () => {
      if (Platform.OS === "web" && database) {
        database.closeAsync();
      }
    };
  }, []);

  const createTables = async (database: SQLite.SQLiteDatabase) => {
    // Execute all table creation queries
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        friendName TEXT NOT NULL,
        email TEXT,
        phoneNumber TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bill_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        billId INTEGER NOT NULL,
        itemName TEXT NOT NULL,
        price REAL NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (billId) REFERENCES bills (id) ON DELETE CASCADE
      )
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bill_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        billId INTEGER NOT NULL,
        participantId INTEGER NOT NULL,
        amount REAL NOT NULL,
        isPaid INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (billId) REFERENCES bills (id) ON DELETE CASCADE
      )
    `);
  };

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
