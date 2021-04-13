import {Component, OnInit} from '@angular/core';
import {Position} from '../../models/position';

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

  constructor() {
  }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    this.currentPlayer = 1;
    this.finished = false;
    this.winner = 0;
  }

  nextTurn(): void {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
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

  areFourConnected(player: number): boolean { // https://stackoverflow.com/questions/32770321/connect-4-check-for-a-win-algorithm
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
}
