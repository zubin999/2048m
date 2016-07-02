;(function(){

    var color = [
		'#cdc9c9', '#8b8989', '#778899',
		'#d3d3d3', '#6495ed', '#3cb371',
        '#7cfc00', '#ffd700', '#daa520',
		'#cd853f', '#ffa500', '#ffb6c1',
        '#ee82ee', '#ba55d3', '#d8bfd8',
        '#9932cc', '#db7093', '#ff0000',
        '#a52a2a', '#b8860b', '#f0e68c'
    ],
    map = [
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null]
	],
	__row = document.querySelectorAll('.row'),
	threshold = 150,
	restraint = 100,
	allowedTime = 500,
	elapsedTime;

    function init(){
		show(create(),create());
		move();
    }

    function create(num){
        var val = num === undefined ? 2 : num,
            div = document.createElement('div');
        
		div.style.width = '100%';
        div.style.height = '100%';
		div.innerHTML = val;
        div.style.backgroundColor = getColor(val);
        
    	return div;
    }

    function getColor(num){
        return color[Math.log(num)/Math.log(2)-1];
    }

	function show(){
        var length = arguments.length,i;

		for(i=0; i<length; i=i+1){
            insert(arguments[i]);
        }
    }

	function insert(node){
		var pos = getPos();
		
		__row[pos.x].children[pos.y].innerHTML = '';
		__row[pos.x].children[pos.y].appendChild(node);
		map[pos.x][pos.y] = node.innerHTML;
	}

	function getPos(){
		var x = y = 0,
			mLength = map.length,
			getX = function(){
				var row = ~~(Math.random() * mLength),
					rLength = map[row].length, i,
					flag = false;

				for(i=0; i<rLength; i+=1){
					if(!map[row][i]){
						return row;
					}
				}
				
				return getX();

			},
			getY = function(row){
				var cLength = map[row].length, r=map[row], i, col=[];

				for(i=0; i<cLength; i=i+1){
					!r[i] && col.push(i);
				}

				return col[~~(Math.random() * col.length)];
			};

		x = getX();
		y = getY(x);

		return {
			x: x,
			y: y
		};
	}

    function move(){
		document.addEventListener('touchstart', function(e){
			var touchobj = e.changedTouches[0];

			dist = 0;
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime();
			e.preventDefault();
		}, false);

		document.addEventListener('touchmove', function(e){
			e.preventDefault();
		}, false);

		document.addEventListener('touchend', function(e){
			e.preventDefault();
			var touchobj = e.changedTouches[0],
				endX = touchobj.pageX,
				endY = touchobj.pageY,
				distX = endX-startX,
				distY = endY-startY;
 	
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime){
				if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
					distX < 0 ? left() : right();
				}
				else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
					distY < 0 ? up() : down();
				}
			}
			
		}, false);
	}

	function right(){
		var sortChanged = sortX('rLeng-1', 'j>=0', 'j-=1', 'j-1', 'k<0', 'k>=0', 'k-=1'),
			mergeChanged = mergeX('rLeng-1', 'j>=0', 'j-=1', 'j-1', 'k<0'),
			reSortChanged = sortX('rLeng-1', 'j>=0', 'j-=1', 'j-1', 'k<0', 'k>=0', 'k-=1');
		
		(sortChanged || mergeChanged || reSortChanged) &&
			show(create());
	}

	function left(){
		var sortChanged = sortX(0, 'j<rLeng', 'j+=1', 'j+1', 'k>=rLeng', 'k<rLeng', 'k+=1'),
			mergeChanged = mergeX(0, 'j<rLeng', 'j+=1', 'j+1', 'k>=rLeng'),
			reSortChanged = sortX(0, 'j<rLeng', 'j+=1', 'j+1', 'k>=rLeng', 'k<rLeng', 'k+=1');
		
		(sortChanged || mergeChanged || reSortChanged) &&
			show(create());
	}

	function up(){
		var sortChanged = sortY(0, 'j<rLeng', 'j+=1', 'j+1', 'k>=rLeng', 'k<rLeng', 'k+=1'),
			mergeChanged = mergeY(0, 'j < rLeng', 'j+=1', 'j+1', 'k>=rLeng'),
			reSortChanged = sortY(0, 'j<rLeng', 'j+=1', 'j+1', 'k>=rLeng', 'k<rLeng', 'k+=1');
		
		(sortChanged || mergeChanged || reSortChanged) &&
			show(create());
	}

	function down(){
		var sortChanged = sortY(map.length-1, 'j>=0', 'j-=1', 'j-1', 'k<0', 'k>=0', 'k-=1'),
			mergeChanged = mergeY(map.length-1, 'j >= 0', 'j-=1', 'j-1', 'k<0'),
			reSortChanged = sortY(map.length-1, 'j>=0', 'j-=1', 'j-1', 'k<0', 'k>=0', 'k-=1');
		
		(sortChanged || mergeChanged || reSortChanged) &&
			show(create());
	}

	function sortX(start, limit, offset, find, periphery, kLimit, kOffset){
		var hasChanged = false;
		for(var i=0,rLeng=map.length; i<rLeng; i+=1){
			for(var j=eval(start); eval(limit); eval(offset)){
				if(map[i][j]){
					continue;
				}

				var k = eval(find);
				if(eval(periphery)){
					break;
				}

				for(; eval(kLimit); eval(kOffset)){
					if(!map[i][k]){
						continue;
					}

					map[i][j] = map[i][k];
					map[i][k] = null;
					__row[i].children[j].innerHTML = '';
					__row[i].children[j].appendChild(create(map[i][j]));
					__row[i].children[k].innerHTML = '';
					hasChanged = true;
					break;
				}
			}
		}

		return hasChanged;
	}

	function mergeX(start, limit, offset, find, periphery){
		var hasChanged = false;
		for(var i = 0, rLeng = map.length; i < rLeng; i+=1) {
			for (var j = eval(start); eval(limit); eval(offset)) {
				if(!map[i][j]){
					break;
				}	

				var k = eval(find);
				if(eval(periphery)){
					break;
				}

				if(map[i][k] === map[i][j]){
					map[i][j] *= 2;
					map[i][k] = null;
					__row[i].children[j].innerHTML = '';
					__row[i].children[j].appendChild(create(map[i][j]));
					__row[i].children[k].innerHTML = '';
					hasChanged = true;
				}
			}
		}

		return hasChanged;
	}

	function sortY(start, limit, offset, find, periphery, kLimit, kOffset){
		var hasChanged = false;
		for(var i=0,rLeng=map.length; i<rLeng; i+=1){
			for(var j=eval(start); eval(limit); eval(offset)){
				if(map[j][i]){
					continue;
				}

				var k = eval(find);
				if(eval(periphery)){
					break;
				}

				for(; eval(kLimit); eval(kOffset)){
					if(!map[k][i]){
						continue;
					}

					map[j][i] = map[k][i];
					map[k][i] = null;
					__row[j].children[i].innerHTML = '';
					__row[j].children[i].appendChild(create(map[j][i]));
					__row[k].children[i].innerHTML = '';
					hasChanged = true;
					break;
				}
			}
		}

		return hasChanged;
	}

	function mergeY(start, limit, offset, find, periphery){
		var hasChanged = false;
		for(var i = 0, rLeng = map.length; i < rLeng; i+=1) {
			for (var j = eval(start); eval(limit); eval(offset)) {
				if(!map[j][i]){
					break;
				}	

				var k = eval(find);

				if(eval(periphery)){
					break;
				}

				if(map[k][i] === map[j][i]){
					map[j][i] *= 2;
					map[k][i] = null;
					__row[j].children[i].innerHTML = '';
					__row[j].children[i].appendChild(create(map[j][i]));
					__row[k].children[i].innerHTML = '';
					hasChanged = true;
				}
			}
		}

		return hasChanged;
	}
	
    window.onload = function(){
        init(); 
    }
})();