import { BrowserSession } from './browser.session.js';

export type LoginType = 'FORM';

export interface LoginConfig {
  url: string;

  username: string;

  password: string;
}

export interface LoginStrategy {
  login(
    session: BrowserSession,

    config: LoginConfig
  ): Promise<void>;
}
