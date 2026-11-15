"""Toy checks for PRF v6 §2.11 (numpy only). Not a test of the PRF.
1. Kramers escape time for dx = -k x(x^2-1) dt + sqrt(2D) dW, vs pi*sqrt(2)/k * exp(k/(4D)).
2. Gap test: 64 retained signs held through a silence, v5 dynamics (linear pull to reference)
   vs v6 dynamics (double well + weak pull), same noise.
"""
import numpy as np
rng = np.random.default_rng(0)
dt = 0.01

def escape_time(k, D, n=400, tmax=20000.0):
    x = np.ones(n); t = np.zeros(n); alive = np.ones(n, bool); s = 0.0
    while alive.any() and s < tmax:
        m = alive.sum()
        x[alive] += -k * x[alive] * (x[alive]**2 - 1) * dt + np.sqrt(2 * D * dt) * rng.standard_normal(m)
        s += dt
        done = alive & (x < -0.5)          # committed to the other well
        t[done] = s; alive &= ~done
    return t[~alive].mean() if (~alive).any() else np.nan, (~alive).mean()

print("1. Kramers check (k=1)")
for D in (0.10, 0.08, 0.06):
    sim, frac = escape_time(1.0, D)
    pred = np.pi * np.sqrt(2) / 1.0 * np.exp(1.0 / (4 * D))
    print(f"   D={D:.2f}  simulated {sim:7.1f} (escaped {frac:.0%})   formula {pred:7.1f}")

def gap(v6, T, d=64, k=1.0, pi_r=0.05, lam=0.5, D=0.02, seeds=8):
    acc = []
    for s in range(seeds):
        r = np.random.default_rng(s)
        target = r.choice([-1.0, 1.0], d); x = target.copy(); h = np.zeros(d)
        for _ in range(int(T / dt)):
            drift = (-k * x * (x**2 - 1) - pi_r * (x - h)) if v6 else (-lam * (x - h))
            x += drift * dt + np.sqrt(2 * D * dt) * r.standard_normal(d)
        acc.append(np.mean(np.sign(x) == target))
    return np.mean(acc)

print("2. Gap test: share of 64 retained signs still correct after a silence of length T (chance 0.50)")
print("   T        v5 linear pull   v6 double well")
for T in (1, 5, 20, 100, 400):
    print(f"   {T:<8} {gap(False, T):.2f}             {gap(True, T):.2f}")
