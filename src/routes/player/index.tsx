import { createFileRoute } from '@tanstack/react-router';

const Player = () => {
  return (
    <div>
      <h1>Player Page</h1>
      <p>This is the player page content.</p>
    </div>
  );
}

export const Route = createFileRoute('/player/')({
  component: Player,
});