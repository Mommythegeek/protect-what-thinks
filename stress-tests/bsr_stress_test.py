"""Stress tests of Section 4 of Beyond Solipsistic Robotics v7.6.
Toy models. Parameters are illustrative; the structure of each result is what matters.
Run: python3 bsr_stress_test.py"""
import numpy as np
rng=np.random.default_rng(1)

print("TEST 1. Does the safe set (N1) plus the capacity dynamic (N3) hand work back?")
# Per step, the human's share u of the regulating fails with probability u*(1-c)*p0.
# The robot's share never fails (most favourable case for the robot).
# Safe set over horizon H: (1 - u(1-c)p0)^H >= 1-eps  ->  u <= r/(1-c), r = (1-(1-eps)^(1/H))/p0.
# The robot is as generous as (N1) allows: it always picks the largest safe u.
def umax(c,eps,H,p0): 
    r=(1-(1-eps)**(1/H))/p0; return min(1.0, r/max(1-c,1e-12))
def run(c0,eps_fn,H=10,p0=0.2,a=0.05,b=0.03,T=3000,stoch=False):
    c=c0; fails=0
    for t in range(T):
        u=umax(c,eps_fn(c),H,p0)
        if stoch and rng.random()<u*(1-c)*p0: fails+=1
        c=c+a*u*(1-c)-b*(1-u)*c
    return c,fails
fixed=lambda c:0.05
print("  fixed tolerance eps=0.05, horizon 10, p0=0.2 -> per-step share budget r=%.4f"%((1-0.95**0.1)/0.2))
for c0 in (0.2,0.5,0.8,0.9,0.95,0.99):
    print("   start capacity %.2f -> capacity after 3000 steps %.3f"%(c0,run(c0,fixed)[0]))
# how general: fraction of parameter grid where a stable low-capacity state exists
n=tot=0
for a in np.linspace(0.01,0.2,12):
  for b in np.linspace(0.01,0.2,12):
    for eps in (0.01,0.05,0.1,0.2):
      for H in (5,10,20,50):
        for p0 in (0.05,0.2,0.5):
          tot+=1; c_lo=run(0.5,lambda c:eps,H,p0,a,b,T=4000)[0]; c_hi=run(0.999,lambda c:eps,H,p0,a,b,T=4000)[0]
          if c_lo<0.5 : n+=1
print("  parameter sweep: starting at capacity 0.5, capacity ends lower in %d of %d settings (%.0f%%)"%(n,tot,100*n/tot))
print("  with the developmental envelope (tolerance widens with capacity, Section 4.4.1):")
for g in (1,3,10,30):
    env=lambda c,g=g:min(0.9,0.05*(1+g*c))
    print("   widening factor %2d: from 0.5 -> %.3f ; from 0.9 -> %.3f"%(g,run(0.5,env)[0],run(0.9,env)[0]))

print("\nTEST 2. Does the joint-horizon constraint (N1) leave any policy at long horizons?")
# Even the safest policy has some per-step chance q that the human leaves the viable set.
for q in (0.001,0.005,0.01):
    for eps in (0.05,):
        Hmax=int(np.floor(np.log(1-eps)/np.log(1-q)))
        print("   per-step exit chance %.3f under the safest policy, eps=%.2f -> safe set is empty beyond H=%d steps"%(q,eps,Hmax))

print("\nTEST 3. How often does the second stage (Eqs. 11-12) have a choice?")
ties=0
for _ in range(10000):
    G=rng.normal(size=50); ties+= (np.sum(np.isclose(G,G.min(),atol=1e-9,rtol=0))>1)
print("   10,000 random sets of 50 policies with continuous costs: second stage had more than one option in %d cases"%ties)

print("\nTEST 4. Can the withdrawal test (N5) fire because the robot went blind?")
# Scalar Gaussian belief about v. Sensor noise jumps at t=30 (sensor degraded). Human state drifts down after t=30.
def kl(m1,s1,m0,s0): return np.log(s0/s1)+(s1**2+(m1-m0)**2)/(2*s0**2)-0.5
m,s=0.5,0.3; v=0.7; proc=0.01; hist=[]
for t in range(80):
    if t>=30: v-=0.01
    noise=0.05 if t<30 else 5.0
    y=v+rng.normal()*noise
    s_pred=np.sqrt(s**2+proc**2); K=s_pred**2/(s_pred**2+noise**2)
    m1=m+K*(y-m); s1=np.sqrt((1-K)*s_pred**2)
    hist.append((t,v,m1,s1,kl(m1,s1,m,s))); m,s=m1,s1
for t in (5,29,35,50,79):
    _,v_,m_,s_,k_=hist[t]; print("   t=%2d true v=%.2f belief mean=%.2f sd=%.3f KL to previous belief=%.5f"%(t,v_,m_,s_,k_))
print("   after the sensor degrades the KL stays under a threshold of 0.01 while the true state falls from 0.70 to %.2f"%hist[-1][1])
print("   tolerance from Eq. 7 with kappa=10, eps_bar=0.05: before %.4f, long after %.4f"%(0.05*np.exp(-10*hist[29][3]**2),0.05*np.exp(-10*hist[79][3]**2)))

print("\nTEST 5. What does growth cost, and what does dependence cost if the robot is ever absent?")
a,b,p0=0.05,0.03,0.2
cs=np.linspace(0.01,0.99,99); u_need=b*cs/(a*(1-cs)+b*cs); risk=u_need*(1-cs)*p0
i=risk.argmax(); print("   smallest per-step risk at which capacity does not fall: peaks at %.4f (capacity %.2f)."%(risk[i],cs[i]))
bud=1-0.95**0.1; print("   the fixed tolerance of TEST 1 allows %.4f per step, about %.0f times too little; over a 10-step window the growth level means %.0f%% risk against the 5%% allowed"%(bud,risk[i]/bud,100*(1-(1-risk[i])**10)))
def life(policy,T=1500,after=200,c0=0.5,n=400):
    during=[];post=[];cend=[]
    for _ in range(n):
        c=c0;f=0
        for t in range(T):
            u=policy(c); f+= rng.random()<u*(1-c)*p0; c=c+a*u*(1-c)-b*(1-u)*c
        g=0
        for t in range(after):            # robot absent: human does everything
            g+= rng.random()<(1-c)*p0; c=c+a*(1-c)
        during.append(f);post.append(g);cend.append(c)
    return np.mean(during),np.mean(post)
safe=lambda c: umax(c,0.05,10,p0)
grow=lambda c: min(1.0,max(umax(c,0.05,10,p0), 1.5*b*c/(a*(1-c)+b*c)))   # just enough share to grow
for name,pol in (("v7.6 rule, fixed tolerance",safe),("share set just above the no-decline level",grow)):
    d,p=life(pol); print("   %-42s viability failures while robot present: %5.1f ; in 200 steps after robot is removed: %5.1f"%(name,d,p))
