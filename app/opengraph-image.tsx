import { ImageResponse } from 'next/og';

export const alt = 'Trendupp — The Creator Marketing Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0094',
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: '#d7176f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, color: '#ffffff' }}>#</div>
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 36,
          fontSize: 76,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
        }}
      >
        Trendupp
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          fontSize: 30,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        The Creator Marketing Platform
      </div>
    </div>,
    size,
  );
}
