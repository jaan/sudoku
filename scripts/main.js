'use strict';
(function(undefined){
	var boards = {
			easy:[0,4,0,7,3,0,8,0,0,0,0,7,0,9,0,3,0,5,0,3,6,4,8,0,0,0,0,2,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1,2,0,0,0,0,7,4,2,8,0,6,0,4,0,5,0,7,0,0,0,0,8,0,1,3,0,9,0]
		};

	var sudoku = {
		generateBoardTemplate: function (level){
			var i, j, htmlFragment="", defaultBoardData= this.getBoardData(level), cellDefaultValue, bgClass="", bgIndex=0;
			htmlFragment ="<div id='board'>"
			for(i=0;i<81;i++){
				cellDefaultValue =(defaultBoardData[i] !==0)?defaultBoardData[i]:'.';

				// if(bgIndex > 2){
				// 	bgIndex = 0;
				// 	bgClass = (bgClass ==="gray")?"":"gray";
				// }
				// bgIndex +=1;

				htmlFragment +="<div class='board-"+i+" "+bgClass+"'>"+cellDefaultValue+"</div>";

			}
			htmlFragment +="</div>";
			$("#boardWrapper").html(htmlFragment);
		},
		getBoardData: function(level){
			//Returns a board array
			return boards[level];
		},
		init:function(level){
			this.generateBoardTemplate(level);
		}
	};

	sudoku.init("easy");

})();