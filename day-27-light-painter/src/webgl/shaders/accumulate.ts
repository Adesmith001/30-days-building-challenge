export const accumulateShader = `#version 300 es

precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uVideo;
uniform sampler2D uPrevious;
uniform sampler2D uAccumulation;

uniform float uSourceAspect;
uniform float uCanvasAspect;

uniform float uBrightnessThreshold;
uniform float uMotionThreshold;
uniform float uMotionInfluence;

uniform float uDecay;
uniform float uStrength;
uniform float uSoftness;

uniform vec3 uNeonColor;

uniform float uTime;

uniform int uMode;
uniform int uBlend;
uniform int uSymmetry;
uniform int uTimeColor;

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

vec3 timePalette(float time) {
  float wave =
    0.5 +
    0.5 *
    sin(time * 1.35);

  return mix(
    vec3(
      0.18,
      0.92,
      1.0
    ),
    vec3(
      1.0,
      0.16,
      0.72
    ),
    wave
  );
}

vec3 contributionAt(vec2 uv) {
  vec3 current =
    texture(
      uVideo,
      cameraUv(uv)
    ).rgb;

  vec3 previous =
    texture(
      uPrevious,
      uv
    ).rgb;

  float lum =
    luminance(current);

  float difference =
    length(
      current -
      previous
    );

  float brightnessMask =
    smoothstep(
      uBrightnessThreshold,
      uBrightnessThreshold +
        uSoftness,
      lum
    );

  float motionMask =
    smoothstep(
      uMotionThreshold,
      uMotionThreshold +
        0.08,
      difference
    );

  float mask = 0.0;
  vec3 color = current;

  if (uMode == 1) {
    mask = motionMask;

    color =
      current *
      0.72;
  } else {
    mask =
      brightnessMask *
      mix(
        1.0,
        motionMask,
        uMotionInfluence
      );

    if (uMode == 0) {
      color = mix(
        vec3(lum),
        current,
        0.22
      );
    }

    if (uMode == 3) {
      color = uNeonColor;
    }
  }

  if (uTimeColor == 1) {
    color = timePalette(uTime);
  }

  return
    color *
    mask *
    uStrength;
}

vec3 symmetryContribution(
  vec2 uv
) {
  vec3 result =
    contributionAt(uv);

  if (
    uSymmetry == 1 ||
    uSymmetry == 3
  ) {
    result = max(
      result,
      contributionAt(
        vec2(
          1.0 - uv.x,
          uv.y
        )
      )
    );
  }

  if (
    uSymmetry == 2 ||
    uSymmetry == 3
  ) {
    result = max(
      result,
      contributionAt(
        vec2(
          uv.x,
          1.0 - uv.y
        )
      )
    );
  }

  if (uSymmetry == 3) {
    result = max(
      result,
      contributionAt(
        vec2(
          1.0 - uv.x,
          1.0 - uv.y
        )
      )
    );
  }

  return result;
}

void main() {
  vec3 oldTrail =
    texture(
      uAccumulation,
      vUv
    ).rgb *
    uDecay;

  vec3 incoming =
    symmetryContribution(vUv);

  vec3 nextTrail;

  if (uBlend == 1) {
    nextTrail =
      1.0 -
      (1.0 - oldTrail) *
      (1.0 - incoming);
  } else if (uBlend == 2) {
    nextTrail =
      max(
        oldTrail,
        incoming
      );
  } else {
    nextTrail =
      min(
        vec3(1.0),
        oldTrail +
        incoming
      );
  }

  outColor = vec4(
    nextTrail,
    1.0
  );
}
`