import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './widget/widgetTaskHandler';

// Register the Android widget task handler
registerWidgetTaskHandler(widgetTaskHandler);

// Register the main Expo application
registerRootComponent(App);