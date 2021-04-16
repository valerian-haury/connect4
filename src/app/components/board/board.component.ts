import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Position} from '../../models/position';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {ThemePalette} from '@angular/material/core';

const MAX_TURN = 42;
const COLUMN_WIDTH = 68; // DO NOT CHANGE THIS VALUE.

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() row = 0;
  @Input() column = 0;
  @Input() currentPlayer = 1;
  @Input() finished = false;
  @Output() handleNextTurn = new EventEmitter();
  @Output() handleWin = new EventEmitter();

  boardWidth = 0;
  board: number[][] = [];
  event: any;
  mouseX = -1;
  mouseY = -1;
  arrowDisplayArray = [0, 0, 0, 1, 0, 0, 0];
  startXBoardPos = 0;
  endXBoardPos = 0;
  resizeObservable$: Observable<Event> | undefined;
  resizeSubscription$: Subscription | undefined;

  /* THEME */
  primary: ThemePalette = 'primary';
  accent: ThemePalette = 'accent';
  warn: ThemePalette = 'warn';


  constructor() {
  }

  ngOnInit(): void {
    this.boardWidth = this.column * COLUMN_WIDTH;

    this.updateScreenBoardPos();
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.updateScreenBoardPos();
    });
    this.newGame();
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.resizeSubscription$.unsubscribe();
  }

  trackByCell(index: number): number {
    return index;
  }

  updateScreenBoardPos(): void {
    this.startXBoardPos = (window.innerWidth / 2) - (this.boardWidth / 2);
    this.endXBoardPos = (window.innerWidth / 2) + (this.boardWidth / 2);
  }

  newGame(): void {
    const tempBoard = [];
    for(let i = 0; i < this.row; i++) {tempBoard.push(this.initArray(this.column))}
    this.board = tempBoard;  // fill the board
  }

  initArray(length: number): number[] {
    const arr = [];
    let i = 0;
    arr.length = length;
    while (i < length) { arr[i++] = 0; }
    return arr;
  }

  nextTurn(): void {
    this.handleNextTurn.emit();
  }

  win(): void {
    this.handleWin.emit();
  }

  setCell(row: number, column: number, owner: number): void {
    if (row !== -1 || column !== -1) {
      this.board[row][column] = owner;
      if (this.areFourConnected(this.currentPlayer)) {
        this.win();
      } else {
        this.nextTurn();
      }
    }
  }

  getFirstEmptyColumnCell(columnNumber: number): Position {
    const columns: number[] = [];
    for (let row = (this.board.length - 1); row >= 0; row--) { // fill array with all the selected column values
      columns.push(this.board[row][columnNumber]);
    }

    for (const [index, column] of columns.entries()) { // find the first empty cell position
      if (column === 0) {
        const finalRowPos = (columns.length - 1) - index; // calculate the true row position
        return {row: finalRowPos, column: columnNumber};
      }
    }
    return {row: -1, column: -1};
  }

  handleCellClick(column: number): void {
    if (!this.finished) {
      const emptyCell = this.getFirstEmptyColumnCell(column);
      this.setCell(emptyCell.row, emptyCell.column, this.currentPlayer);
    }
  }

  areFourConnected(player: number): boolean {
    // horizontalCheck
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length - 3; j++) {
        if (this.board[i][j] === player && this.board[i][j + 1] === player && this.board[i][j + 2] === player && this.board[i][j + 3] === player) {
          return true;
        }
      }
    }

    // verticalCheck
    for (let i = 0; i < this.board.length - 3 ; i++ ){
      for (let j = 0; j < this.board[0].length; j++){
        if (this.board[i][j] === player && this.board[i + 1][j] === player && this.board[i + 2 ][j] === player && this.board[i + 3][j] === player){
          return true;
        }
      }
    }

    // ascendingDiagonalCheck
    for (let i = 3; i < this.board.length; i++){
      for (let j = 0; j < this.board[0].length - 3; j++){
        if (this.board[i][j] === player && this.board[i - 1][j + 1] === player && this.board[i - 2][j + 2] === player && this.board[i - 3][j + 3] === player)
          return true;
      }
    }

    // descendingDiagonalCheck
    for (let i = 3; i < this.board.length; i++){
      for (let j = 3; j < this.board[0].length; j++){
        if (this.board[i][j] === player && this.board[i - 1][j - 1] === player && this.board[i - 2][j - 2] === player && this.board[i - 3][j - 3] === player)
          return true;
      }
    }

    return false;
  }

  coordinates(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    const arrowIndex = this.getArrowArrayIndexByXPosition(this.mouseX);
    if (arrowIndex <= 0) {
      this.updateArrowArray(0);
    }
    else if (arrowIndex >= this.column) {
      this.updateArrowArray(this.column - 1);
    }
    else {
      this.updateArrowArray(arrowIndex);
    }
  }

  updateArrowArray(i: number): void {
    const tempArray = [0, 0, 0, 0, 0, 0, 0];
    tempArray[i] = 1;
    this.arrowDisplayArray = tempArray;
  }

  getArrowArrayIndexByXPosition(x: number): number {
    const contextArea = this.endXBoardPos - this.startXBoardPos;
    const normalizedPos = (x - this.startXBoardPos) / contextArea * 100;
    const index = normalizedPos / (100 / this.column);
    return Math.round(index - 0.5);
  }

}
