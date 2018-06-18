var initialPuzzle =  [[4,8,2],
					  [3,1,0],
					  [7,6,5]];/*
var initialPuzzle = [[10, 3, 6, 4],
					 [ 1, 5, 8, 0],
					 [ 2,13, 7,15],
					 [14, 9,12,11]];/*
var initialPuzzle = [[ 3, 7,14,15,10],
					 [ 1, 0, 5, 9, 4],
					 [16, 2,11,12, 8],
					 [17, 6,13,18,20],
					 [21,22,23,19,24]];*//*
var initialPuzzle = [[ 7, 4, 1, 5],
					 [11, 0,12, 2],
					 [ 9, 6, 8,14],
					 [10, 3,13,15]];*/

setTimeout(addPuzzlePieces, 0);


function addPuzzlePieces(){
	var outerBox = document.getElementById("puzzle-outer-box")
	var innerBoxWidth = Math.ceil((outerBox.clientWidth - 8) / initialPuzzle.length);
	var fontSize = "" +  (360 / initialPuzzle.length) + "px";

	for (var i = 0; i < initialPuzzle.length; i++) {
		for (var j = 0; j < initialPuzzle[i].length; j++) {
			var newItem = createPuzzlePieceElement(initialPuzzle[i][j]);
			newItem.style.width = innerBoxWidth;
			newItem.style.height = innerBoxWidth;
			newItem.style.fontSize = fontSize
			outerBox.appendChild(newItem);
			if(initialPuzzle[i][j] == 0){
				newItem.classList.add("blank");
				newItem.firstElementChild.innerHTML = "";
			}
		}
	}
	var solution  = solvePuzzle(initialPuzzle);
	
	slideItem(solution);
	console.log("done : " + solution + "\n move count : " + solution.length);
}

function createPuzzlePieceElement(val){
	var item = document.createElement("div");
	item.classList.add("puzzle-inner-box");
	item.id = "block-" + val;

	var innerItem = document.createElement("div");
	innerItem.classList.add("puzzle-piece-text");
	
	innerItem.appendChild(document.createTextNode(val));
	item.appendChild(innerItem);

	return item;
}

function slideItem(vals){
	var item = document.getElementById("block-" + vals[0]);
	var blankItem = document.getElementById("block-0");
	var cloneItem = item.cloneNode(true);
	var cloneBlank = blankItem.cloneNode(true);
	document.body.append(cloneBlank);
	document.body.append(cloneItem);

	cloneBlank.style.position = "fixed";
	cloneBlank.style.left = item.offsetLeft;
	cloneBlank.style.top = item.offsetTop;
	cloneBlank.style.zIndex = 2;

	cloneItem.style.position = "fixed";
	cloneItem.style.left = item.offsetLeft;
	cloneItem.style.top = item.offsetTop;
	cloneItem.style.zIndex = 3;

	var vx = (blankItem.offsetLeft - item.offsetLeft) / 5;
	var vy = (blankItem.offsetTop - item.offsetTop) / 5;

	cloneItem.classList.add("transition");
	cloneItem.style.border = "1px solid black";
	cloneItem.style.left = blankItem.offsetLeft + "px";
	cloneItem.style.top = blankItem.offsetTop + "px";

	setTimeout(function(){
		var tempItem = item.cloneNode(true);
		var tempBlank =  blankItem.cloneNode(true);

		var outerBox = document.getElementById("puzzle-outer-box");
		outerBox.insertBefore(tempItem, blankItem);
		outerBox.insertBefore(tempBlank, item);

		outerBox.removeChild(item);
		outerBox.removeChild(blankItem);

		document.body.removeChild(cloneItem);
		document.body.removeChild(cloneBlank);

		if(vals.length < 2)
			return;
		slideItem(vals.slice(1));
	},250);
}
