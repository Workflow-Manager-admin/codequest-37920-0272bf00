import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * PUBLIC_INTERFACE
 * Angular SSR entrypoint using stable, public Angular SSR API (renderApplication).
 */
export default AppComponent;
