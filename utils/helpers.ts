/**
 * Format a number as currency with $ sign.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string to a more readable format.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate how many days between two dates.
 */
export const daysBetween = (startDate: Date, endDate: Date): number => {
  const difference = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(difference / (1000 * 3600 * 24));
};

/**
 * Generate a unique ID.
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Validate email format.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Split bill evenly among participants.
 */
export const splitEvenly = (total: number, numberOfPeople: number): number => {
  return total / numberOfPeople;
};

/**
 * Split bill proportionally based on each person's items.
 */
export const splitProportionally = (
  total: number,
  items: { id: string; price: number; assignedTo: string[] }[]
): Record<string, number> => {
  const result: Record<string, number> = {};
  
  // Calculate each person's share
  items.forEach(item => {
    if (item.assignedTo.length > 0) {
      const sharePerPerson = item.price / item.assignedTo.length;
      
      item.assignedTo.forEach(personId => {
        result[personId] = (result[personId] || 0) + sharePerPerson;
      });
    }
  });
  
  return result;
};
