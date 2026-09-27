export const displayShader = `#version 300 es

precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uVideo;
uniform sampler2D uPrevious;
uniform sampler2D uAccumulation;
uniform sampler2D uFrozen;

uniform float uSourceAspect;
uniform float uCanvasAspect;

uniform float uBackgroundOpacity;
uniform float uGlow;

uniform float uBrightnessThreshold;
uniform float uMotionThreshold;
uniform float uMotionInfluence;
uniform float uSoftness;

uniform vec2 uTexel;

uniform int uBackground;
uniform int uDebug;
uniform int uMode;

uniform bool uMirror;
uniform bool uHasFrozen;

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

float luminance(vec3 color) {
  return dot(
    color,
    vec3(
      0.2126,
      0.7152,
      0.0722
    )
  );
}

vec3 currentFrame() {
  return texture(
    uVideo,
    cameraUv(vUv)
  ).rgb;
}

vec3 trailWithGlow() {
  vec3 centre =
    texture(
      uAccumulation,
      vUv
    ).rgb;

  if (uGlow <= 0.001) {
    return centre;
  }

  vec3 blur =
    texture(
      uAccumulation,
      vUv +
        vec2(uTexel.x, 0.0)
    ).rgb;

  blur += texture(
    uAccumulation,
    vUv -
      vec2(uTexel.x, 0.0)
  ).rgb;

  blur += texture(
    uAccumulation,
    vUv +
      vec2(0.0, uTexel.y)
  ).rgb;

  blur += texture(
    uAccumulation,
    vUv -
      vec2(0.0, uTexel.y)
  ).rgb;

  blur += texture(
    uAccumulation,
    vUv +
      uTexel
  ).rgb;

  blur += texture(
    uAccumulation,
    vUv -
      uTexel
  ).rgb;

  blur *= 0.1666;

  return max(
    centre,
    blur *
      uGlow *
      1.65
  );
}

void main() {
  vec3 current =
    currentFrame();

  vec3 previous =
    texture(
      uPrevious,
      vUv
    ).rgb;

  vec3 trail =
    trailWithGlow();

  if (uDebug == 1) {
    outColor =
      vec4(current, 1.0);

    return;
  }

  if (uDebug == 2) {
    float lum =
      luminance(current);

    outColor =
      vec4(
        vec3(lum),
        1.0
      );

    return;
  }

  if (uDebug == 3) {
    float diff =
      length(
        current -
        previous
      );

    outColor =
      vec4(
        vec3(
          min(
            1.0,
            diff * 3.5
          )
        ),
        1.0
      );

    return;
  }

  if (uDebug == 4) {
    float lum =
      luminance(current);

    float bright =
      smoothstep(
        uBrightnessThreshold,
        uBrightnessThreshold +
          uSoftness,
        lum
      );

    float diff =
      length(
        current -
        previous
      );

    float motion =
      smoothstep(
        uMotionThreshold,
        uMotionThreshold +
          0.08,
        diff
      );

    float mask =
      uMode == 1
        ? motion
        : bright *
          mix(
            1.0,
            motion,
            uMotionInfluence
          );

    outColor =
      vec4(
        vec3(mask),
        1.0
      );

    return;
  }

  if (uDebug == 5) {
    outColor =
      vec4(
        trail,
        1.0
      );

    return;
  }

  vec3 background =
    current;

  if (
    uBackground == 1 &&
    uHasFrozen
  ) {
    background =
      texture(
        uFrozen,
        vUv
      ).rgb;
  }

  if (uBackground == 2) {
    background =
      vec3(0.0);
  }

  background *=
    uBackgroundOpacity;

  vec3 finalColor =
    1.0 -
    (1.0 - background) *
    (1.0 - trail);

  outColor =
    vec4(
      finalColor,
      1.0
    );
}
`