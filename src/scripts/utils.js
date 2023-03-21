function convertRGBA(r, g, b, a) {
  let rc = r/255;
  let gc = g/255;
  let bc = b/255;
  return [rc, gc, bc, a];
}

export { convertRGBA }