#!/usr/bin/env python3
"""Serves the game to study tabs and keeps what studies/lab.js posts back.

    python3 studies/lab_server.py OUTDIR 8766 8767 8768 8769 8770 8771

Every port is its own origin, so every tab gets its own renderer and its own
service worker. Files are served from the repository root with caching off.

A tab posts to /__lab/<kind>?tab=X&crc=N. The body is checked against the
checksum lab.js computed, and a good post is appended as one JSON line to
OUTDIR/lab-<port>.jsonl with the body kept verbatim, so studies/lab_extract.py
can check it again. A bad checksum is refused with 400 and the tab retries.
"""
import http.server
import json
import os
import socket
import sys
import threading
import time
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCK = threading.Lock()


def crc(s):
    c = 0
    for i, ch in enumerate(s):
        c = (c + ord(ch) * (i + 1)) % 1000000007
    return c


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass

    def do_POST(self):
        u = urllib.parse.urlsplit(self.path)
        if not u.path.startswith('/__lab/'):
            self.send_error(404)
            return
        q = urllib.parse.parse_qs(u.query)
        body = self.rfile.read(int(self.headers.get('Content-Length') or 0)).decode('utf-8')
        want = int(q.get('crc', ['-1'])[0])
        ok = crc(body) == want
        if ok:
            port = self.server.server_address[1]
            line = json.dumps({'t': round(time.time(), 3), 'port': port,
                               'kind': u.path[len('/__lab/'):], 'tab': q.get('tab', [''])[0],
                               'crc': want, 'raw': body})
            with LOCK, open(os.path.join(OUT, f'lab-{port}.jsonl'), 'a', encoding='utf-8') as f:
                f.write(line + '\n')
        self.send_response(204 if ok else 400)
        self.end_headers()


class Server(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except OSError:
            pass
        super().server_bind()


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    OUT = os.path.abspath(sys.argv[1])
    os.makedirs(OUT, exist_ok=True)
    servers = [Server(('::', int(p)), Handler) for p in sys.argv[2:]]
    for s in servers:
        threading.Thread(target=s.serve_forever, daemon=True).start()
    print(f'serving {ROOT} on ports {" ".join(sys.argv[2:])}; posts to {OUT}', flush=True)
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        pass
