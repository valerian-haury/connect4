import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0],
    [0, 1, 1, 2, 1, 0, 0],
    [1, 2, 2, 2, 1, 1, 0],
  ];

  constructor() { }

  ngOnInit(): void {
  }

  setCell(x: number, y: number, owner: number): void {
    this.board[y][x] = owner;
  }
}
