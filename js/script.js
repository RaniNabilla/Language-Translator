// Mendapatkan elemen-elemen DOM yang diperlukan
const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTags = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
      translateBtn = document.querySelector("button");

// Mengisi pilihan bahasa pada elemen selectTag
selectTags.forEach((tag, id) => {
    for (let country_code in countries) {
        // Menentukan opsi yang terpilih berdasarkan bahasa default
        let selected = id == 0 ? (country_code == "en-GB" ? "selected" : "") : (country_code == "bn-IN" ? "selected" : "");
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Menangani peristiwa pertukaran teks dan bahasa
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTags[0].value;
    
    // Menukar nilai antara teks sumber dan teks terjemahan
    fromText.value = toText.value;
    toText.value = tempText;

    // Menukar nilai antara bahasa sumber dan bahasa terjemahan
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
});

// Menangani peristiwa ketika teks sumber diubah
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Menangani peristiwa klik pada tombol terjemahkan
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTags[0].value,
        translateTo = selectTags[1].value;

    // Memeriksa apakah terdapat teks untuk diterjemahkan
    if (!text) return;

    toText.setAttribute("placeholder", "Menerjemahkan...");

    // Mengirim permintaan ke API untuk menerjemahkan teks
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            // Menetapkan hasil terjemahan ke elemen teks tujuan
            toText.value = data.responseData.translatedText;
            // Menampilkan hasil terjemahan yang paling cocok
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            toText.setAttribute("placeholder", "Terjemahan");
        });
});

// Menangani peristiwa klik pada ikon-ikon suara dan salin
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        // Memastikan ada teks pada kedua teks sumber dan tujuan sebelum menjalankan aksi
        if (!fromText.value || !toText.value) return;

        if (target.classList.contains("fa-copy")) {
            // Menyalin teks ke clipboard
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            // Mengucapkan teks menggunakan sintesis suara
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTags[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTags[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
