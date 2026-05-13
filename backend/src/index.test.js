import {
  describe, it, expect, beforeAll,
} from 'vitest';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

let app;

beforeAll(async () => {
  const mod = await import('./index.js');
  app = mod.default;
});

describe('POST /api/submit', () => {
  it('returns submitted text fields when no file is attached', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Alice')
      .field('message', 'Hello');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice');
    expect(res.body.message).toBe('Hello');
    expect(res.body.filePath).toBeNull();
  });

  it('saves the file and returns the filePath when a file is attached', async () => {
    const tmpFile = path.join(currentDir, 'test-upload.txt');
    fs.writeFileSync(tmpFile, 'test content');

    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Bob')
      .field('message', 'With file')
      .attach('file', tmpFile);

    fs.unlinkSync(tmpFile);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob');
    expect(res.body.filePath).toBeTruthy();
    expect(typeof res.body.filePath).toBe('string');

    // clean up uploaded file
    if (res.body.filePath && fs.existsSync(res.body.filePath)) {
      fs.unlinkSync(res.body.filePath);
    }
  });

  it('returns 400 when name is empty and message is missing', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', '');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
