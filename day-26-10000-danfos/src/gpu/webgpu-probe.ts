export async function runWebGpuProbe(
  count = 10_000,
  iterations = 120,
) {
  const gpu = (
    navigator as Navigator & {
      gpu?: {
        requestAdapter: () => Promise<any>;
      };
    }
  ).gpu;

  if (!gpu) {
    throw new Error("WebGPU is unavailable in this browser.");
  }

  const adapter = await gpu.requestAdapter();

  if (!adapter) {
    throw new Error("No WebGPU adapter was found.");
  }

  const device = await adapter.requestDevice();
  const bufferUsage = (
    globalThis as typeof globalThis & {
      GPUBufferUsage: {
        STORAGE: number;
        COPY_DST: number;
      };
    }
  ).GPUBufferUsage;

  const source = new Float32Array(count * 4);

  for (let i = 0; i < count; i += 1) {
    source[i * 4] = i % 100;
    source[i * 4 + 1] = Math.floor(i / 100);
    source[i * 4 + 2] = 0.2;
    source[i * 4 + 3] = -0.1;
  }

  const buffer = device.createBuffer({
    size: source.byteLength,
    usage:
      bufferUsage.STORAGE |
      bufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(buffer, 0, source);

  const shader = device.createShaderModule({
    code: `
      @group(0) @binding(0)
      var<storage, read_write> agents: array<vec4f>;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) id: vec3u) {
        let i = id.x;

        if (i >= arrayLength(&agents)) {
          return;
        }

        agents[i].x += agents[i].z * 0.016;
        agents[i].y += agents[i].w * 0.016;
      }
    `,
  });

  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: shader,
      entryPoint: "main",
    },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer },
      },
    ],
  });

  const started = performance.now();

  for (let i = 0; i < iterations; i += 1) {
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();

    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);

    pass.dispatchWorkgroups(
      Math.ceil(count / 64),
    );

    pass.end();

    device.queue.submit([encoder.finish()]);
  }

  await device.queue.onSubmittedWorkDone();

  const elapsed = performance.now() - started;

  buffer.destroy();
  device.destroy();

  return {
    agents: count,
    iterations,
    elapsed,
    averageDispatchMs: elapsed / iterations,
  };
}
