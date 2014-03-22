var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var debug = false;
var boxes=[];
var white = "#FFF";
var black = "#000";
var ratio = 0.25;
var updateFreqency = 10;
var containerSize = 550;
var gridCount = 9; //MUST be an odd number!
var boxSize= Math.round(containerSize / gridCount);
var innerSize = Math.round(boxSize * ratio);
var padding = Math.round(innerSize * ratio);

function drawBox(index, isOdd, drawInner, x, y){
	//Add info about this box
	boxes[index]={
		box1:{},
		box2:{},
		corners: [
			[x + padding, y + padding],
			[x + boxSize - innerSize - padding, y + padding],
			[x + boxSize - innerSize - padding, y + boxSize - innerSize - padding],
			[x + padding, y + boxSize - innerSize - padding]
		]
	};

	//initial box positions - in opposite corners
	boxes[index].box1={
		x: boxes[index].corners[0][0],
		y: boxes[index].corners[0][1]
	};
	boxes[index].box2={
		x: boxes[index].corners[2][0],
		y: boxes[index].corners[2][1]
	};

	setInterval(function(){
	
		//Alternate color
		ctx.fillStyle = isOdd ? black : white;
		//Position & size it
		ctx.fillRect(x, y, boxSize, boxSize);

		if(drawInner){
			//Opposite color
			ctx.fillStyle = isOdd ? white : black;
			
			moveInnerBox(index, "box1", innerSize);
			moveInnerBox(index, "box2", innerSize);
		}
	}, updateFreqency);
}

function moveInnerBox(index, key, size){
	var boxInfo = boxes[index];
	var x = boxInfo[key].x;
	var y = boxInfo[key].y;
	var pos = boxInfo.corners;
	ctx.fillRect(x, y, size, size);

	if(debug){
		//debug coordinates for each corner
		ctx.font="13px";
		for (var i = 0; i < pos.length; i++) {
			ctx.fillText(pos[i][0]+", "+pos[i][1], pos[i][0], pos[i][1]);
		};		

		//debug coordinates for moving box
		ctx.fillStyle = isOdd ? black : white;
		ctx.fillText("x: "+x, x+5, y+15);
		ctx.fillText("y: "+y, x+5, y+25);
	}

	if(x >= pos[0][0] && x < pos[1][0] && y == pos[0][1]){
		boxInfo[key].x ++; //move TL to TR
	}else if(y >= pos[1][1] && y < pos[2][1] && x == pos[1][0]){
		boxInfo[key].y++; //move TL to BL
	}else if(x <= pos[2][0] && x > pos[3][0]){
		boxInfo[key].x--; //move BL to BR
	}else if(y <= pos[3][1] && y > pos[0][1]){
		boxInfo[key].y--; //move BR to TR
	}
}

function drawCheckerboard(){
	//Set the size
	canvas.width = containerSize;
	canvas.height = containerSize;

	//Setup box grid
	var mid = (gridCount - 1) / 2;
	
	var totalBoxes = gridCount * gridCount;
	var row=0, col=0;
	for (var i = 0; i < totalBoxes; i++) {
		//Reset every row
		if(i % gridCount === 0){
			row++;
			col=0;
		}
		drawBox(
			i,
			i % 2 === 0,
			!(row-1 === mid && col === mid),
			Math.round(boxSize * col),
			Math.round(boxSize * (row-1)),
			boxSize
		);
		col++;
	}
}

drawCheckerboard();