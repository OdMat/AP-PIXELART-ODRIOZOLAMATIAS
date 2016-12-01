var cells;
var cantCells;
var isBucket=false;
var myPixelDraw = {
	container:null,
	colorPicked:"#000",
	cellColor:"#ecf0f1",
	defaultCells:30,
	coloring:false,
	fns:{
		calcSize: function(cant) {
     		if (typeof cant === 'undefined') {
                cant = myPixelDraw.defaultCells;
            }
            cantCells=cant;
            cells = createArray(cant,cant);
            var container = myPixelDraw.container;
            var containerWidth = container.width();
            container.empty();
            var cont=0;
            for (var j = 0; j < cant; j++) {
                for (var i = 0; i < cant; i++) {
                    cont++;
                    container.append('<div id="'+cont+'" class="cell" draggable></div>');
                    cells[j][i]=$("#grilla  #"+cont);
                }
            }
            var cell = $('.cell');
            var cellSize = containerWidth / Math.sqrt(cant*cant);
            cell.width(cellSize);
            cell.height(cellSize);
        },	
		reSize: function(){
			$('#sizeit').on('click', function() {
                size = $('#resize').val();
                if (size <= 0 || size > 100)
                    var size = myPixelDraw.defaultCells;
                myPixelDraw.fns.calcSize(size);
                myPixelDraw.fns.colorIt();
                myPixelDraw.fns.colorOnDrag();
            });
		},
		detectMouseUp : function(){
			$(document).on("mouseup",function(){
				myPixelDraw.coloring=false;
			});
		},
		colorPalette : function(){
			$('#colorPick > *').each(function(index, value) {
                var cl = $(value).attr('class');
                $(value).css('background-color', cl);
            });
		},
		pickColor : function(){
			$(document).on('click',"#colorPick > *", function(index, value) {
                var cl = $(this).attr('class');
                myPixelDraw.colorPicked=cl;
                $(".select").removeClass("select");
                $(this).addClass("select");
            });
		},
		colorIt : function(){
			$("#grilla .cell").on("mousedown",function(event){
                if(isBucket){
                    var x,y;
                    var j,i;
                    for (j = 0; j < cantCells; j++) {
                        for (i = 0; i < cantCells; i++) {
                            if($(this).attr('id')==cells[j][i].attr('id')){
                                x=j;
                                y=i;
                            }
                        }
                    }
                    floodfill(x,y,$(this).css("background-color"),myPixelDraw.colorPicked);
                    isBucket=false;
                    $("#grilla").css('cursor','url("images/pencil.png")0 20,pointer');
                }else{
    				event.preventDefault();
    				myPixelDraw.coloring=true;
    				if(event.button == 2){
    			  		$(this).css("background-color",myPixelDraw.cellColor);
    				}
    			    else{
    			        $(this).css("background-color",myPixelDraw.colorPicked);
    			    }
                }
			});
		},
		colorOnDrag : function(){
			$("#grilla .cell").on("mousemove",function(event){
				if(myPixelDraw.coloring){
					var x = event.clientX;
                    var y = event.clientY;
                    var div = document.elementFromPoint(x, y);
                    if ($(div).hasClass('cell') && event.button != 2)
                        $(div).css('background-color', myPixelDraw.colorPicked);
                    else if ($(div).hasClass('cell') && event.button == 2)
                        $(div).css('background-color', myPixelDraw.cellColor);
                    
                }
			});
		},
		reset : function(){
			$('#reset').on('click', function() {
                $(".cell").css({"background-color":myPixelDraw.cellColor});
            });
		},
		toggleBorders : function(){
			$('#toggleBorder').on('click', function() {
                $(".cell").toggleClass("no-border");
            });
		},
		disableRightClick : function(){
			myPixelDraw.container.on('contextmenu', function() {
                return false;
            })
		},
		grabImage: function() {
            $('#grab-it').on('click', function(e) {
            	var bool=false;
            	if(!$(".cell").hasClass("no-border")){
            		$(".cell").toggleClass("no-border");
            		bool=true;
            	}
                var container = $('#grilla');
                html2canvas(container, {
                    onrendered: function(canvas) {
                        $("#frames").append(canvas);
                        $("#images").prepend("<div></div>");
                        $("#images div:first-child").prepend(cloneCanvas(canvas));
                        var dataURL = canvas.toDataURL();
                        $("#images div:first-child").append('<a href="'+dataURL+'" download="img"><span class="ion-ios-download-outline"></span></a>');
                    }
                });
                if(bool)
                	$(".cell").toggleClass("no-border");
            });
        },
        bucket: function(){
            $('#bucket').on('click', function() {
                isBucket=true;
                $("#grilla").css('cursor','url("images/bucket.png")20 20,pointer');
            });
        }
	},
	init:function(container){
		this.container = container;
		Object.keys(myPixelDraw.fns).forEach(function(key){
			myPixelDraw.fns[key]();
		});
    }
}
$( document ).ready(function (){
    cuadrar();
	myPixelDraw.init($("#grilla"));
	$("#container").css("height",$("#grilla").css("height"));
	$("#anim").click(function(){
        $("#anim img").css("z-index","0");
		anim($("#images canvas").length);
	});
    var height=$("#grilla").css("width");
    $("#grilla").css("height",height);
    $("#Animacion").css("min-height",height*0.8);
    $("#Animacion #images").css("height",height);
    $("#anim").css("height",$("#anim").width()+"px");
    $("#actions").css("height",$("#anim").width()+"px");
    $(".basic").spectrum({
        color: "#f00",
        change: function(color) {
            $("#colorPick").append('<div class="'+color.toHexString()+' cuadrado"></div>');
            cuadrar();
            myPixelDraw.fns.colorPalette();
        }
    });
});
function cuadrar(){
	var width=$(".cuadrado").width();
	$(".cuadrado").css("height",width+"px");
    $(".cuadrado").removeClass("cuadrado");
}
function anim(veces){
	if(veces<=0){
        setTimeout(function(){
            $("#anim img").css("z-index","3");
            $("#anim canvas").remove();
            $("#anim").append("<canvas></canvas");
        },200);
        return;
    }
	var a=$("#frames canvas").length-veces+1;
    var can = $('#frames canvas:nth-of-type('+a+')');
    html2canvas(can, {
        onrendered: function(canvas) {
            $("#anim").append(canvas);
            $("#anim canvas:first-of-type").remove();
        }
    });
    setTimeout(function(){
    	anim(veces-1);
    },100);
}
function floodfill(x,y,A,B){
    if ((x<0) || (x>=cantCells) || (y<0) || (y>=cantCells)) return;
    if (getColor(x,y)!=A) return;
    setColor(x,y,B);
    floodfill(x-1,y,A,B);
    floodfill(x+1,y,A,B);
    floodfill(x,y-1,A,B);
    floodfill(x,y+1,A,B);
}

function getColor(x,y){
    return cells[x][y].css("background-color");
}
function setColor(x,y,color){
    cells[x][y].css("background-color",color);
}
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
$.cssHooks.backgroundColor = {
    get: function(elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["backgroundColor"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}
function cloneCanvas(oldCanvas) {
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
}