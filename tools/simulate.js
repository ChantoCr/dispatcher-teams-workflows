#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sampleQueue.json'), 'utf8'));
const leaders = new Set(data.leaders);
let queue = data.queue.map((x) => ({ ...x }));

function nowIso() {
  return new Date().toISOString();
}

function normalizeQueueOrder() {
  queue
    .sort((a, b) => a.queueOrder - b.queueOrder)
    .forEach((item, idx) => {
      item.queueOrder = idx + 1;
    });
}

function parseNextCommand(text) {
  const trimmed = text.trim();
  if (!trimmed.toLowerCase().startsWith('/next')) return null;
  const first = trimmed.indexOf('"');
  const last = trimmed.lastIndexOf('"');
  if (first === -1 || first === last) {
    throw new Error('Formato inválido. Usa: /next df "nombre de la tarea"');
  }
  const prefix = trimmed.slice(5, first).trim().toLowerCase();
  const tags = prefix ? prefix.split(/\s+/).filter(Boolean) : [];
  const taskName = trimmed.slice(first + 1, last);
  return { tags: tags.includes('all') ? ['all'] : tags, taskName };
}

function next({ sender, text }) {
  if (!leaders.has(sender)) {
    return '⛔ No tienes permiso para asignar tareas.';
  }

  const parsed = parseNextCommand(text);
  const available = queue.filter((a) => a.status.toLowerCase() === 'available');
  if (!available.length) return '⚠️ No hay agentes disponibles en este momento.';

  let selected = available[0];
  for (const a of available) {
    if (Number(a.queueOrder) < Number(selected.queueOrder)) selected = a;
  }
  selected.status = 'busy';
  selected.lastUpdatedUtc = nowIso();

  return `✅ Asignado a: ${selected.displayName} | 📌 ${parsed.taskName}`;
}

function status({ sender, cmd }) {
  const row = queue.find((q) => q.displayName === sender);
  if (!row) return '⚠️ No estás en cola. Contacta a un líder.';

  const map = {
    '/available': 'available',
    '/busy': 'busy',
    '/break': 'break',
    '/lunch': 'lunch',
    '/offline': 'offline',
    '/status': row.status,
  };

  if (!(cmd in map)) return null;
  if (cmd === '/status') return `ℹ️ Estado actual: ${row.status}`;

  const prev = row.status;
  const nextStatus = map[cmd];
  row.status = nextStatus;
  row.lastUpdatedUtc = nowIso();

  let reinsertion = '';
  if (prev === 'busy' && nextStatus === 'available') {
    const withoutSender = queue
      .filter((q) => q.displayName !== sender)
      .sort((a, b) => a.queueOrder - b.queueOrder);

    const insertIndex = row.boostMode === 'double' ? Math.floor(withoutSender.length / 2) : withoutSender.length;
    withoutSender.splice(insertIndex, 0, row);
    queue = withoutSender;
    normalizeQueueOrder();
    reinsertion = row.boostMode === 'double' ? '\n🔁 Reinsertado: centro' : '\n🔁 Reinsertado: final';
  }

  return `✅ Estado actualizado: ${prev} → ${nextStatus}${reinsertion}`;
}

function printQueue() {
  const sorted = [...queue].sort((a, b) => a.queueOrder - b.queueOrder);
  console.log('\nCola actual:');
  for (const item of sorted) {
    console.log(`${item.queueOrder}. ${item.displayName} [${item.status}] boost=${item.boostMode}`);
  }
}

try {
  console.log(next({ sender: 'Randall', text: '/next df "Revisar ticket 123"' }));
  console.log(status({ sender: 'Gabriel', cmd: '/busy' }));
  console.log(status({ sender: 'Gabriel', cmd: '/available' }));
  printQueue();
} catch (err) {
  console.error(String(err.message || err));
  process.exitCode = 1;
}
