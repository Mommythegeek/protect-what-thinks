"""The Seal Remains — score, foley, ambience and voice → out/mix.wav
Score: shamisen (physical model), shakuhachi (processed CC0 flute/recorder samples), taiko and hyoshigi (synth + CC0 samples).
Instrument recipes adapted from the Lemo-Opuscar ukiyo-e demo (MIT)."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from score_lib import *          # SR, N, DUR, E, S, P, stems, put, sam, shaku, odaiko, shime, hyoshigi, cut, bpf, lpf, hpf, rng
from core.audio.sfx import t_, env_exp, norm, compress, limit
from scipy.ndimage import uniform_filter1d

EV = E['ev']
MK = {e['k']: e['t'] for e in EV if e['type'] == 'mark'}
SHEETS = sorted([(e['i'], e['t'], e['end']) for e in EV if e['type'] == 'sheet'])
CARDS = {e['k']: (e['t'], e['end']) for e in EV if e['type'] == 'card'}
VOS = [(e['t'], e['id']) for e in EV if e['type'] == 'vo']
sh = lambda i: SHEETS[i][1]
MA0, MA1 = MK['ma'], MK['print7']

# ================= SCORE =================
MODE = ['D3', 'Eb3', 'G3', 'A3', 'Bb3', 'D4', 'Eb4', 'G4', 'A4', 'Bb4', 'D5']   # miyako-bushi on D
# jo: sparse shamisen phrases + a shakuhachi line, sheets 0–2
phr = [['D4', 'A3', 'Bb3'], ['G4', 'Eb4', 'D4'], ['A4', 'G4', 'Eb4', 'D4'], ['D4', 'Bb3', 'A3']]
t = 1.6; k = 0
while t < sh(3) - 1:
    for j, p in enumerate(phr[k % 4]): put('shamisen', sam(p, .5 + .1 * (j == 0), buzz=.75), t + j * .42, .55, -.2 + .1 * j)
    t += 4.2 if k % 2 == 0 else 5.1; k += 1
put('shakuhachi', shaku('A4', 3.4, .45, slide=-2, fall=-1, breath=1.1), 3.0, .7, .15)
put('shakuhachi', shaku('D5', 4.0, .45, slide=-2, fall=-1, breath=1.0), sh(1) + 1.5, .65, .15)
put('shakuhachi', shaku('Bb4', 3.0, .45, slide=-1.5, kari=.6), sh(2) + 2.0, .6, .1)
# ha: a pulse that tightens, sheets 3–6
bpm = 76; beat = 60 / bpm
t = sh(3); n = 0
ost = ['D3', 'A3', 'D4', 'A3', 'Eb4', 'A3', 'D4', 'A3']
while t < MA0 - .4:
    i = n % 8; sec = 0 if t < sh(5) else 1
    put('shamisen', sam(ost[i], .42 + .12 * (i == 0), dur=.5, buzz=.6), t, .45 + .15 * sec, (-.25 if i % 2 else .25))
    if i in (0, 4): put('taiko', shime(.35 + .15 * sec), t, .5, .1)
    if sec and i == 0: put('taiko', cut(odaiko(.45), 1.0), t, .4, 0)
    t += beat / 2; n += 1
put('shakuhachi', shaku('G4', 3.2, .5, slide=-2, fall=-1), sh(4) + 1.0, .6, -.1)
put('shakuhachi', shaku('D5', 4.5, .5, slide=-2, fall=-1.2, swell=.8), sh(6) + 1.0, .6, .1)
# a breath in before the silence
# ma: hard silence MA0..MA1 (applied below)
# peak: taiko heartbeat on every stamp + one long mournful shakuhachi
for e in EV:
    if e['type'] == 'seal' and MA1 < e['t'] < CARDS['C'][0]: put('taiko', cut(odaiko(.5), 1.1), e['t'], .5, 0)
put('shakuhachi', shaku('D5', 5.5, .55, slide=-3, fall=-1.5, swell=.9, breath=1.2, rel=1.2), MK['print7'] + 1.0, .75, .05)
put('shakuhachi', shaku('A4', 4.5, .5, slide=-2, fall=-2, swell=.6, rel=1.2), MK['fade'] + 2.6, .7, -.05)
# Europe: the pulse returns, lighter; hyoshigi under the counting seals
t = sh(8) + .2; n = 0
while t < CARDS['D'][0]:
    i = n % 8; put('shamisen', sam(ost[i], .35, dur=.45, buzz=.5), t, .35, (-.25 if i % 2 else .25)); t += beat / 2; n += 1
# unfinished: single sawari notes, wide apart
for j, tt in enumerate(np.arange(sh(9) + .5, sh(11) - .5, 3.3)):
    put('shamisen', sam(['D3', 'A3', 'Bb3', 'G3', 'D4', 'Eb4', 'A3'][j % 7], .55, t60=3.5, buzz=.9), tt, .55, (-.3 if j % 2 else .3))
# your turn: rising line, accelerating hyoshigi under the pull-back, final strum + long shakuhachi
for j, p in enumerate(['D4', 'Eb4', 'G4', 'A4', 'Bb4', 'D5']): put('shamisen', sam(p, .5), sh(11) + .5 + j * .55, .5, -.2 + .08 * j)
tp = MK['pull']; gaps = [.5, .44, .38, .32, .26, .21, .17, .14, .12, .1, .09, .08, .07, .07, .06, .06]
tt = tp
for g in gaps: put('hyoshigi', hyoshigi(.55 + .3 * (g < .2)), tt, .55, .2); tt += g
put('shamisen', P.strum('shamisen', ['D3', 'A3', 'D4'], None, .9, spread=.02, buzz=.85, t60=3.0), MK['end'], 1.0, 0)
put('taiko', odaiko(.85, big=True), MK['end'], .85, 0)
put('shakuhachi', shaku('D5', 4.2, .5, slide=-2, fall=-1.0, swell=.7, breath=1.1, rel=1.0), MK['end'] + .9, .8, .1)
# card hits: one big drum + a strum on every catchphrase
for k, (a, b) in CARDS.items():
    if k == 'E': continue
    put('taiko', odaiko(.8 if k != 'C' else 1.0, big=(k == 'C')), a, .8, 0)
    put('shamisen', P.strum('shamisen', ['D3', 'A3', 'D4'], None, .75, spread=.03, buzz=.8, t60=2.4), a + .05, .7, 0)

wet = {'shamisen': (.45, .2), 'shakuhachi': (.6, .3), 'taiko': (.65, .22), 'hyoshigi': (.35, .12), 'other': (.5, .2)}
for k, (sz, mx) in wet.items():
    if np.abs(stems[k]).max() > 0: stems[k] = S.room(stems[k], size=sz, mix=mx).astype(np.float32)
GAIN = {'shamisen': 1.0, 'shakuhachi': .75, 'taiko': .95, 'hyoshigi': .85, 'other': 1.0}
music = sum(stems[k] * GAIN[k] for k in stems)

# ================= FOLEY =================
fol = np.zeros((N, 2), np.float32)
def nz(d): return rng.standard_normal(int(round(d * SR)))
def baren(d=.36, v=1):
    tt = t_(d); m = .55 + .45 * np.abs(np.sin(2 * np.pi * 4.6 * tt)); e = np.sin(np.pi * tt / d) ** .7
    return norm(bpf(nz(d), 700, 5200) * m * e + lpf(nz(d), 500) * e * .3) * v
def sines(fs, d, taus, amps):
    tt = t_(d); return sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / tau) for f, tau, a in zip(fs, taus, amps))
def seal(v=1):
    d = .35; x = sines([88, 180], d, [.07, .03], [1, .4]); x[:int(.012 * SR)] += bpf(nz(.012), 200, 1500) * .9
    y = np.zeros(int(.45 * SR)); y[:len(x)] += x; k = int(.22 * SR); c = hpf(nz(.08), 3000) * env_exp(.08, .02) * .15; y[k:k + len(c)] += c
    return norm(lpf(y, 2500)) * v
def scroll(d, v=1):
    tt = t_(d); e = np.sin(np.pi * np.minimum(tt / d, 1)) ** 1.2
    return norm(bpf(nz(d), 900, 3200) * e + lpf(nz(d), 300) * e * .4) * v
def block(v=1): return norm(sines([310, 620, 1240], .3, [.05, .03, .015], [1, .5, .2]) + bpf(nz(.3), 200, 2000) * env_exp(.3, .01) * .6) * v
def bead(v=1): return norm(sines([1900, 3100, 4700], .12, [.02, .012, .008], [1, .6, .3]) + bpf(nz(.12), 2000, 8000) * env_exp(.12, .003)) * v
def tick(v=1): return norm(sines([2600, 4100], .06, [.008, .005], [1, .5])) * v
def flap(d=2.4, v=1):   # paper wings
    tt = t_(d); m = np.abs(np.sin(2 * np.pi * 3.5 * tt)) ** 3; e = np.sin(np.pi * tt / d)
    return norm(bpf(nz(d), 1500, 6000) * m * e) * v
def brush(d=2.6, v=1):
    tt = t_(d); e = np.sin(np.pi * np.minimum(tt / d, 1)) ** .6 * (1 - .4 * tt / d)
    return norm(bpf(nz(d), 400, 2400) * e + hpf(nz(d), 4000) * e * .25) * v
def vanish(v=1):
    d = .9; tt = t_(d); e = np.sin(np.pi * tt / d) ** 2
    return norm(bpf(nz(d), np.float64(1200), 7000) * e) * v
def rain(d, v=1):
    tt = t_(d); e = np.minimum(1, np.minimum(tt / 1.5, (d - tt) / 1.5))
    return norm(hpf(nz(d), 2500) * .6 + bpf(nz(d), 500, 2000) * .4) * e * v
def snip(v=1):
    d = .14; x = sines([3200, 5400, 7600], d, [.012, .008, .006], [1, .7, .4]); x[:int(.004 * SR)] += hpf(nz(.004), 2000) * 1.5
    y = np.zeros(int(.2 * SR)); y[:len(x)] += x; k = int(.05 * SR); y[k:k + len(x)] += x * .6
    return norm(y) * v
def bell(v=1): return norm(sines([523, 1310, 2140, 2990], 4.5, [1.6, .9, .5, .3], [1, .5, .3, .15])) * v
LIB = {'seal': lambda e: seal(e.get('v', 1)), 'baren': lambda e: baren(e.get('d', .36), .8), 'block': lambda e: block(.6),
       'scroll': lambda e: scroll(e.get('d', 1.15), .55), 'bead': lambda e: bead(e.get('v', .6) * .7), 'tick': lambda e: tick(e.get('v', .4)),
       'flap': lambda e: flap(e.get('d', 2.4), .45), 'brush': lambda e: brush(e.get('d', 2.6), .9), 'vanish': lambda e: vanish(.5),
       'rain': lambda e: rain(e.get('d', 6), .35), 'bell': lambda e: bell(e.get('v', 1) * .9), 'snip': lambda e: snip(e.get('v', .8))}
GAINF = {'seal': .9, 'baren': .5, 'block': .55, 'scroll': .45, 'bead': .55, 'tick': .35, 'flap': .5, 'brush': .7, 'vanish': .5, 'rain': .35, 'bell': .8, 'snip': .7}
for e in EV:
    if e['type'] in LIB:
        x = LIB[e['type']](e).astype(np.float32)
        add(fol, x, e['t'], GAINF[e['type']], (rng.random() - .5) * .4)
# room tone: a faint paper-and-wood room under everything
room = (lpf(nz(DUR), 400) * .5 + bpf(nz(DUR), 2000, 6000) * .08).astype(np.float32)
room = room[:N] / (np.abs(room).max() + 1e-9) * .03
fol[:, 0] += room; fol[:, 1] += room

# ================= VOICE =================
vo = np.zeros(N, np.float32)
for t0, vid in VOS:
    y, sr = sf.read(os.path.join(HERE, 'voices_carla', vid + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    if sr != SR:
        from scipy.signal import resample_poly
        y = resample_poly(y, SR, sr).astype(np.float32)
    i0 = int(t0 * SR); vo[i0:i0 + len(y)] += y[:max(0, N - i0)]
vo = compress(vo, thr=.18, ratio=3.0).astype(np.float32)
vo = vo / (np.abs(vo).max() + 1e-9) * .8

# ================= MIX =================
# duck music and foley under the voice (≈ −9 dB), smooth
act = uniform_filter1d((np.abs(vo) > .02).astype(np.float32), int(.25 * SR))
act = np.clip(uniform_filter1d(act, int(.3 * SR)) * 3, 0, 1)
duck = 1 - .65 * act
rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)) if np.any(np.abs(x) > 1e-4) else 1
music = music / (rms(music) + 1e-9) * rms(vo) * .32
fol = fol / (rms(fol) + 1e-9) * rms(vo) * .3
mix = music * duck[:, None] + fol * (1 - .3 * act)[:, None] + vo[:, None] * np.array([1, 1], np.float32)
# the silence before the peak: everything out, except a breath of room tone
a0, a1, f = int(MA0 * SR), int(MA1 * SR), int(.08 * SR)
mix[a0:a0 + f] *= np.linspace(1, 0, f)[:, None]; mix[a0 + f:a1] = 0
mix[a0 + f:a1, 0] += room[a0 + f:a1] * .6; mix[a0 + f:a1, 1] += room[a0 + f:a1] * .6
mix = limit(mix / (np.abs(mix).max() + 1e-9) * .95, .95) if 'limit' in dir() else mix / (np.abs(mix).max() + 1e-9) * .95
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
print('mix', round(len(mix) / SR, 2), 's')
