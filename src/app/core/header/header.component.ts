import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../../shared/services/settings.service';
import { AuthService } from '../../shared/services/auth.service';
import { Settings } from '../../shared/models/settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  settings: Settings;

  constructor(
    private _settingsService: SettingsService,
    private _authService: AuthService
  ) {
    this.settings = this._settingsService.settings;
  }

  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }

  logout(): void {
    this._authService.logout();
  }

  ngOnInit() {
  }

  toggleSettings() {
    this._settingsService.toggleSettings();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
