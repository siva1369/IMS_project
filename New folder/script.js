document.addEventListener("DOMContentLoaded", () => {
    const addProductBtn = document.getElementById("addProductBtn");
    const productModal = document.getElementById("productModal");
    const productForm = document.getElementById("productForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const productTableBody = document.getElementById("productTableBody");
    const totalProductsEl = document.getElementById("totalProducts");
    const lowStockItemsEl = document.getElementById("lowStockItems");
    const totalSuppliersEl = document.getElementById("totalSuppliers");
    const dashboard = document.getElementById("dashboard");
    const products = document.getElementById("products");
    const reports = document.getElementById("reports");
    const categoryChartCanvas = document.getElementById("categoryChart");
    let editProductRow = null;

    // Chart instance
    let categoryChart;

    // Show Modal
    const showModal = (isEdit = false, productData = {}) => {
        document.getElementById("modalTitle").textContent = isEdit ? "Edit Product" : "Add Product";
        productModal.classList.remove("hidden");
        productForm.productName.value = productData.name || "";
        productForm.productCategory.value = productData.category || "";
        productForm.productStock.value = productData.stock || "";
        productForm.productPrice.value = productData.price || "";
    };

    // Hide Modal
    const hideModal = () => {
        productModal.classList.add("hidden");
        productForm.reset();
        editProductRow = null;
    };

    // Add/Edit Product
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const productData = {
            name: productForm.productName.value,
            category: productForm.productCategory.value,
            stock: parseInt(productForm.productStock.value, 10),
            price: parseFloat(productForm.productPrice.value).toFixed(2),
        };

        if (editProductRow) {
            // Edit existing row
            editProductRow.innerHTML = createTableRowHTML({ id: editProductRow.dataset.id, ...productData });
        } else {
            // Add new row
            const newRow = document.createElement("tr");
            const id = Date.now(); // Use timestamp as unique ID
            newRow.dataset.id = id;
            newRow.innerHTML = createTableRowHTML({ id, ...productData });
            productTableBody.appendChild(newRow);
        }

        updateDashboard();
        updateChart();
        hideModal();
    });

    // Create Table Row HTML
    const createTableRowHTML = ({ id, name, category, stock, price }) => `
        <td>${id}</td>
        <td>${name}</td>
        <td>${category}</td>
        <td>${stock}</td>
        <td>$${price}</td>
        <td>
            <button class="btn edit" onclick="editProduct(this)">Edit</button>
            <button class="btn delete" onclick="deleteProduct(this)">Delete</button>
        </td>
    `;

    // Edit Product
    window.editProduct = (button) => {
        const row = button.closest("tr");
        editProductRow = row;
        showModal(true, {
            name: row.children[1].textContent,
            category: row.children[2].textContent,
            stock: row.children[3].textContent,
            price: row.children[4].textContent.replace("$", ""),
        });
    };

    // Delete Product
    window.deleteProduct = (button) => {
        if (confirm("Are you sure you want to delete this product?")) {
            button.closest("tr").remove();
            updateDashboard();
            updateChart();
        }
    };

    // Cancel Modal
    cancelBtn.addEventListener("click", hideModal);

    // Add Product Button
    addProductBtn.addEventListener("click", () => {
        showModal(false);
    });

    // Update Dashboard Stats
    const updateDashboard = () => {
        const rows = productTableBody.querySelectorAll("tr");
        const totalProducts = rows.length;
        const lowStockItems = Array.from(rows).filter(row => parseInt(row.children[3].textContent, 10) < 10).length;
        const suppliers = new Set(Array.from(rows).map(row => row.children[2].textContent)).size;

        totalProductsEl.textContent = totalProducts;
        lowStockItemsEl.textContent = lowStockItems;
        totalSuppliersEl.textContent = suppliers;
    };

    // Update Pie Chart
    const updateChart = () => {
        const rows = productTableBody.querySelectorAll("tr");
        const categoryCounts = {};

        rows.forEach(row => {
            const category = row.children[2].textContent;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        if (categoryChart) {
            categoryChart.destroy();
        }

        categoryChart = new Chart(categoryChartCanvas, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#E91E63', '#FFC107'],
                }]
            }
        });
    };
    reportsLink.addEventListener('click', () => {
        toggleSection(reports);
        initializeChart(productsData); // Call the function from reports.js
    });
    
    // Navigation
    const links = {
        dashboardLink: dashboard,
        productsLink: products,
        reportsLink: reports,
    };

    Object.keys(links).forEach(linkId => {
        document.getElementById(linkId).addEventListener("click", (e) => {
            e.preventDefault();
            Object.values(links).forEach(section => section.classList.add("hidden"));
            links[linkId].classList.remove("hidden");
        });
    });
});
