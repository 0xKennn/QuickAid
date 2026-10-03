import React from 'react';
import { QuickAidWidget } from './QuickAidWidget';

export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(<QuickAidWidget />);
      break;

    case 'WIDGET_DELETED':
      // Nothing stored per-widget to clean up currently.
      break;

    case 'WIDGET_CLICK':
      // Not used — every button uses clickAction="OPEN_URI", which is
      // handled natively (tel: intents, deep links) without routing
      // through this handler at all.
      break;

    default:
      break;
  }
}