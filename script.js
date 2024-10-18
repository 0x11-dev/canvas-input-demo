const textInput = document.getElementById("textInput");
const cursor = document.getElementById("cursor");
const canvas = document.getElementById("textCanvas");
const ctx = canvas.getContext("2d");

// 设置字体样式
ctx.font = "16px Arial";
ctx.textBaseline = "top";

// 初始化输入框内容
textInput.innerText = "";

// 记录当前是否处于输入法输入状态
let isComposing = false;

// 文档模型，用于存储用户的输入
let model = [];

// 临时数据，用于存储输入法输入过程中的内容
let tempData = "";

// 光标位置
let cursorX = 0;
let cursorY = 0;

// 默认focus textInput
textInput.focus();

// 监听输入事件
textInput.addEventListener("input", () => {
  console.log("input");
  if (!isComposing) {
    updateModel();
    drawText();
  } else {
    updateTempData();
    drawText();
  }
});

// 监听输入法开始事件
textInput.addEventListener("compositionstart", () => {
  isComposing = true;
});

// 监听输入法结束事件
textInput.addEventListener("compositionend", () => {
  isComposing = false;
  updateModel();
  tempData = ""; // 清除临时数据
  drawText();
});

// 更新文档模型
function updateModel() {
  const text = textInput.innerText;
  model.push(text);
  textInput.innerText = ""; // 清除输入框内容
}

// 更新临时数据
function updateTempData() {
  tempData = textInput.innerText;
}

// 绘制文本到canvas
function drawText() {
  // 清空canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 将model中的文本合并为一个连续的字符串
  let text = model.join("") + (tempData ? tempData : "");

  // 逐行绘制文本
  let y = 10;
  let x = 0;
  let lines = text.split("\n");
  lines.forEach((line) => {
    let words = line.split("");
    words.forEach((word) => {
      let wordWidth = ctx.measureText(word).width;
      if (x + wordWidth > canvas.width) {
        y += 20; // 换行
        x = 0;
      }
      ctx.fillText(word + " ", x, y);
      x += wordWidth;
    });
    // y += 20; // 换行
    // x = 0;
  });

  // 计算光标位置
  const lastLine = model[model.length - 1] || "";
  const lastLineWidth = ctx.measureText(lastLine).width;
  cursorX = 10 + x;
  cursorY = y + 8;

  // 移动光标
  moveCursor();

  // 更新textInput位置
  updateTextInputPosition();
}

// 移动光标
function moveCursor() {
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
}

// 更新textInput位置
function updateTextInputPosition() {
  textInput.style.left = `${cursorX}px`;
  textInput.style.top = `${cursorY}px`;
}

textInput.focus();
drawText();
