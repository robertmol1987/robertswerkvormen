export function LandingAnimations() {
  return (
    <style jsx global>{`
      @keyframes diceRoll {
        0% { transform: rotate(0deg) scale(1); }
        20% { transform: rotate(72deg) scale(1.2); }
        40% { transform: rotate(144deg) scale(0.9); }
        60% { transform: rotate(216deg) scale(1.3); }
        80% { transform: rotate(288deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes landingFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes revealFade {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
      .dice-roll-anim {
        animation: diceRoll 0.4s ease-in-out infinite;
      }
      .landing-fade {
        animation: landingFadeIn 400ms ease-out;
      }
      .reveal-fade {
        animation: revealFade 0.35s ease-out;
      }
    `}</style>
  );
}
