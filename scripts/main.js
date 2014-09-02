'use strict';
(function($,undefined){
    var boards = {
            easy:[0,4,0,7,3,0,8,0,0,0,0,7,0,9,0,3,0,5,0,3,6,4,8,0,0,0,0,2,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1,2,0,0,0,0,7,4,2,8,0,6,0,4,0,5,0,7,0,0,0,0,8,0,1,3,0,9,0],
            smallSquare:3,
            largeSquare:9
        };

    var sudoku = {
        generateBoardTemplate: function (level){
            var i, j, htmlFragment='', defaultBoardData= this.getBoardData(level), cellDefaultValue, bgClass;
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
                htmlFragment +="<div class='board-"+i+" "+bgClass+"'>"+cellDefaultValue+"</div>";

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
            return function(){
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
            $("#board div.fillers").bind("click",function(){
                that.clearCellSelection();
                $(this).addClass("selected");
            });
        },
        updateCell: function (){
            $("#numberSelector span").bind("click",function(){
                $("#board div.fillers.selected").text($(this).text());
            });
        },
        clearCellSelection: function (){
            $("#board div.fillers").each(function(){
                $(this).removeClass("selected");
            });
        },
        init: function (level){
            this.generateBoardTemplate(level);
            this.startTimer()();
            this.bindCellEvents();
            this.updateCell();
        }
    };

    sudoku.init("easy");

})(jQuery);