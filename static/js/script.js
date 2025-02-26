const result = document.getElementById("result");
result.style.display = "none";

const form = document.querySelector("form");
const usernameInput = document.querySelector("#username");
const questionsContainer = document.getElementById("questions");

function setCookie(name, value) {
  document.cookie = name + "=" + value + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

window.addEventListener("load", function () {
  const username = getCookie("username");
  if (username) {
    usernameInput.value = username;
    fetch("http://127.0.0.1:5000/api/best-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.score) {
          document.getElementById(
            "best-score"
          ).textContent = `En iyi skorunuz: ${data.score}`;
        }
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
  }

  fetch("http://127.0.0.1:5000/api/local-best-score")
    .then((response) => response.json())
    .then((data) => {
      if (data.score) {
        document.getElementById(
          "local-best-score"
        ).textContent = `En iyi skor: ${data.username} - ${data.score}`;
      }
    })
    .catch((error) => {
      console.error("Hata:", error);
    });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  if (username === "") {
    alert("Lütfen adınızı girin.");
    return;
  }

  setCookie("username", username, 7);

  const answers = [];
  const options = document.querySelectorAll(".options");
  options.forEach((option) => {
    const selected = option.querySelector("input:checked");
    if (selected) {
      answers.push(selected.value);
    } else {
      answers.push(null);
    }
  });

  fetch("http://127.0.0.1:5000/check-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      answers: answers,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const score = data.score;

      return fetch("http://127.0.0.1:5000/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          score: score,
          answers: answers,
        }),
      });
    })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("quiz").style.display = "none";
      result.style.display = "block";
      document.getElementById("name").textContent = username;
      document.getElementById("result_score").textContent = data.score;
    })
    .catch((error) => {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    });
});

