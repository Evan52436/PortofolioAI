'use client';

import { useEffect, useRef } from 'react';

const BANNER = [
  '    _        _                        _          _           _____                        ',
  '   / \\   ___| | ___ __   _____      _| | ___  __| | __ _  __|_   _|__  __ _ _ __ ___  ___ ',
  "  / _ \\ / __| |/ / '_ \\ / _ \\ \\ /\\ / / |/ _ \\/ _` |/ _` |/ _ \\| |/ _ \\/ _` | '_ ` _ \\/ __|",
  ' / ___ \\ (__|   <| | | | (_) \\ V  V /| |  __/ (_| | (_| |  __/| |  __/ (_| | | | | | \\__ \\',
  '/_/   \\_\\___|_|\\_\\_| |_|\\___/ \\_/\\_/ |_|\\___|\\__,_|\\__, |\\___||_|\\___|\\__,_|_| |_| |_|___/',
  '                                                   |___/                                  ',
].join('\n');

export function ConsoleEasterEgg() {
  const loggedRef = useRef(false);

  useEffect(() => {
    if (loggedRef.current) return;
    loggedRef.current = true;

    console.log(
      `%c\n${BANNER}\n\n      AcknowledgeTeams`,
      'color: #00e5ff; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 1.15;'
    );
    console.log(
      '%cCreated by chargerleptop',
      'font-size: 14px; font-weight: bold; color: #4CAF50; font-family: monospace, sans-serif;'
    );
  }, []);

  return null;
}
