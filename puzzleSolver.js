var n = 3;
var map = {};
var pq = [];
var finalKey = "";
var maxDistance = 250;

pq.sortByDistance = function(){
   	this.sort((a,b) => a.distance - b.distance);
};
pq.pushElement = function(e){
   	this.push(e);
   	this.sortByDistance();
};

function solvePuzzle(arr){
	map = {};
	pq = [];
	finalKey = "";
    n = arr.length;
    
	pq.sortByDistance = function(){
	   	this.sort((a,b) => a.distance - b.distance);
	};
	pq.pushElement = function(e){
	   	this.push(e);
	   	this.sortByDistance();
	};

    var startState = {};
    for (var i = 1; i < n*n ; i++) {
    	finalKey += i;
    }
    finalKey += "0";

    startState.puzzle = arr;
    startState.previousState = null;
    startState.blankSpace = findBlankSpace(arr);
    startState.moveCount = 0;
    startState.distance = calculateDistance(startState.puzzle);
    
    map[createPuzzleKey(startState.puzzle)] = startState;
    pq.pushElement(startState);
    var result = move();

    var transition = [];
    transition.unshift(result.puzzle);
    var slidingItems = [];
    var prevBlank = result.blankSpace;

    while(result.previousState){
    	result = result.previousState;
    	slidingItems.unshift(result.puzzle[prevBlank[0]][prevBlank[1]]);
    	prevBlank = result.blankSpace;
    	transition.unshift(result.puzzle);
    }
    return slidingItems;
    //return transition;
}

function move(){
	var result = false;
	while(!result){
		var current = pq.shift();
		//up
		if(current.blankSpace[0] > 0){
			var nextState = {};
			nextState.blankSpace = [current.blankSpace[0]-1, current.blankSpace[1]];
			result = slide(current, nextState);
		}
		if(result)
			return result;
		//right
		if(current.blankSpace[1] < n - 1){
			var nextState = {};
			nextState.blankSpace = [current.blankSpace[0], current.blankSpace[1] + 1];
			result = slide(current, nextState);	
		}
		if(result)
			return result;

		//down
		if(current.blankSpace[0] < n - 1){
			var nextState = {};
			nextState.blankSpace = [current.blankSpace[0] + 1, current.blankSpace[1]];
			result = slide(current, nextState);	
		}
		if(result)
			return result;
		
		//left
		if(current.blankSpace[1] > 0){
			var nextState = {};
			nextState.blankSpace = [current.blankSpace[0], current.blankSpace[1] - 1];
			result = slide(current, nextState);
		}
	}
	return result;
}

function slide(current, nextState){
	nextState.puzzle = current.puzzle.map(v => v.slice());
	nextState.puzzle[current.blankSpace[0]][current.blankSpace[1]] = nextState.puzzle[nextState.blankSpace[0]][nextState.blankSpace[1]];
	nextState.puzzle[nextState.blankSpace[0]][nextState.blankSpace[1]] = 0;
	var key = createPuzzleKey(nextState.puzzle);
	if(!map[key]){
		nextState.previousState = current;
		nextState.moveCount = current.moveCount + 1;
		nextState.distance = calculateDistance(nextState.puzzle, nextState.moveCount);
		map[createPuzzleKey(nextState.puzzle)] = nextState;
		if(nextState.distance <= maxDistance)
		   	pq.pushElement(nextState);
	}
	if(key == finalKey)
		return map[key];

}

function createPuzzleKey(puzzle){
	var key = "";
	for (var i = 0; i < puzzle.length; i++) {
		key += puzzle[i].join("");
	}
	return key;
}


function calculateDistance(arr, f){
	distance = 0;
	for (var i = 0; i < arr.length; i++) {
    	for (var j = 0; j < arr[i].length; j++) {
    		if(arr[i][j] != 0){
	    		distance += Math.abs(i - Math.floor(arr[i][j]/n));
	    		distance += Math.abs(Math.abs(j - (arr[i][j]%n)) - 1);
    		}
    	}
    }
    if( f>50 )
    	return distance + f * f;
    return distance + f;
}

function findBlankSpace(arr){
	for (var i = 0; i < arr.length; i++) {
    	for (var j = 0; j < arr[i].length; j++) {
    		if(arr[i][j] == 0)
    			return [i, j];
    	}
    }
}