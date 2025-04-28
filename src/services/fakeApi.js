// This file contains fake API implementations that will be replaced with
// real API calls to the Laravel backend when it's ready

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate a fake JWT token
const generateToken = () => `fake-jwt-token-${Math.random().toString(36).substr(2, 16)}`;

// Local storage keys
const USERS_KEY = 'cs-playbook-users';
const STRATEGIES_KEY = 'cs-playbook-strategies';

// Initialize fake data if not exists
const initFakeData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        password: 'password', // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  // Initialize strategies if not exists
  if (!localStorage.getItem(STRATEGIES_KEY)) {
    const maps = ['dust2', 'mirage', 'inferno', 'nuke', 'overpass', 'vertigo', 'ancient'];
    const types = ['T Side', 'CT Side', 'Pistol Round', 'Eco', 'Force Buy'];
    
    // Generate 10 sample strategies
    const defaultStrategies = Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      userId: '1', // Demo user
      title: `${maps[i % maps.length].charAt(0).toUpperCase() + maps[i % maps.length].slice(1)} ${types[i % types.length]} Strategy`,
      description: `A detailed strategy for ${maps[i % maps.length]} that focuses on ${types[i % types.length].toLowerCase()} tactics.`,
      map: maps[i % maps.length],
      type: types[i % types.length],
      isPublic: Math.random() > 0.3, // 70% of strategies are public
      upvotes: Math.floor(Math.random() * 50),
      downvotes: Math.floor(Math.random() * 10),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      players: Array.from({ length: 5 }, (_, j) => ({
        position: j + 1,
        role: ['Entry', 'Support', 'AWPer', 'Lurker', 'IGL'][j],
        tasks: `Player ${j + 1} responsibilities for the ${maps[i % maps.length]} strategy.`
      })),
      lineups: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, k) => ({
        id: `lineup-${i}-${k}`,
        title: `${['Smoke', 'Flash', 'Molotov'][k % 3]} for ${['A Site', 'B Site', 'Mid Control'][k % 3]}`,
        image: `https://via.placeholder.com/600x400.png?text=Lineup+${k + 1}+for+${maps[i % maps.length]}`
      }))
    }));
    
    localStorage.setItem(STRATEGIES_KEY, JSON.stringify(defaultStrategies));
  }
};

// Initialize fake data
initFakeData();

// Fake user authentication API
export const fakeAuthApi = {
  login: async (credentials) => {
    await delay(800); // Simulate network delay
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Don't include password in the returned user
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: generateToken()
    };
  },
  
  register: async (userData) => {
    await delay(1000); // Simulate network delay
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Don't include password in the returned user
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token: generateToken()
    };
  },
  
  updateProfile: async (profileData) => {
    await delay(800); // Simulate network delay
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === profileData.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Don't include password in the returned user
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
};

// Fake strategies API
export const fakeStrategiesApi = {
  getStrategies: async () => {
    await delay(800); // Simulate network delay
    return JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
  },
  
  getStrategyById: async (id) => {
    await delay(500); // Simulate network delay
    
    const strategies = JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
    const strategy = strategies.find(s => s.id === id);
    
    if (!strategy) {
      throw new Error('Strategy not found');
    }
    
    return strategy;
  },
  
  createStrategy: async (strategyData) => {
    await delay(1000); // Simulate network delay
    
    const strategies = JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
    
    // Create new strategy
    const newStrategy = {
      id: generateId(),
      ...strategyData,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to strategies array
    strategies.push(newStrategy);
    localStorage.setItem(STRATEGIES_KEY, JSON.stringify(strategies));
    
    return newStrategy;
  },
  
  updateStrategy: async (id, strategyData) => {
    await delay(800); // Simulate network delay
    
    const strategies = JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
    const strategyIndex = strategies.findIndex(s => s.id === id);
    
    if (strategyIndex === -1) {
      throw new Error('Strategy not found');
    }
    
    // Update strategy data
    strategies[strategyIndex] = {
      ...strategies[strategyIndex],
      ...strategyData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STRATEGIES_KEY, JSON.stringify(strategies));
    
    return strategies[strategyIndex];
  },
  
  deleteStrategy: async (id) => {
    await delay(600); // Simulate network delay
    
    const strategies = JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
    const updatedStrategies = strategies.filter(s => s.id !== id);
    
    localStorage.setItem(STRATEGIES_KEY, JSON.stringify(updatedStrategies));
    
    return { success: true };
  },
  
  voteStrategy: async (id, voteType) => {
    await delay(400); // Simulate network delay
    
    const strategies = JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]');
    const strategyIndex = strategies.findIndex(s => s.id === id);
    
    if (strategyIndex === -1) {
      throw new Error('Strategy not found');
    }
    
    // Update votes
    if (voteType === 'upvote') {
      strategies[strategyIndex].upvotes += 1;
    } else if (voteType === 'downvote') {
      strategies[strategyIndex].downvotes += 1;
    }
    
    localStorage.setItem(STRATEGIES_KEY, JSON.stringify(strategies));
    
    return {
      upvotes: strategies[strategyIndex].upvotes,
      downvotes: strategies[strategyIndex].downvotes
    };
  }
};