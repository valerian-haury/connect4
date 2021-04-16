import { Component } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'connect4';
  /* THEME */
  primary: ThemePalette = 'primary';
  accent: ThemePalette = 'accent';
  warn: ThemePalette = 'warn';
  isDark = false;

  // tslint:disable-next-line:typedef
  getThemeMode() {
    return {
      darkMode: this.isDark,
    };
  }
}
