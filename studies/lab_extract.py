#!/usr/bin/env python3
"""Collects one study's finished runs from what studies/lab_server.py recorded.

    python3 studies/lab_extract.py OUTDIR STUDY OUTFILE

Checks every run's checksum again, keeps the last post of each (tab, job) pair, and
refuses to write anything if a tab's queue is incomplete or a checksum fails.
"""
import glob
import json
import os
import sys


def crc(s):
    c = 0
    for i, ch in enumerate(s):
        c = (c + ord(ch) * (i + 1)) % 1000000007
    return c


def main():
    outdir, study, outfile = sys.argv[1:4]
    runs, expected, bad, armed = {}, {}, [], []
    for path in sorted(glob.glob(os.path.join(outdir, 'lab-*.jsonl'))):
        for n, line in enumerate(open(path, encoding='utf-8')):
            rec = json.loads(line)
            if rec['kind'] not in ('data', 'armed'):
                continue
            if crc(rec['raw']) != rec['crc']:
                bad.append((os.path.basename(path), n))
                continue
            body = json.loads(rec['raw'])
            if body.get('study') != study:
                continue
            if rec['kind'] == 'armed':
                armed.append(body)
                continue
            expected[body['tab']] = body['n']
            runs[(body['tab'], body['i'])] = body
    got = {t: sum(1 for k in runs if k[0] == t) for t in expected}
    print('expected per tab:', expected, '| recovered:', got, '| checksum failures:', bad)
    if bad or any(got[t] != expected[t] for t in expected):
        sys.exit('incomplete or corrupt: nothing written')
    ordered = [runs[k] for k in sorted(runs)]
    json.dump({'study': study, 'armed': armed, 'runs': ordered}, open(outfile, 'w'))
    print(f'wrote {len(ordered)} runs to {outfile}')


if __name__ == '__main__':
    main()
