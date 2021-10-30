document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let score = 0;
  const width = 8;
  const squares = [];

  const candyColors = ["red", "yellow", "orange", "purple", "green", "blue"];

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);

      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundColor = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard();

  // drag candies
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart(e) {
    colorBeingDragged = this.style.backgroundColor;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragOver");
  }

  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragEnter");
  }
  function dragLeave(e) {
    console.log(this.id, "dragLeave");
  }

  function dragDrop() {
    console.log(this.id, "dragDrop");
    colorBeingReplaced = this.style.backgroundColor; // a cél square régi színe
    squareIdBeingReplaced = parseInt(this.id); // a cél square régi id-ja
    this.style.backgroundColor = colorBeingDragged; // a kiválasztott, elmozdított square színe, és a dragStart-ban pedig kezelve van, hogy a régi square az új helyére menjen
    // squareIdBeingDragged: a kiválasztott, elmozdított square id-ja
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
  }

  function dragEnd() {
    console.log(this.id, "dragEnd");

    //csak jobbra, balra, fel és le lehet majd drag and drop-polni
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];

    let isValidMode = validMoves.includes(squareIdBeingReplaced);
    if (isValidMode && squareIdBeingReplaced) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !isValidMode) {
      squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    }
  }

  //drop candies once some have been cleared
  function moveIntoSquareBelow() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundColor === "white") {
        squares[i + width].style.backgroundColor =
          squares[i].style.backgroundColor;
        squares[i].style.backgroundColor = "white";
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundColor === "white") {
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundColor = candyColors[randomColor];
        }
      }
    }
  }

  // vízszintesen azonos három elem
  // azért 61 mert 8x8 -3 = 61, azért kell 3 mert 3 négyzetet vizsgálunk
  function checkRowForThree() {
    for (let i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === "white";

      //bizonyos blokkokat nem akarunk mozgatni
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) {
        continue;
      }

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundColor === decidedColor && !isBlank
        )
      ) {
        score += 3;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundColor = "white";
        });
      }
    }
  }
  checkRowForThree();

  //vízszintesen 3 db blokk vizsgálása
  function checkColumnForThree() {
    //   itt azért 47, mert adott blokk és az alatta lévő két blokk tehát, 64 - 2*8
    for (let i = 0; i < 47; i++) {
      // itt egymás alatta lévő 3 blokkot vizsgáljuk: i, i + width, i + width * 2
      let rowOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === "white";

      //bizonyos blokkokat nem akarunk mozgatni
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) {
        continue;
      }
      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundColor === decidedColor && !isBlank
        )
      ) {
        console.log("_______________");
        score += 3;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundColor = "white";
        });
      }
    }
  }
  checkColumnForThree();

  ///Checking for Matches
  //for row of Four
  function checkRowForFour() {
    for (i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForFour();

  //for column of Four
  function checkColumnForFour() {
    for (i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForFour();
  window.setInterval(function () {
    checkRowForThree();
    checkColumnForThree();
    checkRowForFour();
    checkColumnForFour();
    moveIntoSquareBelow();
  }, 100);
});
