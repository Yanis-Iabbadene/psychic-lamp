// Add the teaser file to assets/ and set this path when the video is ready.
const TEASER_VIDEO_URL = '';

const player = document.getElementById('teaser-player');
const video = document.getElementById('teaser-video');
const centerButton = document.getElementById('play-button');
const controlPlay = document.getElementById('control-play');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const muteButton = document.getElementById('mute-button');
const fullscreenButton = document.getElementById('fullscreen-button');
const message = document.getElementById('player-message');

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function togglePlayback() {
  if (!TEASER_VIDEO_URL) {
    message.textContent = 'Teaser coming soon';
    return;
  }
  if (video.paused) video.play().catch(() => { message.textContent = 'Unable to play the teaser'; });
  else video.pause();
}

centerButton.addEventListener('click', togglePlayback);
controlPlay.addEventListener('click', togglePlayback);
video.addEventListener('click', togglePlayback);

if (TEASER_VIDEO_URL) {
  video.src = TEASER_VIDEO_URL;
  video.removeAttribute('aria-hidden');
  video.load();
  centerButton.setAttribute('aria-label', 'Play teaser');
  for (const control of [controlPlay, progress, muteButton, fullscreenButton]) control.disabled = false;
  player.dataset.state = 'ready';
  document.querySelector('.teaser-note').textContent = 'Turn up the sound and take a first look.';
}

video.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(video.duration); });
video.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(video.currentTime);
  progress.value = video.duration ? String(Math.round(video.currentTime / video.duration * 1000)) : '0';
});
video.addEventListener('play', () => {
  player.dataset.state = 'playing';
  centerButton.setAttribute('aria-label', 'Pause teaser');
  controlPlay.setAttribute('aria-label', 'Pause teaser');
});
video.addEventListener('pause', () => {
  player.dataset.state = 'paused';
  centerButton.setAttribute('aria-label', 'Play teaser');
  controlPlay.setAttribute('aria-label', 'Play teaser');
});
video.addEventListener('ended', () => { player.dataset.state = 'paused'; });
video.addEventListener('error', () => {
  player.dataset.state = 'placeholder';
  message.textContent = 'Teaser unavailable right now';
});

progress.addEventListener('input', () => {
  if (video.duration) video.currentTime = Number(progress.value) / 1000 * video.duration;
});
muteButton.addEventListener('click', () => {
  video.muted = !video.muted;
  muteButton.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  muteButton.style.opacity = video.muted ? '.5' : '1';
});
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else player.requestFullscreen?.();
});
