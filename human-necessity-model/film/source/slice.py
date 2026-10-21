"""Cut Carla's narration into clips from the EDL: trim to speech, tighten long inner pauses, even out loudness.
Writes ../voices_carla/<id>.wav, dur.json and lines.json for story.js."""
import json, os, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt
from scipy.ndimage import uniform_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'voices_carla'); os.makedirs(OUT, exist_ok=True)
x, SR = sf.read(os.path.join(HERE, 'full.wav'), dtype='float32')
x = sosfiltfilt(butter(4, 75, 'hp', fs=SR, output='sos'), x).astype(np.float32)
edl = json.load(open(os.path.join(HERE, '..', 'carla-v4-edl.json')))['lines']
SUB = {  # on-screen subtitle where it should differ from the spoken text
}

def env_db(y):
    e = np.sqrt(uniform_filter1d(y ** 2, int(.02 * SR)) + 1e-12)
    return 20 * np.log10(e)

def clip(a, b, nxt_in=None, prv_out=None):
    a0 = a / 1000 - .35; b0 = b / 1000 + .5
    if prv_out is not None: a0 = max(a0, prv_out / 1000 + .05)
    if nxt_in is not None: b0 = min(b0, nxt_in / 1000 - .05)
    y = x[int(a0 * SR):int(b0 * SR)].copy()
    d = env_db(y); thr = max(d.max() - 38, -52)
    on = np.where(d > thr)[0]
    i0 = max(0, on[0] - int(.09 * SR)); i1 = min(len(y), on[-1] + int(.18 * SR))
    y = y[i0:i1]; d = d[i0:i1]
    # tighten inner pauses longer than .55 s down to .42 s
    quiet = d < thr; out = []; i = 0; n = len(y)
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            L = j - i
            if L > int(.55 * SR) and i > 0 and j < n:
                keep = int(.42 * SR); h = keep // 2
                seg = np.concatenate([y[i:i + h], y[j - (keep - h):j]])
                f = int(.01 * SR); seg[h - f:h] *= np.linspace(1, 0, f); seg[h:h + f] *= np.linspace(0, 1, f)
                out.append(seg)
            else: out.append(y[i:j])
            i = j
        else:
            j = i
            while j < n and not quiet[j]: j += 1
            out.append(y[i:j]); i = j
    y = np.concatenate(out)
    f = int(.012 * SR); y[:f] *= np.linspace(0, 1, f); y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    # speech-weighted loudness: rms over voiced frames to -20 dBFS
    v = y[env_db(y) > thr + 6]; r = np.sqrt(np.mean(v ** 2)) if len(v) else 1e-3
    y = y * (10 ** (-20 / 20) / r)
    return np.clip(y, -.98, .98).astype(np.float32)

dur, lines = {}, []
for k, l in enumerate(edl):
    vid = 'C' + str(l['id']).replace('-', '_')
    prv = edl[k - 1]['out'] if k else None; nxt = edl[k + 1]['in'] if k + 1 < len(edl) else None
    y = clip(l['in'], l['out'], nxt, prv)
    sf.write(os.path.join(OUT, vid + '.wav'), y, SR)
    e = env_db(y); thr = e.max() - 38; q = e < thr; gaps = []; i = 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if (j - i) / SR > .18 and i > 0 and j < len(q): gaps.append(round((i + j) / 2 / SR, 3))
            i = j
        else: i += 1
    dur[vid] = round(len(y) / SR, 3)
    lines.append({'id': vid, 'text': l['text'], 'sub': '' if l.get('card') else SUB.get(vid, l['text']), 'card': bool(l.get('card')), 'gaps': gaps})
json.dump(dur, open(os.path.join(OUT, 'dur.json'), 'w'), indent=0)
json.dump(lines, open(os.path.join(OUT, 'lines.json'), 'w'), indent=0, ensure_ascii=False)
print(len(dur), 'clips', round(sum(dur.values()), 1), 's')
for k, v in dur.items(): print(k, v)
