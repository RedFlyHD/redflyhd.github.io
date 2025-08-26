document.addEventListener('DOMContentLoaded', () => {
  const open = document.getElementById('songOpen');
  const modal = document.querySelector('.song-modal');
  const close = document.getElementById('songClose');
  if (open && modal) {
    open.addEventListener('click', () => {
      modal.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (close) {
    close.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
