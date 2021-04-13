import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Position} from '../../models/position';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {ThemePalette} from '@angular/material/core';

const ROW = 6;
const COLUMN = 7;
const COLUMN_WIDTH = 68; // DO NOT CHANGE THIS VALUE.
const BOARD_WIDTH = COLUMN_WIDTH * COLUMN;
const MAX_TURN = 42;


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: number[][] = [];
  currentPlayer = 1;
  finished = false;
  winner = 0;
  turn = 0;
  normalizedTurn = 0;
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

  updateScreenBoardPos(): void {
    this.startXBoardPos = (window.innerWidth / 2) - (BOARD_WIDTH / 2);
    this.endXBoardPos = (window.innerWidth / 2) + (BOARD_WIDTH / 2);
    console.log('board left pos: ' + this.startXBoardPos);
    console.log('board right pos: ' + this.endXBoardPos);
  }

  newGame(): void {

    const tempBoard = [];
    for(let i = 0; i < ROW; i++) {tempBoard.push(this.initArray(COLUMN))}
    this.board = tempBoard;

    this.currentPlayer = 1;
    this.finished = false;
    this.winner = 0;
    this.turn = 1;
    this.normalizedTurn = 0;
  }

  initArray(length: number): number[] {
    let arr = [], i = 0;
    arr.length = length;
    while (i < length) { arr[i++] = 0; }
    return arr;
  }

  nextTurn(): void {
    if (this.turn >= MAX_TURN ) {
      this.win(3); // DRAW
    } else {
      this.turn++;
      this.normalizedTurn = this.turn / MAX_TURN * 100;
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
  }

  win(player: number): void {
    this.finished = true;
    this.winner = player;
  }

  setCell(row: number, column: number, owner: number): void {
    if (row !== -1 || column !== -1) {
      this.board[row][column] = owner;
      if (this.areFourConnected(this.currentPlayer)) {
        this.win(this.currentPlayer);
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
    else if (arrowIndex >= COLUMN) {
      this.updateArrowArray(COLUMN - 1);
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
    const index = normalizedPos / (100 / COLUMN);
    return Math.round(index - 0.5);
  }

}
