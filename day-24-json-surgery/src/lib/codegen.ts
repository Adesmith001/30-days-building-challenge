import type { TransformOperation } from "../types/operations"

export function generateJavaScript(operations: TransformOperation[]): string {
  const serialized = JSON.stringify(operations, null, 2)
  return `export function transform(input) {
  const operations = ${serialized};
  const clone = (value) => structuredClone(value);
  const parsePath = (value) => {
    const text = String(value || '').trim().replace(/^\\$\\.?/, '');
    if (!text) return [];
    const parts = [];
    const pattern = /(?:^|\\.)([^.[\\]]+)|\\[(\\*|\\d+|"(?:[^"\\\\]|\\\\.)*")\\]/g;
    for (const match of text.matchAll(pattern)) {
      if (match[1]) parts.push({ type: 'property', key: match[1] });
      else if (match[2] === '*') parts.push({ type: 'each' });
      else if (match[2].startsWith('"')) parts.push({ type: 'property', key: JSON.parse(match[2]) });
      else parts.push({ type: 'index', index: Number(match[2]) });
    }
    return parts;
  };
  const get = (root, path) => {
    let current = root;
    for (const segment of path) {
      if (segment.type === 'each' || current === null || typeof current !== 'object') return undefined;
      current = segment.type === 'index'
        ? Array.isArray(current) ? current[segment.index] : undefined
        : Array.isArray(current) ? undefined : current[segment.key];
    }
    return current;
  };
  const expand = (root, path) => {
    const result = [];
    const walk = (value, index, current) => {
      if (index === path.length) return result.push(current);
      const segment = path[index];
      if (segment.type === 'each') return Array.isArray(value) && value.forEach((item, itemIndex) => walk(item, index + 1, [...current, { type: 'index', index: itemIndex }]));
      if (segment.type === 'index') return Array.isArray(value) && segment.index in value && walk(value[segment.index], index + 1, [...current, segment]);
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && (segment.key in value || index === path.length - 1)) walk(value[segment.key], index + 1, [...current, segment]);
    };
    walk(root, 0, []);
    return result;
  };
  const set = (root, path, value) => {
    if (!path.length) return value;
    const parent = get(root, path.slice(0, -1));
    const leaf = path[path.length - 1];
    if (leaf.type === 'property' && parent && typeof parent === 'object' && !Array.isArray(parent)) parent[leaf.key] = value;
    if (leaf.type === 'index' && Array.isArray(parent)) parent[leaf.index] = value;
    return root;
  };
  const remove = (root, path) => {
    const parent = get(root, path.slice(0, -1));
    const leaf = path[path.length - 1];
    if (leaf.type === 'property' && parent && typeof parent === 'object' && !Array.isArray(parent)) delete parent[leaf.key];
    if (leaf.type === 'index' && Array.isArray(parent)) parent.splice(leaf.index, 1);
    return root;
  };
  const convert = (value, target) => {
    if (target === 'string') return String(value);
    if (target === 'number') { const number = typeof value === 'number' ? value : Number(value); if (!Number.isFinite(number)) throw new Error('Invalid number'); return number; }
    if (target === 'boolean' && (value === true || value === 'true' || value === 1)) return true;
    if (target === 'boolean' && (value === false || value === 'false' || value === 0)) return false;
    throw new Error('Invalid conversion');
  };
  const matches = (value, operator, expected) => operator === 'eq' ? value === expected : operator === 'neq' ? value !== expected : operator === 'contains' ? typeof value === 'string' && value.toLowerCase().includes(String(expected).toLowerCase()) : operator === 'gt' ? Number(value) > Number(expected) : operator === 'gte' ? Number(value) >= Number(expected) : operator === 'lt' ? Number(value) < Number(expected) : Number(value) <= Number(expected);
  let output = clone(input);
  for (const operation of operations) {
    if (!operation.enabled) continue;
    if (operation.type === 'FILTER') {
      const target = get(output, operation.path);
      const field = parsePath(operation.params.field);
      const filtered = target.filter((item) => matches(get(item, field), operation.params.operator || 'eq', operation.params.value));
      output = set(output, operation.path, filtered);
      continue;
    }
    const paths = expand(output, operation.path);
    if (operation.type === 'RENAME_KEY') paths.reverse().forEach((path) => { const leaf = path[path.length - 1]; const parent = get(output, path.slice(0, -1)); if (leaf && leaf.type === 'property' && parent && typeof parent === 'object' && !Array.isArray(parent)) { parent[operation.params.newKey] = parent[leaf.key]; delete parent[leaf.key]; } });
    if (operation.type === 'DELETE') paths.reverse().forEach((path) => remove(output, path));
    if (operation.type === 'CONVERT_TYPE') paths.forEach((path) => { output = set(output, path, convert(get(output, path), operation.params.targetType)); });
  }
  return output;
}`
}
