src = "https://code.jquery.com/jquery-3.5.1.slim.min.js"
src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"
src = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"

//Agar saat scroll navbar menghilang
var prevScrollpos = window.pageYOffset;
var navbar = document.getElementById("mainNav");

window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;

    if (prevScrollpos > currentScrollPos) {
        // Scroll up, show navbar
        navbar.style.top = "0";
        navbar.style.backgroundColor = "rgba(255, 102, 0, 1)"; // Solid background color
    } else {
        // Scroll down, hide navbar
        navbar.style.top = "-110px"; // Sesuaikan dengan tinggi navbar Anda
        navbar.style.backgroundColor = "rgba(255, 102, 0, 0.8)"; // Transparent background color
    }

    prevScrollpos = currentScrollPos;
};

// Tambahkan properti transition
navbar.style.transition = "top 0.3s ease-in-out, background-color 0.3s ease-in-out";

// Fungsi untuk menyimpan pengaturan dalam local storage
function saveSettingsToLocalStorage() {
    var itemsPerPageSelect = document.getElementById("itemsPerPage");
    var sortOptionsSelect = document.getElementById("sortOptions");

    localStorage.setItem("itemsPerPage", itemsPerPageSelect.value);
    localStorage.setItem("sortOption", sortOptionsSelect.value);
}

// Fungsi untuk mengambil pengaturan dari local storage
function getSettingsFromLocalStorage() {
    var itemsPerPageSelect = document.getElementById("itemsPerPage");
    var sortOptionsSelect = document.getElementById("sortOptions");

    var itemsPerPage = localStorage.getItem("itemsPerPage");
    var sortOption = localStorage.getItem("sortOption");

    if (itemsPerPage) {
        itemsPerPageSelect.value = itemsPerPage;
    }

    if (sortOption) {
        sortOptionsSelect.value = sortOption;
    }
}

// Memanggil fungsi untuk mengambil pengaturan dari local storage
getSettingsFromLocalStorage();

// Fungsi untuk menggenerate card sesuai jumlah yang dipilih
function generateCards(num) {
    var portfolioItems = document.getElementById("portfolioItems");
    portfolioItems.innerHTML = "";

    for (var i = 1; i <= num; i++) {
        var isOdd = i % 2 !== 0; // Cek apakah angka ganjil atau genap
        var imageUrl = isOdd ? "assets/img/portfolio/gambar1.jpeg" : "assets/img/portfolio/gambar2.jpg";
        var cardText = isOdd ? "Kenali Tingkatan Influencers berdasarkan jumlah Followers" : "Jangan Asal Pilih Influencer Berikut Cara Menyusun Strategi Influencer...";

        var card = `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card mx-auto" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#portfolioModal${i}">
                    <img class="card-img-top" src="${imageUrl}" alt="...">
                    <div class="card-body d-flex flex-column align-items-center">
                        <p class="card-title text-left text-muted">5 September 2022 ${i}</p>
                        <p class="card-text fw-bold">${cardText}</p>                    
                    </div>
                </div>
            </div>
        `;

        portfolioItems.innerHTML += card;
    }
}

//fungsi teks showing
function updateCardsPerPage() {
    var itemsPerPageSelect = document.getElementById("itemsPerPage");
    var selectedValue = parseInt(itemsPerPageSelect.value);
    var totalItems = 100; // Jumlah total item, bisa disesuaikan sesuai kebutuhan

    // Update teks "Showing X - Y of Z"
    var showingTo = selectedValue < totalItems ? selectedValue : totalItems;
    var showingText = "Showing 1 - " + showingTo + " of " + totalItems;
    document.getElementById("showingText").innerText = showingText;

    generateCards(selectedValue);
    saveSettingsToLocalStorage();
}

document.getElementById("itemsPerPage").addEventListener("change", updateCardsPerPage);

updateCardsPerPage();


//FUNGSI NEWEST OLDEST
document.getElementById("sortOptions").addEventListener("change", function () {
    var sortOption = this.value;
    sortCards(sortOption);
});

function sortCards(option) {
    var portfolioItems = document.getElementById("portfolioItems");
    var cards = portfolioItems.querySelectorAll(".card");

    var sortedCards = Array.from(cards).sort(function (a, b) {
        var titleA = a.querySelector(".card-title").innerText;
        var titleB = b.querySelector(".card-title").innerText;

        if (option === "newest") {
            return parseInt(titleA.replace("5 September 2022 ", "")) - parseInt(titleB.replace("5 September 2022 ", ""));
        } else if (option === "oldest") {
            return parseInt(titleB.replace("5 September 2022 ", "")) - parseInt(titleA.replace("5 September 2022 ", ""));
        }
    });

    // Membuang card lama dan menambahkan card yang telah diurutkan
    portfolioItems.innerHTML = "";
    sortedCards.forEach(function (card, index) {
        card.style.order = index + 1;
        portfolioItems.appendChild(card);
    });
    saveSettingsToLocalStorage();
}

// Panggil fungsi sortCards dengan nilai awal
sortCards("newest");

//LAZYLOADING
document.addEventListener("DOMContentLoaded", function () {
    var lazyImages = document.querySelectorAll('.lazy-load');

    var lazyLoad = function (target) {
        var io = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    img.src = img.dataset.src;
                    observer.disconnect();
                }
            });
        });

        io.observe(target);
    };

    lazyImages.forEach(function (img) {
        lazyLoad(img);
    });
});

//PAGENATION
function activeLink(pageNumber) {
    // Menghapus kelas 'active' dari semua elemen dengan kelas 'link'
    var links = document.querySelectorAll('.link');
    links.forEach(function (link) {
        link.classList.remove('active');
    });

    // Menambahkan kelas 'active' ke elemen yang mewakili halaman yang diklik
    var currentPage = document.querySelector('.link[value="' + pageNumber + '"]');
    currentPage.classList.add('active');

    // Implementasikan logika lain yang diperlukan untuk halaman yang diaktifkan
    // ...
}

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware untuk menangani permintaan ke /api/ideas
app.get('/api/ideas', async (req, res) => {
    try {
        const apiUrl = 'https://suitmedia-backend.suitdev.com/api/ideas';
        const params = {
            'page[number]': req.query['page[number]'] || 1,
            'page[size]': req.query['page[size]'] || 10,
            append: req.query.append || ['small_image', 'medium_image'],
            sort: req.query.sort || 'published_at',
        };

        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const response = await fetch(`${apiUrl}?${queryString}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Jalankan server pada port yang ditentukan
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
