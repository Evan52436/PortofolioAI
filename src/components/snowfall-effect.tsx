'use client';

import Snowfall from 'react-snowfall';

export function SnowfallEffect() {
  return (
    <Snowfall
      color="#FFFFFF"
      snowflakeCount={45}
      wind={[1.0, 2.5]}
      speed={[1.0, 2.2]}
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
