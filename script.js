let activeInput = null;
let isDragging = false;
let offsetX = 0,
  offsetY = 0;
let isCapsLock = false;
let isShift = false;
let currentLanguage = "english";

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("focus", () => (activeInput = input));
});

function toggleKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.style.display = keyboard.style.display === "flex" ? "none" : "flex";
}

function handleKeyPress(keyElement) {
  if (activeInput) {
    // Determine which character to use based on shift and caps lock states
    let keyToAdd;
    if (isShift) {
      keyToAdd =
        keyElement.getAttribute("data-shifted") ||
        keyElement.innerText.toUpperCase();
    } else if (isCapsLock) {
      keyToAdd =  
          keyElement.getAttribute("data-shifted") ||
        keyElement.innerText.toUpperCase();
    } else {
      keyToAdd = keyElement.getAttribute("data-normal") || keyElement.innerText;
    }

    activeInput.value += keyToAdd;

    // Reset shift after one key press if not caps lock
    if (isShift && !isCapsLock) {
      toggleShift();
    }
  }
}

function toggleCapsLock() {
  isCapsLock = !isCapsLock;
  const capsLockKeys = document.querySelectorAll(".capslock");
  capsLockKeys.forEach((key) => key.classList.toggle("caps-active"));

  // Update key appearances
  // document.querySelectorAll(".key").forEach((key) => {
  //   const normalText = key.getAttribute("data-normal");
  //   const shiftedText = key.getAttribute("data-shifted");

  //   if (
  //     (normalText && normalText.match(/[a-zA-Z]/)) ||
  //     (shiftedText && shiftedText.match(/[a-zA-Z]/))
  //   ) {
  //     if (isCapsLock) {
  //       key.innerText = (normalText || key.innerText).toUpperCase();
  //     } else {
  //       key.innerText = (normalText || key.innerText).toLowerCase();
  //     }
  //   }
  // });
  document.querySelectorAll(".key").forEach((key) => {
    const normalText = key.getAttribute("data-normal");
    const shiftedText = key.getAttribute("data-shifted");

    if (isCapsLock) {
      if (shiftedText) {
        key.innerText = shiftedText;
      } else if (normalText && normalText.match(/[a-zA-Z]/)) {
        key.innerText = normalText.toUpperCase();
      }
    } else {
      if (normalText) {
        key.innerText = normalText;
      }
    }
  });
}

function toggleShift() {
  isShift = !isShift;
  const shiftKeys = document.querySelectorAll(".shift");
  shiftKeys.forEach((key) => key.classList.toggle("shift-active"));

  // Update keys to show shifted characters
  document.querySelectorAll(".key").forEach((key) => {
    const normalText = key.getAttribute("data-normal");
    const shiftedText = key.getAttribute("data-shifted");

    if (isShift) {
      if (shiftedText) {
        key.innerText = shiftedText;
      } else if (normalText && normalText.match(/[a-zA-Z]/)) {
        key.innerText = normalText.toUpperCase();
      }
    } else {
      if (normalText) {
        key.innerText = normalText;
      }
    }
  });
}

function backspace() {
  if (activeInput && activeInput.value.length > 0) {
    activeInput.value = activeInput.value.slice(0, -1);
  }
}

function startDrag(event) {
  isDragging = true;
  offsetX = event.clientX - document.getElementById("keyboard").offsetLeft;
  offsetY = event.clientY - document.getElementById("keyboard").offsetTop;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", () => (isDragging = false));
}

function drag(event) {
  if (isDragging) {
    const keyboard = document.getElementById("keyboard");
    keyboard.style.left = `${event.clientX - offsetX}px`;
    keyboard.style.top = `${event.clientY - offsetY}px`;
  }
}

