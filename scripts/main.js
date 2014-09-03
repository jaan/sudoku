'use strict';
(function($,undefined){
    var boards = {
            easy:[0,4,0,7,3,0,8,0,0,0,0,7,0,9,0,3,0,5,0,3,6,4,8,0,0,0,0,2,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1,2,0,0,0,0,7,4,2,8,0,6,0,4,0,5,0,7,0,0,0,0,8,0,1,3,0,9,0],
            smallSquare:3,
            largeSquare:9
        };

    var sudoku = {
        boardArray:[],
        generateBoardTemplate: function (level){
            var i, j, htmlFragment='', defaultBoardData=this.getBoardData(level), cellDefaultValue, bgClass;

            this.boardArray = defaultBoardData;
            htmlFragment ="<div id='board'>";

            for(i=0;i<81;i++){
                var defaultBoardCellData = defaultBoardData[i];
                bgClass='';

                if(defaultBoardCellData !==0){
                    cellDefaultValue = defaultBoardCellData;
                    bgClass = 'defaults ';
                }else{
                    cellDefaultValue = '.';
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
            htmlFragment +="<div id='timer'>Timer  <span id='minutes'></span> : <span id='seconds'></span></div>";
            $("#boardWrapper").html(htmlFragment);
        },
        getBoardData: function (level){
            //Returns a board array
            return boards[level];
        },
        startTimer: function (){
            var startTime = new Date;
            console.log("Starting Timer");
            return function(reset){
                // if(reset){
                //     startTime = new Date;
                //     return;
                // }
                function displayTimer(){
                    var delta = new Date - startTime; //Time in ms
                    var minutes = ('0'+Math.floor(delta/60/1000)).slice(-2);
                    var seconds = ('0'+Math.floor((delta/1000)%60)).slice(-2);

                    $("#minutes").text(minutes);
                    $("#seconds").text(seconds);

                }
                setInterval(displayTimer, 1000);
            }
        },
        bindCellEvents: function (){
            var that=this;
            //TBD: add touch events
            $("#board div.fillers").bind("click",function(){
                that.clearCellSelection();
                $(this).addClass("selected");
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

            });
        },
        clearCellSelection: function (){
            $("#board div.fillers").each(function(){
                $(this).removeClass("selected");
            });
        },
        saveState: function (boardArray){
            try{
                if(typeof Storage !== "undefined" && typeof localStorage !== "undefined"){
                    localStorage["sudokuArray"]= JSON.stringify(boardArray);
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
                        var i, storedState =  JSON.parse(localStorage["sudokuArray"]), largeSquare = boards.largeSquare;
                        //Validate if array exists and of size 81(9*9)
                        if(typeof storedState !=="undefined" && (storedState instanceof Array) && storedState.length == (largeSquare *largeSquare)){
                            $("#board div").each(function(index){
                                var $this =$(this);
                                if(!$this.hasClass("defaults") && storedState[index] !==0){
                                    $this.text(storedState[index]);
                                    //Update the delta to the board
                                    that.boardArray[index] = storedState[index];
                                }
                            });
                        }
                    }
                }
            }catch(e){
                //Handle condition when user is in privarte mode
            }
        },
        resetState: function(){
            this.startTimer()(true); //reset timer

            try{
                localStorage.clear();
            }catch(e){
                //fail silently
            }
        },
        init: function (level){
            this.generateBoardTemplate(level);
            this.startTimer()();
            this.bindCellEvents();
            this.updateCell();
            this.loadState();
        }
    };

    sudoku.init("easy");
    window.sudoku=sudoku;

})(jQuery);