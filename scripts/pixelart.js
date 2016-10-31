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
            var cant = cant * cant;
            var container = myPixelDraw.container;
            var containerWidth = container.width();
            container.empty();
            for (i = 0; i < cant; i++) {
                container.append('<div class="cell" draggable></div>');
            }
            var cell = $('.cell');
            var cellSize = containerWidth / Math.sqrt(cant);
            cell.width(cellSize);
            cell.height(cellSize);
        },	
		reSize(){
			$('#sizeit').on('click', function() {
                size = $('#resize').val();
                if (size <= 0 || size > 50)
                    var size = myPixelDraw.defaultCells;
                myPixelDraw.fns.calcSize(size);
                myPixelDraw.fns.colorIt();
                myPixelDraw.fns.colorOnDrag();
            });
		},
		detectMouseUp(){
			$(document).on("mouseup",function(){
				myPixelDraw.coloring=false;
			});
		},
		colorPalette(){
			$('#colorPick > *').each(function(index, value) {
                var clase = $(value).attr('class');
                $(value).css('background-color', clase);
            });
		},
		pickColor(){
			$('#colorPick > *').on('click', function(index, value) {
                var clase = $(this).attr('class');
                myPixelDraw.colorPicked=clase;
                $('#color-pick .select').removeClass("select");
                $(this).addClass("select");
            });
		},
		colorIt(){
			$("#grilla .cell").on("mousedown",function(event){
				console.log("hola");
				event.preventDefault();
				myPixelDraw.coloring=true;
				console.log("hi");
				if(event.button == 2){
			  		$(this).css("background-color",myPixelDraw.cellColor);
				}
			    else{
			        $(this).css("background-color",myPixelDraw.colorPicked);
			    }
			});
		},
		colorOnDrag(){
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
		reset(){
			$('#reset').on('click', function() {
                $(".cell").css({"background-color":myPixelDraw.cellColor});
            });
		},
		toggleBorders(){
			$('#toggleBorder').on('click', function() {
				console.log("hola");
                $(".cell").toggleClass("no-border");
            });
		},
		disableRightClick(){
			myPixelDraw.container.on('contextmenu', function() {
                return false;
            })
		},
		grabImage(){
			console.log("calcSize9");
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
	myPixelDraw.init($("#grilla"));
});
function cuadrar(){
	
}