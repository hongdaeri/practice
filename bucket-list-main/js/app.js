// 메인 애플리케이션 로직
class BucketListApp {
    constructor() {
        this.currentFilter = 'all';
        this.currentCategory = null;
        this.editingId = null;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    }

    cacheElements() {
        this.bucketForm = document.getElementById('bucketForm');
        this.bucketInput = document.getElementById('bucketInput');
        this.priorityInput = document.getElementById('priorityInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.categoryInput = document.getElementById('categoryInput');
        this.toggleOptionsBtn = document.getElementById('toggleOptions');
        this.optionalFields = document.getElementById('optionalFields');

        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.progressCount = document.getElementById('progressCount');
        this.completionRate = document.getElementById('completionRate');
        this.overdueCount = document.getElementById('overdueCount');

        this.bucketListContainer = document.getElementById('bucketListContainer');
        this.emptyState = document.getElementById('emptyState');
        this.categoryFilters = document.getElementById('categoryFilters');

        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editInput = document.getElementById('editInput');
        this.editPriorityInput = document.getElementById('editPriorityInput');
        this.editDueDateInput = document.getElementById('editDueDateInput');
        this.editCategoryInput = document.getElementById('editCategoryInput');
        this.cancelEditBtn = document.getElementById('cancelEdit');
    }

    bindEvents() {
        this.bucketForm.addEventListener('submit', (e) => this.handleAdd(e));

        this.toggleOptionsBtn.addEventListener('click', () => {
            const isHidden = this.optionalFields.classList.toggle('hidden');
            this.toggleOptionsBtn.textContent = isHidden ? '옵션 추가 ▾' : '옵션 숨기기 ▴';
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
    }

    handleAdd(e) {
        e.preventDefault();

        const title = this.bucketInput.value.trim();
        if (!title) {
            alert('버킷 리스트 내용을 입력해주세요!');
            return;
        }

        const priority = this.priorityInput.value;
        const dueDate = this.dueDateInput.value || null;
        const category = this.categoryInput.value.trim() || null;

        BucketStorage.addItem(title, priority, dueDate, category);

        this.bucketInput.value = '';
        this.dueDateInput.value = '';
        this.categoryInput.value = '';
        this.priorityInput.value = 'medium';
        this.bucketInput.focus();
        this.render();
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        this.currentCategory = null;

        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.render();
    }

    handleCategoryFilter(category) {
        this.currentCategory = this.currentCategory === category ? null : category;
        this.render();
    }

    handleToggle(id) {
        BucketStorage.toggleComplete(id);
        this.render();
    }

    openEditModal(id, encodedItem) {
        const item = JSON.parse(decodeURIComponent(encodedItem));
        this.editingId = id;
        this.editInput.value = item.title;
        this.editPriorityInput.value = item.priority || 'medium';
        this.editDueDateInput.value = item.dueDate || '';
        this.editCategoryInput.value = item.category || '';
        this.editModal.classList.remove('hidden');
        this.editModal.classList.add('flex');
        this.editInput.focus();
    }

    closeEditModal() {
        this.editingId = null;
        this.editInput.value = '';
        this.editPriorityInput.value = 'medium';
        this.editDueDateInput.value = '';
        this.editCategoryInput.value = '';
        this.editModal.classList.add('hidden');
        this.editModal.classList.remove('flex');
    }

    handleEditSubmit(e) {
        e.preventDefault();

        const newTitle = this.editInput.value.trim();
        if (!newTitle) {
            alert('버킷 리스트 내용을 입력해주세요!');
            return;
        }

        if (this.editingId) {
            const newPriority = this.editPriorityInput.value;
            const newDueDate = this.editDueDateInput.value || null;
            const newCategory = this.editCategoryInput.value.trim() || null;
            BucketStorage.updateItem(this.editingId, newTitle, newPriority, newDueDate, newCategory);
            this.closeEditModal();
            this.render();
        }
    }

    handleDelete(id, title) {
        if (confirm(`"${title}"\n정말 삭제하시겠습니까?`)) {
            BucketStorage.deleteItem(id);
            this.render();
        }
    }

    updateStats() {
        const stats = BucketStorage.getStats();
        this.totalCount.textContent = stats.total;
        this.completedCount.textContent = stats.completed;
        this.progressCount.textContent = stats.progress;
        this.completionRate.textContent = `${stats.completionRate}%`;
        this.overdueCount.textContent = stats.overdue;
    }

    formatDueDate(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate + 'T00:00:00');
        const diffDays = Math.round((due - today) / 86400000);

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '내일';
        if (diffDays > 1) return `${diffDays}일 후`;
        return `${Math.abs(diffDays)}일 초과`;
    }

    isOverdue(item) {
        if (item.completed || !item.dueDate) return false;
        const today = new Date().toISOString().slice(0, 10);
        return item.dueDate < today;
    }

    createPriorityBadgeHTML(priority) {
        const labels = { high: '높음', medium: '중간', low: '낮음' };
        const label = labels[priority] || '중간';
        return `<span class="badge badge-priority-${priority}">${label}</span>`;
    }

    createDueDateHTML(dueDate) {
        if (!dueDate) return '';
        const text = this.formatDueDate(dueDate);
        return `<span class="due-date">📅 ${text}</span>`;
    }

    createCategoryBadgeHTML(category) {
        if (!category) return '';
        return `<span class="badge badge-category">${this.escapeHtml(category)}</span>`;
    }

    createBucketItemHTML(item) {
        const overdue = this.isOverdue(item);
        const titleClass = item.completed ? 'line-through text-gray-400' : 'text-gray-800';
        const checkIcon = item.completed ? '✓' : '';
        const checkBtnClass = item.completed ? 'check-btn checked' : 'check-btn';
        let itemClass = item.completed ? 'bucket-item completed' : 'bucket-item';
        if (overdue) itemClass += ' overdue';

        const encodedItem = encodeURIComponent(JSON.stringify({
            title: item.title,
            priority: item.priority,
            dueDate: item.dueDate,
            category: item.category
        }));

        return `
            <div class="${itemClass}">
                <button
                    class="${checkBtnClass}"
                    onclick="app.handleToggle('${item.id}')"
                >
                    <span class="text-sm font-bold">${checkIcon}</span>
                </button>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
                        ${this.createPriorityBadgeHTML(item.priority)}
                        <p class="text-base font-medium ${titleClass} break-words">${this.escapeHtml(item.title)}</p>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-xs text-gray-400">
                            ${new Date(item.createdAt).toLocaleDateString('ko-KR')} 생성
                            ${item.completedAt ? ` · ${new Date(item.completedAt).toLocaleDateString('ko-KR')} 완료` : ''}
                        </p>
                        ${this.createDueDateHTML(item.dueDate)}
                        ${this.createCategoryBadgeHTML(item.category)}
                    </div>
                </div>

                <div class="flex gap-2 flex-shrink-0">
                    <button
                        class="btn-edit"
                        onclick="app.openEditModal('${item.id}', '${encodedItem}')"
                    >
                        수정
                    </button>
                    <button
                        class="btn-delete"
                        onclick="app.handleDelete('${item.id}', '${this.escapeHtml(item.title).replace(/'/g, "\\'")}')"
                    >
                        삭제
                    </button>
                </div>
            </div>
        `;
    }

    renderCategoryFilters() {
        const categories = BucketStorage.getAllCategories();

        if (categories.length === 0) {
            this.categoryFilters.classList.add('hidden');
            return;
        }

        this.categoryFilters.classList.remove('hidden');

        const allBtn = `<button
            class="filter-btn${this.currentCategory === null ? ' active' : ''}"
            onclick="app.handleCategoryFilter(null)"
        >전체 카테고리</button>`;

        const catBtns = categories.map(cat => `<button
            class="filter-btn${this.currentCategory === cat ? ' active' : ''}"
            onclick="app.handleCategoryFilter('${this.escapeHtml(cat).replace(/'/g, "\\'")}')"
        >${this.escapeHtml(cat)}</button>`).join('');

        this.categoryFilters.innerHTML = allBtn + catBtns;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        this.updateStats();

        let bucketList = BucketStorage.getFilteredList(this.currentFilter);

        if (this.currentCategory !== null) {
            bucketList = bucketList.filter(item => item.category === this.currentCategory);
        }

        this.renderCategoryFilters();

        if (bucketList.length === 0) {
            this.bucketListContainer.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        this.bucketListContainer.innerHTML = bucketList
            .map(item => this.createBucketItemHTML(item))
            .join('');
    }
}

// 앱 인스턴스 생성
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BucketListApp();
});
