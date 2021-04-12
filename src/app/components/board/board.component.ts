import { Component, OnInit } from '@angular/core';
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

  constructor() { }

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

  setCell(row: number, column: number, owner: number): void {
    if (row !== -1 || column !== -1) {
      this.board[row][column] = owner;
      this.nextTurn();
    }
  }

  getFirstEmptyColumnCell(columnNumber: number): Position {
    const columns: number[] = [];
    for (let row = (this.board.length - 1); row >= 0 ; row--) { // fill array with all the selected column values
      columns.push(this.board[row][columnNumber]);
    }

    for (const [index, column] of columns.entries()) { // find the first empty cell position
      if (column === 0) {
        const finalRowPos = (columns.length - 1 ) - index; // calculate the true row position
        return {row: finalRowPos, column: columnNumber};
      }
    }
    return {row: -1, column: -1};
  }

  handleCellClick(column: number): void {
    const emptyCell = this.getFirstEmptyColumnCell(column);
    this.setCell(emptyCell.row, emptyCell.column, this.currentPlayer);
  }
}
