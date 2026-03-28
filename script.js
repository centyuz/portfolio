document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bento-cell').forEach((cell, i) => {
    cell.style.setProperty('--delay', `${0.05 + i * 0.06}s`);
  });
});
