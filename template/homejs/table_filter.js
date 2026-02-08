document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('input[name="table_search"]');
    const typeSelect = document.querySelector('select[name="table_type"]');
    const tableBody = document.querySelector('.table-container tbody');
    const form = document.querySelector('.post_job form');

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
    typeSelect.addEventListener('change', fetchOrders);

    function fetchOrders() {
        const search = searchInput.value;
        const type = typeSelect.value;

        // Build URL
        const url = new URL('/api/general/orders', window.location.origin);
        if (search) url.searchParams.append('table_search', search);
        if (type) url.searchParams.append('table_type', type);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateTable(data.data);
                } else {
                    console.error('Error fetching data:', data.message);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }

    function updateTable(orders) {
        tableBody.innerHTML = '';

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
});
