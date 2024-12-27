import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from './../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor(
    private _oAuthService: OAuthService,
    private authService: AuthService
  ) {
    this.authService.isPlatformBrowser() && this.initConfig();
  }
  login() {
    this._oAuthService.initCodeFlow();
  }

  getProfile() {
    return this._oAuthService.getIdentityClaims();
  }

  getToken(): string {
    return this._oAuthService.getAccessToken();
  }

  logout() {
    this._oAuthService.logOut();
  }

  initConfig() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin + '/home',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      clientId: environment.GOOGLE_CLIENT_ID,
      strictDiscoveryDocumentValidation: false,
      scope: 'openid profile email',
      responseType: 'code',
      showDebugInformation: true,
      dummyClientSecret: environment.GOOGLE_CLIENT_SECRET,
    };
    this._oAuthService.configure(authConfig);
    this._oAuthService.setupAutomaticSilentRefresh();
    // Check if user is not logged in
    if (this._oAuthService.getIdentityClaims() === null) {
      // Discovery Document of AuthServer as defined by OIDC
      let url = 'https://accounts.google.com/.well-known/openid-configuration';

      // Load Discovery Document and then try to login the user
      this._oAuthService.loadDiscoveryDocument(url).then(() => {
        this._oAuthService.tryLoginCodeFlow({});
      });
    }
  }
}
