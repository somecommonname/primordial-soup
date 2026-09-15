#!/usr/bin/env python3
"""Watches what study tabs post to studies/lab_server.py and prints only what needs acting on.

    python3 studies/lab_watch.py OUTDIR A,B,C,D,E,F [--stall 20] [--beat 20] [--since EPOCH]

Posts already on disk when it starts are treated as seen, unless they were made at or after
--since (seconds since the epoch), so a queue armed a moment earlier is not missed. Prints one line per finished
run, every error and every completed queue, plus a heartbeat of each tab's last progress
every --beat minutes. Exits when every named tab has completed its queue, when any tab
reports an error, or when no tab has posted anything for --stall minutes.
"""
import argparse
import glob
import json
import os
import time


def read_all(outdir, offsets):
    """Yields records appended since the last call."""
    for path in sorted(glob.glob(os.path.join(outdir, 'lab-*.jsonl'))):
        with open(path, encoding='utf-8') as f:
            f.seek(offsets.get(path, 0))
            while True:
                line = f.readline()
                if not line or not line.endswith('\n'):
                    break
                offsets[path] = f.tell()
                yield json.loads(line)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('outdir')
    ap.add_argument('tabs')
    ap.add_argument('--stall', type=float, default=20)
    ap.add_argument('--beat', type=float, default=20)
    ap.add_argument('--since', type=float, default=None)
    a = ap.parse_args()
    tabs = a.tabs.split(',')
    offsets = {}
    backlog = [rec for rec in read_all(a.outdir, offsets) if a.since is not None and rec['t'] >= a.since]
    print(f'watching tabs {",".join(tabs)} in {a.outdir}; {len(backlog)} earlier posts replayed', flush=True)
    done, last_post, last_beat, latest = set(), time.time(), time.time(), {}
    while True:
        for rec in backlog + list(read_all(a.outdir, offsets)):
            last_post = time.time()
            body = json.loads(rec['raw'])
            kind, tab = rec['kind'], rec['tab']
            if kind == 'progress':
                latest[tab] = body
            elif kind == 'data':
                acc = body.get('accept')
                verdict = '' if acc is None else (' ACCEPTANCE PASS' if acc['pass'] else f' ACCEPTANCE FAIL {acc["diffs"][:3]}')
                print(f'run  {tab} {body["i"] + 1}/{body["n"]} {body["label"]} stop={body["stop"]} '
                      f'gen={body["fin"]["gen"]} wall={body["wallMs"] // 1000}s{verdict}', flush=True)
            elif kind == 'error':
                print(f'ERROR {tab} job {body.get("i", -1) + 1}: {body.get("label")} at step {body.get("step")}: '
                      f'{body.get("message")}', flush=True)
                return
            elif kind == 'complete':
                done.add(tab)
                print(f'done {tab}: {body["posted"]}/{body["n"]} runs posted', flush=True)
        backlog = []
        if all(t in done for t in tabs):
            print('ALL TABS COMPLETE', flush=True)
            return
        now = time.time()
        if now - last_post > a.stall * 60:
            print(f'STALL: nothing posted for {a.stall:g} minutes', flush=True)
            return
        if now - last_beat > a.beat * 60:
            last_beat = now
            parts = [f'{t} {p["i"] + 1}/{p["n"]} gen {p["gen"]} {p["sps"]}/s' for t, p in sorted(latest.items()) if t not in done]
            if parts:
                print('beat ' + ' | '.join(parts), flush=True)
        time.sleep(5)


if __name__ == '__main__':
    main()