function switchLanguage() {
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  currentLanguage = currentLanguage === "english" ? "thai" : "english";
  document.getElementById("english-keyboard").style.display =
    currentLanguage === "english" ? "block" : "none";
  document.getElementById("thai-keyboard").style.display =
    currentLanguage === "thai" ? "block" : "none";
  numpadKeyboard.style.display = "none";
  scrambledKeyboard.style.display = "none";
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // ตรวจสอบการกรอกข้อมูล
  if (!username || !password) {
      errorMessage.textContent = "Please enter both username and password.";
      return;
  }

  try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch("login.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
          alert("Login successful!");
          window.location.href = "index.html"; // เปลี่ยนไปหน้าถัดไป
      } else {
          alert("Login failed!");
          errorMessage.textContent = result.message || "Login failed.";
      }
  } catch (error) {
      console.error("Error during login:", error);
      errorMessage.textContent = "An error occurred. Please try again later.";
  }
}

function toggletap() {
  const key = event.target;
  key.style.backgroundColor = "#45a049";

  // Reset the key's background color after a brief delay
  setTimeout(() => {
    key.style.backgroundColor = "#d3d3d3";
  }, 100);
  console.log("Tap function");
}

function toggleEnter() {
  // ตรวจสอบว่าเป็นการกดปุ่ม Enter
  if (event.key === "Enter") {
    // ป้องกันการส่งฟอร์มที่เกิดจากการกด Enter
    event.preventDefault();

    // เช็คว่า activeInput มีค่าและเป็นประเภท INPUT
    if (activeInput && activeInput.tagName === "INPUT") {
      // ส่งฟอร์มเมื่อกด Enter
      activeInput.form.submit();
      console.log("Form submitted using Enter.");
    }
  }
}


function Numpad() {
  const englishKeyboard = document.getElementById("english-keyboard");
  const thaiKeyboard = document.getElementById("thai-keyboard");
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");

  englishKeyboard.style.display = "none";
  thaiKeyboard.style.display = "none";
  scrambledKeyboard.style.display = "none";

  if (numpadKeyboard) {
    numpadKeyboard.style.display = "block";
  } else {
    alert("Numpad layout is not available");
  }
}

function Scramble() {
  const englishKeyboard = document.getElementById("english-keyboard");
  const thaiKeyboard = document.getElementById("thai-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  const numpadKeyboard = document.getElementById("numpad-keyboard");

  // ซ่อนคีย์บอร์ดทุกตัวที่ไม่ใช่ Scrambled
  englishKeyboard.style.display = "none";
  thaiKeyboard.style.display = "none";
  numpadKeyboard.style.display = "none";

  // แสดงคีย์บอร์ด Scrambled
  if (scrambledKeyboard) {
    scrambledKeyboard.style.display = "block";
    scrambleKeys(); // เรียกฟังก์ชันเพื่อสุ่มตัวเลขบนคีย์บอร์ด
  } else {
    alert("Scramble layout is not available");
  }
}

function scrambleKeys() {
  // เลือกปุ่มทั้งหมดในคีย์บอร์ด "Scrambled" ยกเว้นปุ่ม backspace
  const keys = document.querySelectorAll(
    "#scrambled-keyboard .key:not(.backspace)"
  );
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  shuffleArray(numbers); // เรียงลำดับตัวเลขแบบสุ่ม

  // กำหนดตัวเลขที่สุ่มให้กับแต่ละปุ่ม
  keys.forEach((key, index) => {
    key.textContent = numbers[index];
  });
}

// ฟังก์ชันที่ใช้สับเปลี่ยนตัวเลข
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", (event) => {
      if (key.classList.contains("capslock")) {
        toggleCapsLock();
      } else if (key.classList.contains("backspace")) {
        backspace();
      } else if (key.classList.contains("shift")) {
        toggleShift();
      } else if (key.classList.contains("enter")) {
        toggleEnter();
      } else if (key.classList.contains("toggle-lang")) {
        switchLanguage();
      } else {
        handleKeyPress(key);
      }
    });
  });

  const loginButton = document.getElementById("login-button");
  const toggleKeyboards = document.getElementById("toggleKeyboard");

  loginButton.addEventListener("click", login);
  toggleKeyboards.addEventListener("click", toggleKeyboard);

  document.getElementById("switch-toggle").addEventListener("click", switchLanguage);

  // Handle Numpad Toggle
  document.getElementById("numpad-toggle").addEventListener("click", Numpad);

  // Handle Scramble Toggle
  document.getElementById("scramble-toggle").addEventListener("click", Scramble);
});
  
