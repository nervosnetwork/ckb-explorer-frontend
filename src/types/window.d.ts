interface Window {
  webkitRequestAnimationFrame?: AnimationFrameProvider['requestAnimationFrame']
  webkitCancelAnimationFrame?: AnimationFrameProvider['cancelAnimationFrame']
}
