export const cameraCopyShader = `#version 300 es

precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uVideo;

uniform float uSourceAspect;
uniform float uCanvasAspect;

uniform bool uMirror;

vec2 cameraUv(vec2 uv) {
  if (uSourceAspect > uCanvasAspect) {
    float scale =
      uCanvasAspect /
      uSourceAspect;

    uv.x =
      (uv.x - 0.5) *
      scale +
      0.5;
  } else {
    float scale =
      uSourceAspect /
      uCanvasAspect;

    uv.y =
      (uv.y - 0.5) *
      scale +
      0.5;
  }

  if (uMirror) {
    uv.x = 1.0 - uv.x;
  }

  return uv;
}

void main() {
  outColor =
    texture(
      uVideo,
      cameraUv(vUv)
    );
}
`