import { useState, useEffect } from 'react';

// Varsayılan balık türleri
const defaultFishTypes = [
    { id: 1, name: 'Hamsi', icon: '🐟' },
    { id: 2, name: 'İstavrit', icon: '🐠' },
    { id: 3, name: 'Lüfer', icon: '🐟' },
    { id: 4, name: 'Palamut', icon: '🐠' },
    { id: 5, name: 'Çinekop', icon: '🐟' },
    { id: 6, name: 'Sardalya', icon: '🐠' },
    { id: 7, name: 'Levrek', icon: '🐟' },
    { id: 8, name: 'Çipura', icon: '🐠' },
    { id: 9, name: 'Kalkan', icon: '🐟' },
    { id: 10, name: 'Mezgit', icon: '🐠' },
    { id: 11, name: 'Barbun', icon: '🐟' },
    { id: 12, name: 'Kefal', icon: '🐠' },
];

// localStorage anahtarları
const STORAGE_KEYS = {
    FISH_TYPES: 'balikci_fish_types',
    ENTRIES: 'balikci_entries',
    EXITS: 'balikci_exits',
};

// Yardımcı fonksiyonlar
const loadFromStorage = (key, defaultValue) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Kaydetme hatası:', error);
    }
};

// Custom Hook: useStorage
export const useStorage = () => {
    const [fishTypes, setFishTypes] = useState(() =>
        loadFromStorage(STORAGE_KEYS.FISH_TYPES, defaultFishTypes)
    );
    const [entries, setEntries] = useState(() =>
        loadFromStorage(STORAGE_KEYS.ENTRIES, [])
    );
    const [exits, setExits] = useState(() =>
        loadFromStorage(STORAGE_KEYS.EXITS, [])
    );

    // Değişiklikleri localStorage'a kaydet
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.FISH_TYPES, fishTypes);
    }, [fishTypes]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.ENTRIES, entries);
    }, [entries]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.EXITS, exits);
    }, [exits]);

    // Balık girişi ekle
    const addEntry = (entry) => {
        const newEntry = {
            id: Date.now(),
            ...entry,
            timestamp: new Date().toISOString(),
        };
        setEntries(prev => [newEntry, ...prev]);
        return newEntry;
    };

    // Balık çıkışı ekle
    const addExit = (exit) => {
        const newExit = {
            id: Date.now(),
            ...exit,
            timestamp: new Date().toISOString(),
        };
        setExits(prev => [newExit, ...prev]);
        return newExit;
    };

    // Giriş sil
    const deleteEntry = (id) => {
        setEntries(prev => prev.filter(e => e.id !== id));
    };

    // Çıkış sil
    const deleteExit = (id) => {
        setExits(prev => prev.filter(e => e.id !== id));
    };

    // Stok hesapla
    const calculateStock = () => {
        const stock = {};

        // Girişleri ekle
        entries.forEach(entry => {
            const fishType = fishTypes.find(f => f.id === entry.fishTypeId);
            if (fishType) {
                if (!stock[fishType.id]) {
                    stock[fishType.id] = {
                        ...fishType,
                        quantity: 0,
                    };
                }
                stock[fishType.id].quantity += entry.quantity;
            }
        });

        // Çıkışları çıkar
        exits.forEach(exit => {
            const fishType = fishTypes.find(f => f.id === exit.fishTypeId);
            if (fishType && stock[fishType.id]) {
                stock[fishType.id].quantity -= exit.quantity;
            }
        });

        // Sıfırdan büyük olanları döndür
        return Object.values(stock).filter(item => item.quantity > 0);
    };

    // Günlük istatistikler
    const getDailyStats = (date = new Date()) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyEntries = entries.filter(e => {
            const entryDate = new Date(e.timestamp);
            return entryDate >= startOfDay && entryDate <= endOfDay;
        });

        const dailyExits = exits.filter(e => {
            const exitDate = new Date(e.timestamp);
            return exitDate >= startOfDay && exitDate <= endOfDay;
        });

        const totalEntry = dailyEntries.reduce((sum, e) => sum + e.quantity, 0);
        const totalExit = dailyExits.reduce((sum, e) => sum + e.quantity, 0);
        const stock = calculateStock();
        const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
        const uniqueTypes = new Set([
            ...dailyEntries.map(e => e.fishTypeId),
            ...dailyExits.map(e => e.fishTypeId),
        ]).size;

        return {
            totalEntry,
            totalExit,
            totalStock,
            uniqueTypes,
            entries: dailyEntries,
            exits: dailyExits,
        };
    };

    // Tüm işlemler (giriş + çıkış)
    const getAllTransactions = (date = null) => {
        let filteredEntries = entries;
        let filteredExits = exits;

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            filteredEntries = entries.filter(e => {
                const d = new Date(e.timestamp);
                return d >= startOfDay && d <= endOfDay;
            });

            filteredExits = exits.filter(e => {
                const d = new Date(e.timestamp);
                return d >= startOfDay && d <= endOfDay;
            });
        }

        const transactions = [
            ...filteredEntries.map(e => ({ ...e, type: 'entry' })),
            ...filteredExits.map(e => ({ ...e, type: 'exit' })),
        ];

        return transactions.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };

    return {
        fishTypes,
        entries,
        exits,
        addEntry,
        addExit,
        deleteEntry,
        deleteExit,
        calculateStock,
        getDailyStats,
        getAllTransactions,
    };
};

export default useStorage;
