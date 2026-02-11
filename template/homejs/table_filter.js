document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('input[name="table_search"]');
    const typeSelect = document.querySelector('select[name="table_type"]');
    const tableBody = document.querySelector('.table-container tbody');
    const form = document.querySelector('.post_job form');
    const paginationContainer = document.getElementById('jobPagination');

    let currentPage = 1;

    // Prevent default form submission
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            fetchOrders();
        });
    }

    // Debounce function for search
    let timeout = null;
    searchInput.addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(fetchOrders, 500);
    });

    // Immediate fetch on select change
    typeSelect.addEventListener('change', () => {
        currentPage = 1; // Reset to page 1 on filter change
        fetchOrders();
    });

    function fetchOrders() {
        const search = searchInput.value;
        const type = typeSelect.value;

        // Build URL
        const url = new URL('/api/general/orders', window.location.origin);
        if (search) url.searchParams.append('table_search', search);
        if (type) url.searchParams.append('table_type', type);
        url.searchParams.append('page', currentPage);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateTable(data.data, data.pagination);
                } else {
                    console.error('Error fetching data:', data.message);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }

    function updateTable(orders, pagination) {
        tableBody.innerHTML = '';

        // Render Pagination if available
        if (pagination) {
            renderPagination(pagination);
        }

        if (orders.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        ยังไม่มีงานที่คุณประกาศ (ไม่พบข้อมูลตามเงื่อนไข)
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.onclick = function () {
                window.location.href = `/home/viewGeneralPost/${order.order_ID}`;
            };

            const budget = Number(order.budjet).toLocaleString();

            const postDate = new Date(order.post_date).toLocaleDateString('th-TH');

            let deadline = '-';
            if (order.deadline) {
                deadline = new Date(order.deadline).toLocaleDateString('th-TH');
            }

            tr.innerHTML = `
                <td>${order.title || ''}</td>
                <td>${order.orderType || ''}</td>
                <td>${budget}</td>
                <td>${postDate}</td>
                <td>${deadline}</td>
                <td>-</td>
            `;

            tableBody.appendChild(tr);
        });
    }

    function renderPagination(pagination) {
        paginationContainer.innerHTML = '';
        const { currentPage: page, totalPage } = pagination;

        if (totalPage <= 1) return;

        // Prev Button
        if (page > 1) {
            const prev = document.createElement('a');
            prev.href = '#';
            prev.innerHTML = '<small><</small>';
            prev.onclick = (e) => {
                e.preventDefault();
                currentPage = page - 1;
                fetchOrders();
            };
            paginationContainer.appendChild(prev);
        }

        // Page Numbers
        for (let i = 1; i <= totalPage; i++) {
            const btn = document.createElement('a');
            btn.href = '#';
            btn.className = `page-btn ${i === page ? 'active' : ''}`;
            btn.innerHTML = `<p>${i}</p>`;
            btn.onclick = (e) => {
                e.preventDefault();
                currentPage = i;
                fetchOrders();
            };
            paginationContainer.appendChild(btn);
        }

        // Next Button
        if (page < totalPage) {
            const next = document.createElement('a');
            next.href = '#';
            next.innerHTML = '<small>></small>';
            next.onclick = (e) => {
                e.preventDefault();
                currentPage = page + 1;
                fetchOrders();
            };
            paginationContainer.appendChild(next);
        }
    }
});
