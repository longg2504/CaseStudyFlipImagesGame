const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let size = 4 ;
//mảng vật phẩm
const items = [
    { name: "bee", image: "bee.png" },
    { name: "crocodile", image: "crocodile.png" },
    { name: "macaw", image: "macaw.png" },
    { name: "gorilla", image: "gorilla.png" },
    { name: "tiger", image: "tiger.png" },
    { name: "monkey", image: "monkey.png" },
    { name: "chameleon", image: "chameleon.png" },
    { name: "piranha", image: "piranha.png" },
    { name: "anaconda", image: "anaconda.png" },
    { name: "sloth", image: "sloth.png" },
    { name: "cockatoo", image: "cockatoo.png" },
    { name: "toucan", image: "toucan.png" },
];
//Thời hạn ban đầu
let seconds = 0,
    minutes = 0;
//Nước đi ban đầu và số lần thắng
let movesCount = 0,
    winCount = 0;
//cho hẹn giờ
const timeGenerator = () => {
    seconds += 1;
    //phút logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //định dạng thời gian trước khi hiển thị
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};
//Để tính toán di chuyển
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
//Chọn các đối tượng ngẫu nhiên từ mảng vật phẩm
const generateRandom = (size = 4) => {
    //mảng tạm thời 
    let tempArray = [...items];
    //khởi tạo mảng cardValues
    let cardValues = [];
    //kích thước phải gấp đôi (ma trận 4 * 4)/2 vì sẽ tồn tại các cặp đối tượng
    size = (size * size) / 2;
    //Lựa chọn đối tượng ngẫu nhiên
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //sau khi được chọn, hãy xóa đối tượng khỏi mảng tạm thời
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};
const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //xáo trộn đơn giản
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
            Tạo thẻ
            trước => mặt trước (chứa dấu chấm hỏi)
            sau => mặt sau (chứa ảnh thật);
            data-card-values ​​là một thuộc tính tùy chỉnh lưu trữ tên của các thẻ để khớp sau này
          */
        gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="./images/${cardValues[i].image}" class="image" style="width:100px ;height:100px;"/></div>
     </div>
     `;
    }
    //lưới
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //Nếu thẻ đã chọn chưa khớp thì chỉ chạy (tức là thẻ đã khớp khi nhấp vào sẽ bị bỏ qua)
            if (!card.classList.contains("matched")) {
                //lật thẻ cliked
                card.classList.add("flipped");
                //nếu đó là thẻ đầu tiên (!firstCard vì firstCard ban đầu là sai)
                if (!firstCard) {
                    //vì vậy thẻ hiện tại sẽ trở thành thẻ đầu tiên
                    firstCard = card;
                    //giá trị thẻ hiện tại trở thành firstCardValue
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //gia số di chuyển kể từ khi người dùng chọn thẻ thứ hai
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //nếu cả hai thẻ khớp nhau, hãy thêm lớp phù hợp để những thẻ này sẽ bị bỏ qua vào lần tới
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //đặt firstCard thành false vì thẻ tiếp theo sẽ là thẻ đầu tiên ngay bây giờ
                        firstCard = false;
                        //winCount tăng khi người dùng tìm thấy kết quả khớp chính xác
                        winCount += 1;
                        //kiểm tra xem winCount ==một nửa giá trị thẻ
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //nếu các thẻ không phù hợp
                        //lật thẻ trở lại bình thường
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};
//Bắt đầu trò chơi
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //kiểm soát khả năng hiển thị các nút amd
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //bắt đầu hẹn giờ
    interval = setInterval(timeGenerator, 1000);
    //di chuyển ban đầu
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});
//Kết thúc game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        let a = size +1 ; 
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);
//Khởi tạo giá trị và gọi hàm 
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};