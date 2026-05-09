// LocalStorage 관리 모듈
const BucketStorage = {
    STORAGE_KEY: 'bucketList',

    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const rawList = data ? JSON.parse(data) : [];
            return rawList.map(item => this.normalizeItem(item));
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            return [];
        }
    },

    save(bucketList) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bucketList));
            return true;
        } catch (error) {
            console.error('데이터 저장 실패:', error);
            return false;
        }
    },

    normalizeItem(item) {
        return {
            ...item,
            priority: item.priority || 'medium',
            dueDate: item.dueDate ?? null,
            category: item.category ?? null
        };
    },

    addItem(title, priority = 'medium', dueDate = null, category = null) {
        const bucketList = this.load();
        const newItem = {
            id: Date.now().toString(),
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            priority,
            dueDate: dueDate || null,
            category: category ? category.trim() : null
        };
        const updated = [newItem, ...bucketList];
        this.save(updated);
        return newItem;
    },

    updateItem(id, newTitle, newPriority, newDueDate, newCategory) {
        const bucketList = this.load();
        const index = bucketList.findIndex(item => item.id === id);

        if (index === -1) return false;

        const updated = bucketList.map(item =>
            item.id === id
                ? {
                    ...item,
                    title: newTitle.trim(),
                    priority: newPriority || item.priority,
                    dueDate: newDueDate || null,
                    category: newCategory ? newCategory.trim() : null
                }
                : item
        );
        this.save(updated);
        return true;
    },

    deleteItem(id) {
        const bucketList = this.load();
        const filtered = bucketList.filter(item => item.id !== id);

        if (filtered.length !== bucketList.length) {
            this.save(filtered);
            return true;
        }
        return false;
    },

    toggleComplete(id) {
        const bucketList = this.load();
        const item = bucketList.find(item => item.id === id);

        if (!item) return false;

        const nowCompleted = !item.completed;
        const updated = bucketList.map(i =>
            i.id === id
                ? { ...i, completed: nowCompleted, completedAt: nowCompleted ? new Date().toISOString() : null }
                : i
        );
        this.save(updated);
        return nowCompleted;
    },

    getStats() {
        const bucketList = this.load();
        const total = bucketList.length;
        const completed = bucketList.filter(item => item.completed).length;
        const progress = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const today = new Date().toISOString().slice(0, 10);
        const overdue = bucketList.filter(item =>
            !item.completed && item.dueDate && item.dueDate < today
        ).length;

        return { total, completed, progress, completionRate, overdue };
    },

    getFilteredList(filter = 'all') {
        const bucketList = this.load();

        switch (filter) {
            case 'active':
                return bucketList.filter(item => !item.completed);
            case 'completed':
                return bucketList.filter(item => item.completed);
            default:
                return bucketList;
        }
    },

    getAllCategories() {
        const bucketList = this.load();
        const categories = bucketList
            .map(item => item.category)
            .filter(c => c !== null && c !== '');
        return [...new Set(categories)];
    }
};
