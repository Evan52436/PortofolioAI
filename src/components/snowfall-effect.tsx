'use client';

import Snowfall from 'react-snowfall';

export function SnowfallEffect() {
  return (
    <Snowfall
      color="#FFFFFF"
      snowflakeCount={40}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    />
  );
}
