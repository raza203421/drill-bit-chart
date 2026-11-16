import {Share} from 'react-native';

/** Explicit, user-directed hand-off only. Nothing is ever sent automatically. */
export async function shareFeedback(body: string): Promise<boolean> {
  try {
    await Share.share({title: 'Drill Bit Chart feedback', message: body});
    return true;
  } catch (e) {
    return false;
  }
}

export function copyFeedback(body: string): boolean {
  try {
    // Clipboard is still shipped by React Native core but is deprecated, so it is
    // resolved defensively instead of imported at module scope.
    const core: any = require('react-native');
    const clipboard = core && core.Clipboard;
    if (clipboard && typeof clipboard.setString === 'function') {
      clipboard.setString(body);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
