let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let totalBox = document.getElementById("totalBox");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let addProduct;
let mode = "create";

if (localStorage.products != null) {
  addProduct = JSON.parse(localStorage.products);
} else {
  addProduct = [];
}
function getTotal() {
  if (price.value.trim() !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;

    totalBox.classList.remove("bg-danger");
    totalBox.classList.add("bg-success");
  } else {
    total.innerHTML = "0";

    totalBox.classList.remove("bg-success");
    totalBox.classList.add("bg-danger");
  }
}

function validateInputs() {
  const title = document.getElementById("title").value.trim();
  const price = document.getElementById("price").value;
  const taxes = document.getElementById("taxes").value;
  const ads = document.getElementById("ads").value;
  const discount = document.getElementById("discount").value;
  const count = document.getElementById("count").value;
  const category = document.getElementById("category").value.trim();

  // Title validation
  if (!title) {
    Swal.fire({
      icon: 'error',
      title: 'Product Name Required',
      text: 'Please enter a product name',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  if (title.length < 3) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Product Name',
      text: 'Product name must be at least 3 characters long',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // Price validation
  if (!price || price <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Price',
      text: 'Please enter a valid price greater than 0',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // Count validation
  if (!count || count <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Count',
      text: 'Please enter a valid count greater than 0',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // Category validation
  if (!category) {
    Swal.fire({
      icon: 'error',
      title: 'Category Required',
      text: 'Please enter a category name',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  if (category.length < 3) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Category',
      text: 'Category name must be at least 3 characters long',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // Optional fields validation (convert to number or 0 if empty)
  const taxesNum = taxes ? Number(taxes) : 0;
  const adsNum = ads ? Number(ads) : 0;
  const discountNum = discount ? Number(discount) : 0;

  // Validate numbers are not negative
  if (taxesNum < 0 || adsNum < 0 || discountNum < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Values',
      text: 'Taxes, Ads, and Discount cannot be negative',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  return {
    title,
    price: Number(price),
    taxes: taxesNum,
    ads: adsNum,
    discount: discountNum,
    count: Number(count),
    category
  };
}

function createProduct() {
  const validatedData = validateInputs();
  if (!validatedData) return;

  let now = new Date();
  let date = now.toLocaleDateString("en-GB");
  let time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  let day = now.toLocaleDateString("en-US", { weekday: "long" });

  let product = {
    title: validatedData.title,
    price: validatedData.price,
    taxes: validatedData.taxes,
    ads: validatedData.ads,
    discount: validatedData.discount,
    total: total.innerHTML,
    count: validatedData.count,
    category: validatedData.category,
    createdAt: `${day}, ${date} - ${time}`,
  };

  if (product.title && product.price && product.category) {
    let productCount = parseInt(product.count);

    if (productCount > 1) {
      for (let i = 0; i < productCount; i++) {
        addProduct.push({ ...product, count: 1 });
      }
    } else {
      addProduct.push(product);
    }

    localStorage.setItem("products", JSON.stringify(addProduct));
    clearData();
    showData();

    Swal.fire({
      title: "✅ Product(s) Added!",
      text: `${productCount > 1 ? productCount : 1} "${
        product.title
      }" added successfully.`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
  } else {
    Swal.fire({
      title: "⚠ Missing Information",
      text: "Please fill in all required fields (Title, Price, and Category).",
      icon: "warning",
    });
  }
}

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "0";
  count.value = "";
  category.value = "";
  totalBox.classList.remove("bg-success");
  totalBox.classList.add("bg-danger");
}
function showData() {
  let table = "";
  for (let i = 0; i < addProduct.length; i++) {
    table += `
      <tr class="text-center">
        <td>${i + 1}</td>
        <td>${addProduct[i].title}</td>
        <td>${addProduct[i].price}</td>
        <td>${addProduct[i].taxes}</td>
        <td>${addProduct[i].ads}</td>
        <td>${addProduct[i].discount}</td>
        <td class="fw-bold text-success">${addProduct[i].total}</td>
        <td>${addProduct[i].count}</td>
        <td>${addProduct[i].category}</td>
        <td>${addProduct[i].createdAt || "N/A"}</td>
        <td><button onclick="updateData(${i})" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button></td>
        <td><button onclick="deleteData(${i})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;
}

function deleteData(i) {
  Swal.fire({
    title: "⚠ Confirm Deletion",
    text: "Are you sure you want to delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "🗑 Yes, Delete",
    cancelButtonText: "❌ Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      addProduct.splice(i, 1);
      localStorage.setItem("products", JSON.stringify(addProduct));
      showData();

      Swal.fire({
        title: "✅ Deleted!",
        text: "The product has been removed successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

function deleteAll() {
  Swal.fire({
    title: "⚠ Confirm Deletion",
    text: "Do you want to delete all data or just products?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "🗑 Delete Everything",
    cancelButtonText: "🔍 More Options",
  }).then((result) => {
    if (result.isConfirmed) {
      // Delete all data
      localStorage.clear();
      addProduct = [];
      showData();
      Swal.fire(
        "✅ Deleted!",
        "All data has been successfully deleted.",
        "success"
      );
    } else {
      Swal.fire({
        title: "❗ Delete Products Only?",
        text: "Do you want to remove products but keep login data?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "🛒 Delete Products Only",
        cancelButtonText: "❌ Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("products");
          addProduct = [];
          showData();
          Swal.fire(
            "✅ Deleted!",
            "Products have been removed while keeping other data.",
            "success"
          );
        } else {
          Swal.fire("⚠ No changes", "No data has been deleted.", "info");
        }
      });
    }
  });
}

function updateData(i) {
  title.value = addProduct[i].title;
  price.value = addProduct[i].price;
  taxes.value = addProduct[i].taxes;
  ads.value = addProduct[i].ads;
  discount.value = addProduct[i].discount;
  category.value = addProduct[i].category;
  getTotal();

  count.style.display = "none";
  submit.innerHTML = "Update";
  submit.classList.remove("btn-primary");
  submit.classList.add("btn-warning");

  mode = "update";
  submit.setAttribute("onclick", `update(${i})`);
  scrollTo(0, 0);
  document.querySelector(".form-title").innerHTML = "Update Product";
  document.querySelector(".form-title").classList.add("text-warning");
  document.querySelector(".form-title").classList.remove("text-primary");
  document.querySelector(".form-title").style.fontSize = "1.5rem";
  document.querySelector(".form-title").style.fontWeight = "bold";
  document.querySelector(".form-title").style.transition =
    "all .3s ease-in-out";
}

function update(i) {
  let product = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (product.title && product.price && product.category) {
    addProduct[i] = product;
    localStorage.setItem("products", JSON.stringify(addProduct));
    clearData();
    showData();

    Swal.fire({
      title: "✅ Product Updated!",
      text: `"${product.title}" updated successfully.`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });

    submit.innerHTML = "Create";
    submit.classList.remove("btn-warning");
    submit.classList.add("btn-primary");
    mode = "create";
    count.style.display = "block";
  } else {
    Swal.fire({
      title: "⚠ Missing Information",
      text: "Please fill in all required fields (Title, Price, and Category).",
      icon: "warning",
    });
  }
}
function displayAllProducts() {
  if (addProduct.length > 0) {
    showData();

    Swal.fire({
      title: "📦 Products Loaded",
      text: `Showing all ${addProduct.length} products.`,
      icon: "info",
      confirmButtonText: "OK",
    });
  } else {
    Swal.fire({
      title: "❌ No Products Found",
      text: "You have no products to show.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  }
}
function displayAllCategories() {
  if (addProduct.length > 0) {
    const categories = [
      ...new Set(addProduct.map((p) => p.category.toLowerCase())),
    ];
    const formatted = categories.map((c, i) => `${i + 1}- ${c}`).join("\n");

    Swal.fire({
      title: `📚 Categories (${categories.length})`,
      html: `<pre style="text-align: left">${formatted}</pre>`,
      icon: "info",
      confirmButtonText: "Close",
    });
  } else {
    Swal.fire({
      title: "❌ No Products Found",
      text: "Add some products to see categories.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  }
}
let searchMode = "title";

function searchProducts(id) {
  let searchInput = document.getElementById("search");

  if (id === "searchByTitle") {
    searchMode = "title";
  } else {
    searchMode = "category";
  }

  document.getElementById("searchByTitle").classList.remove("active");
  document.getElementById("searchByCategory").classList.remove("active");

  document.getElementById(id).classList.add("active");

  searchInput.focus();
  searchProductsNow();
}

function searchProductsNow() {
  let searchValue = document.getElementById("search").value.toLowerCase();
  let table = "";

  for (let i = 0; i < addProduct.length; i++) {
    if (addProduct[i][searchMode].toLowerCase().includes(searchValue)) {
      table += `
        <tr class="text-center">
          <td>${i + 1}</td>
          <td>${addProduct[i].title}</td>
          <td>${addProduct[i].price}</td>
          <td>${addProduct[i].taxes}</td>
          <td>${addProduct[i].ads}</td>
          <td>${addProduct[i].discount}</td>
          <td class="fw-bold text-success">${addProduct[i].total}</td>
          <td>${addProduct[i].count}</td>
          <td>${addProduct[i].category}</td>
          <td>${addProduct[i].createdAt || "N/A"}</td>
          <td><button onclick="updateData(${i})" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button></td>
          <td><button onclick="deleteData(${i})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    }
  }

  document.getElementById("tbody").innerHTML = table;
}
