'use strict';
(function($,undefined){
    var boards = {
            levels:{
                easy:[5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9],
                medium:[0,4,0,7,3,0,8,0,0,0,0,7,0,9,0,3,0,5,0,3,6,4,8,0,0,0,0,2,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1,2,0,0,0,0,7,4,2,8,0,6,0,4,0,5,0,7,0,0,0,0,8,0,1,3,0,9,0],
                tough:[3,0,0,0,4,0,6,0,0,0,0,2,3,9,0,1,0,0,6,5,0,0,1,0,0,7,0,0,0,6,0,0,0,7,4,0,0,0,0,0,6,0,0,0,0,0,2,5,0,0,0,9,0,0,0,4,0,0,3,0,0,1,5,0,0,7,0,5,1,3,0,0,0,0,3,0,2,0,0,0,7],
            },
            smallSquare:3,
            largeSquare:9
        };

    var sudoku = {
        boardArray:[],
        level:"easy",
        solvedBoardArray:[],
        defaultCellData : "&#160;", //empty space
        generateBoardTemplate: function (level){
            var i, j, htmlFragment='', defaultBoardData=this.getBoardData(level), cellDefaultValue, bgClass;

            this.level = level;
            this.solvedBoardArray = this.getSolvedData(defaultBoardData);

            //Clone the original array
            this.boardArray = $.extend(true,[],defaultBoardData); 
            //TBD: use the templates

            htmlFragment = "<div id='boardheader'><div id='timer'><span id='minutes'></span> : <span id='seconds'></span></div>"+this.getLevelsDOM() +"</div>";
            htmlFragment +="<div id='board'>";

            for(i=0;i<81;i++){
                var defaultBoardCellData = defaultBoardData[i];
                bgClass='';

                if(defaultBoardCellData !==0){
                    cellDefaultValue = defaultBoardCellData;
                    bgClass = 'defaults ';
                }else{
                    cellDefaultValue = this.defaultCellData;
                    bgClass = 'fillers ';
                }

                //Group the small squares of 3*3 for background color
                bgClass += (Math.floor((i%boards.largeSquare)/boards.smallSquare)+Math.floor((Math.floor(i/boards.largeSquare))/boards.smallSquare)%2)%2?"":"gray";
                
                //This should be moved to templates dust/jade
                htmlFragment +="<div data-attr='"+i+"' class='board-"+i+" "+bgClass+"'>"+cellDefaultValue+"</div>";

            }
            htmlFragment +="</div>";
            htmlFragment +="<div id='numberSelector'><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>";

            //Timer container
            htmlFragment +="<div id='settings'><span id='clear' class='btn'>Clear Board</span></div>";
            $("#boardWrapper").html(htmlFragment);

        },
        getLevelsDOM: function() {
            var htmlObj = "<div id='levels'>";
            var that = this;
            //TBD: use the templates
            $.each(boards.levels, function(key, value) {
                var isSelected = (key === that.level)?" selected":"";
                htmlObj += "<span class='"+key+isSelected+"' data-level='"+key+"'>"+key+"</span>";
            });
            htmlObj +="</div>";
            return htmlObj;
        },
        getBoardData: function (level){
            //Returns a board array
            return boards.levels[level];
        },
        startTimer: function (){
            var startTime = new Date;
            console.log("Starting Timer");
            return function(reset){
                // if(reset){
                //     startTime = new Date;
                //     return;
                // }
                var $minutes = $("#minutes");
                var $seconds = $("#seconds");
                function displayTimer(){
                    var delta = new Date - startTime; //Time in ms
                    var minutes = ('0'+Math.floor(delta/60/1000)).slice(-2);
                    var seconds = ('0'+Math.floor((delta/1000)%60)).slice(-2);

                    $minutes.text(minutes);
                    $seconds.text(seconds);

                }
                setInterval(displayTimer, 1000);
            }
        },
        bindCellEvents: function (){
            var that=this;
            //TBD: add touch events, 300ms delay for clicks
            $("#board div.fillers").bind("click",function(){
                that.clearCellSelection();
                $(this).addClass("selected");
            });

            $("#clear").bind("click",function(){
                that.resetState(true);
                that.init(that.level);
            });

            $("#levels span").bind("click",function(){
                var $this = $(this);
                $this.addClass("selected").siblings().removeClass("selected");
                that.resetState();
                that.level = $this.attr("data-level");
                that.init(that.level);
            });
        },
        updateCell: function (){
            var that=this;
            $("#numberSelector span").bind("click",function(){
                var $selected = $("#board div.fillers.selected");
                var cellVal = $.trim($(this).text());
                
                cellVal = !isNaN(cellVal)?cellVal:0;

                $selected.text(cellVal);
                that.boardArray[$selected.attr("data-attr")] = parseInt(cellVal,10);

                that.saveState(that.boardArray);

                if(that.sudokuSolvedStatus()){
                    if(confirm("Sudoku solved!! Congrats. Go to next level.")){
                        that.resetState();
                    }
                }

            });

        },
        clearCellSelection: function (){
            $("#board div.fillers").each(function(){
                $(this).removeClass("selected");
            });
        },
        saveState: function (boardArray){
            var that = this;
            try{
                if(typeof Storage !== "undefined" && typeof localStorage !== "undefined"){
                    localStorage["sudokuArray"] = JSON.stringify(boardArray);
                    localStorage["sudokuLevel"] = that.level;
                }
            }catch(e){
                //Handle condition when user is in privarte mode
            }

        },
        loadState: function (){
            var that=this;
            try{
                if(typeof Storage !== "undefined" && typeof localStorage !== "undefined"){
                    if(typeof localStorage["sudokuArray"] !=="undefined"){
                        var i, storedState =  JSON.parse(localStorage["sudokuArray"]), storedLevel = localStorage["sudokuLevel"], largeSquare = boards.largeSquare;
                        //Validate if array exists and of size 81(9*9)
                        if(typeof storedState !=="undefined" && (storedState instanceof Array) && storedState.length == (largeSquare *largeSquare)){
                            this.generateBoardTemplate(storedLevel);
                            $("#board div").each(function(index){
                                var $this =$(this);
                                var storedStateIndexVal = storedState[index];
                                if(!$this.hasClass("defaults") && storedStateIndexVal !==0){
                                    $this.text(storedStateIndexVal);
                                    //Update the delta to the board
                                    that.boardArray[index] = storedStateIndexVal;
                                }
                            });

                            that.level = storedLevel;
                            return;
                        }
                    }
                }
            }catch(e){
                //Handle condition when user is in privarte mode
            }

            this.generateBoardTemplate(this.level);

        },
        resetState: function(){
            // this.startTimer()(true); //reset timer

            try{
                localStorage.clear();
            }catch(e){
                //fail silently
            }
        },
        sudokuSolvedStatus : function(){
            return (JSON.stringify(this.solvedBoardArray) === JSON.stringify(this.boardArray));
        },
        getSolvedData : function(arr){
            var dataArray = $.extend(true,[],arr); 

            // Algorithm is based on the below Gist
            // https://gist.github.com/p01/1230481
 
            var sudokuSolver = function R(a,i,j,m,g){for(i=80;a[i];i--||A);for(m=10;g=a[i]=--m;g&&R(a))for(j in a)g*=j==i||a[j]^m||i%9^j%9&&i/9^j/9&&i/27^j/27|i%9/3^j%9/3};
  
            try{
                sudokuSolver( dataArray );
            }catch(e){
                //fail silently
            }
            //console.log(dataArray);
            return dataArray;
        },
        init: function (){
           // this.generateBoardTemplate(level);
            this.loadState();
            this.startTimer()();
            this.bindCellEvents();
            this.updateCell();
            
        }
    };

    sudoku.init();

    //expose as global object for dev purposes
    //window.sudoku=sudoku;

})(jQuery);