const questions = [
  {
    question:
      "1. Bir Discord botunun bir kanala mesaj göndermesini sağlayan temel komut yapısı nasıldır?",
    options: [
      { value: "a", text: "A) bot.send_message(channel, message)" },
      { value: "b", text: "B) channel.send(message)" },
      { value: "c", text: "C) message.channel.send(bot)" },
      { value: "d", text: "D) discord.send(message, channel)" },
    ],
  },
  {
    question:
      "2. Bir Flask uygulamasında kullanıcıdan alınan verileri işlemek için hangi HTTP metodu genellikle kullanılır?",
    options: [
      { value: "a", text: "A) GET" },
      { value: "b", text: "B) POST" },
      { value: "c", text: "C) PUT" },
      { value: "d", text: "D) DELETE" },
    ],
  },
  {
    question:
      "3. Yapay zeka modelinin eğitim sürecinde, modelin performansını değerlendirmek ve iyileştirmek için hangi veri kümesi kullanılır?",
    options: [
      { value: "a", text: "A) Eğitim Verisi (Training Data)" },
      { value: "b", text: "B) Doğrulama Verisi (Validation Data)" },
      { value: "c", text: "C) Test Verisi (Test Data)" },
      { value: "d", text: "D) Sentetik Veri (Synthetic Data)" },
    ],
  },
  {
    question:
      "4. Bir resimdeki nesneleri otomatik olarak tanımak için kullanılan tekniklerin genel adı nedir?",
    options: [
      { value: "a", text: "A) Görüntü İşleme (Image Processing)" },
      { value: "b", text: "B) Nesne Tespiti (Object Detection)" },
      { value: "c", text: "C) Özellik Çıkarımı (Feature Extraction)" },
      { value: "d", text: "D) Görüntü Segmentasyonu (Image Segmentation)" },
    ],
  },
  {
    question:
      "5. Cümleleri anlamlı parçalara ayırarak dilbilgisel yapılarını analiz etme işlemine ne ad verilir?",
    options: [
      { value: "a", text: "A) Tokenizasyon (Tokenization)" },
      { value: "b", text: "B) Kök Bulma (Stemming)" },
      { value: "c", text: "C) Ayrıştırma (Parsing)" },
      { value: "d", text: "D) Etiketleme (Tagging)" },
    ],
  },
  {
    question:
      "6. Bir web sayfasının HTML içeriğini ayrıştırmak ve belirli verileri çekmek için hangi Python kütüphanesi kullanılır?",
    options: [
      { value: "a", text: "A) requests" },
      { value: "b", text: "B) scrapy" },
      { value: "c", text: "C) BeautifulSoup" },
      { value: "d", text: "D) Selenium" },
    ],
  },
  {
    question:
      "7. Discord botlarında, belirli bir olaya (örneğin, bir mesajın gönderilmesi) tepki vermek için kullanılan yapıya ne denir?",
    options: [
      { value: "a", text: "A) Komut (Command)" },
      { value: "b", text: "B) Olay İşleyici (Event Handler)" },
      { value: "c", text: "C) Görev (Task)" },
      { value: "d", text: "D) Döngü (Loop)" },
    ],
  },
  {
    question:
      "8. Flask'ta kullanıcıların oturumlarını yönetmek ve kimlik doğrulama işlemlerini gerçekleştirmek için hangi mekanizma kullanılabilir?",
    options: [
      { value: "a", text: "A) Cookies" },
      { value: "b", text: "B) Sessions" },
      { value: "c", text: "C) JWT (JSON Web Tokens)" },
      { value: "d", text: "D) Hepsi" },
    ],
  },
  {
    question:
      "9. Yapay zeka alanında, bir modelin daha önce görmediği verilere ne kadar iyi genelleme yapabildiğini ölçen kavram nedir?",
    options: [
      { value: "a", text: "A) Kesinlik (Precision)" },
      { value: "b", text: "B) Doğruluk (Accuracy)" },
      { value: "c", text: "C) Genelleme (Generalization)" },
      { value: "d", text: "D) Hassasiyet (Recall)" },
    ],
  },
  {
    question:
      "10. Bir görüntüdeki belirli bir nesnenin yerini belirlemek ve etrafını çevrelemek için kullanılan bilgisayar görüşü tekniği nedir?",
    options: [
      { value: "a", text: "A) Kenar Tespiti (Edge Detection)" },
      { value: "b", text: "B) Nesne Segmentasyonu (Object Segmentation)" },
      { value: "c", text: "C) Nesne Tanıma (Object Recognition)" },
      { value: "d", text: "D) Sınır Kutusu (Bounding Box)" },
    ],
  },
  {
    question:
      "11. Metin verilerini analiz ederek duygu (sentiment) belirleme işlemine ne ad verilir?",
    options: [
      { value: "a", text: "A) Metin Madenciliği (Text Mining)" },
      { value: "b", text: "B) Duygu Analizi (Sentiment Analysis)" },
      { value: "c", text: "C) Konu Modelleme (Topic Modeling)" },
      {
        value: "d",
        text: "D) Kelime Anlamı Belirsizliği Giderme (Word Sense Disambiguation)",
      },
    ],
  },
  {
    question:
      "12. Web scraping işleminde, dinamik olarak yüklenen içerikleri çekmek için hangi ek araçlar/teknikler kullanılabilir?",
    options: [
      { value: "a", text: "A) BeautifulSoup" },
      { value: "b", text: "B) requests" },
      { value: "c", text: "C) Selenium" },
      { value: "d", text: "D) urllib" },
    ],
  },
  {
    question:
      "13. Discord botunda bir kullanıcının komutunu algılamak ve buna göre işlem yapmak için hangi özelliği kullanırsınız?",
    options: [
      { value: "a", text: "A) bot.event" },
      { value: "b", text: "B) bot.command" },
      { value: "c", text: "C) bot.listen" },
      { value: "d", text: "D) bot.react" },
    ],
  },
  {
    question:
      "14. Flask'ta, kullanıcıların farklı URL'lere erişimini kontrol etmek ve yetkilendirme sağlamak için ne tür yaklaşımlar kullanılabilir?",
    options: [
      { value: "a", text: "A) Decorators" },
      { value: "b", text: "B) Middleware" },
      { value: "c", text: "C) Flask-Login gibi kütüphaneler" },
      { value: "d", text: "D) Hepsi" },
    ],
  },
  {
    question:
      "15. Yapay zeka modellerinde aşırı öğrenmeyi (overfitting) önlemek için kullanılan yöntemlerden biri nedir?",
    options: [
      { value: "a", text: "A) Daha fazla veri kullanmak" },
      { value: "b", text: "B) Düzenlileştirme (Regularization)" },
      { value: "c", text: "C) Erken Durdurma (Early Stopping)" },
      { value: "d", text: "D) Hepsi" },
    ],
  },
  {
    question:
      "16. Görüntü işlemede, bir resmin çözünürlüğünü artırmak veya piksellerini yumuşatmak için kullanılan tekniklere ne ad verilir?",
    options: [
      { value: "a", text: "A) Gürültü Azaltma (Noise Reduction)" },
      { value: "b", text: "B) Ölçekleme (Scaling)" },
      { value: "c", text: "C) Filtreleme (Filtering)" },
      { value: "d", text: "D) Süper Çözünürlük (Super-Resolution)" },
    ],
  },
  {
    question:
      "17. Metin verilerini makine öğrenimi algoritmaları için uygun hale getirmek amacıyla yapılan ön işleme adımlarından biri nedir?",
    options: [
      { value: "a", text: "A) Tokenizasyon (Tokenization)" },
      { value: "b", text: "B) Kök Bulma (Stemming)" },
      { value: "c", text: "C) Stop Words Temizleme (Stop Word Removal)" },
      { value: "d", text: "D) Hepsi" },
    ],
  },
  {
    question:
      "18. Web sitelerinden veri çekerken, bot olduğunuzu gizlemek ve engellenmeyi önlemek için hangi stratejiler uygulanabilir?",
    options: [
      { value: "a", text: "A) Kullanıcı aracı (User-Agent) değiştirme" },
      { value: "b", text: "B) İstekler arasında gecikme ekleme" },
      { value: "c", text: "C) Proxy sunucuları kullanma" },
      { value: "d", text: "D) Hepsi" },
    ],
  },
  {
    question:
      "19. Discord botunda, birden fazla komutu bir araya getirerek daha karmaşık işlemler gerçekleştirmek için ne kullanılabilir?",
    options: [
      { value: "a", text: "A) Fonksiyonlar" },
      { value: "b", text: "B) Sınıflar" },
      { value: "c", text: "C) Görevler (Tasks)" },
      { value: "d", text: "D) Modüller" },
    ],
  },
  {
    question:
      "20. Flask uygulamasında, veritabanı işlemlerini kolaylaştırmak ve ORM (Object-Relational Mapping) sağlamak için hangi kütüphane yaygın olarak kullanılır?",
    options: [
      { value: "a", text: "A) SQLAlchemy" },
      { value: "b", text: "B) sqlite3" },
      { value: "c", text: "C) pymongo" },
      { value: "d", text: "D) MySQLdb" },
    ],
  },
];

questions.forEach((q, index) => {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("mb-4");

  const questionText = document.createElement("p");
  questionText.classList.add("font-semibold", "mb-2");
  questionText.textContent = q.question;
  questionDiv.appendChild(questionText);

  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("options");

  q.options.forEach((option) => {
    const label = document.createElement("label");
    label.classList.add("block", "mb-2");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index + 1}`;
    input.value = option.value;
    input.classList.add("mr-2");

    label.appendChild(input);
    label.appendChild(document.createTextNode(option.text));
    optionsDiv.appendChild(label);
  });

  questionDiv.appendChild(optionsDiv);
  questionsContainer.appendChild(questionDiv);
});