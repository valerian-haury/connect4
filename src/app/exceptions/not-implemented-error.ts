import {Exception} from './exception';

export class NotImplementedError extends Exception{
  constructor() {
    super('Not implemented!');
  }
}
