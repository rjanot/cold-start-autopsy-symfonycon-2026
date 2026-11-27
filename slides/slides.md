---
theme: bricks
title: 'From 14s to 1.8s: A Symfony Cold Start Autopsy'
author: Rémi JANOT
info: |
  SymfonyCon 2026 — Friday 27 November, 15:15–15:50.
transition: fade-black
lineNumbers: true
mdc: true
aspectRatio: 16/9
fonts:
  sans: Signika Negative
  serif: Signika Negative,Permanent Marker
  mono: Fira Code,Courier Prime
drawings:
  persist: false
layout: blank
class: cold-open
markers: false
---

<!--
[Black screen, while the room settles]

[Before the talk: **click once in the projected window, it enables the sounds**]
-->

---
layout: blank
class: cold-open
markers: false
clicks: 3
transition: fade-black
---

<ColdOpen />

<!--
_[Low voice, slow, in the dark.]_

It was a Tuesday. It was raining. It always rains on Tuesdays.

Another sleepless night had dragged me out of bed, before the sun bothered to show up.

My coffee was already cold.

[click] [🎵 typewriter]

Six a.m. The office is empty.
Somewhere, a partner's integration wakes up and sends its first request of the day.

[click] [🎵 typewriter, then the heart monitor]

POST /auth/login

Five seconds. Nothing

Ten seconds. Nothing

At fourteen seconds, the server finally answers. Two hundred, OK. But the client's timeout had already expired. Nobody was there to read it.

[click] The first request of the morning was found dead.
-->

---
layout: blank
class: morgue
markers: false
transition: fade-black
---

<div class="h-full flex flex-col items-center justify-center gap-12">

<ToeTag>
  <p class="handwritten text-lg" style="color: #7c2d12">Case #14000ms</p>
  <p class="font-bold" style="font-size: 3.4rem; color: #1c1917; margin-top: 0.6rem">From 14s to 1.8s</p>
  <p class="text-2xl" style="color: #292524; margin-top: 0.4rem">A Symfony Cold Start Autopsy</p>
  <p class="handwritten text-base" style="color: #57534e; margin-top: 1.4rem">Rémi JANOT — SymfonyCon 2026</p>
</ToeTag>

<div class="flex gap-8 text-lg" style="color: #9ca3af">
  <span v-click>no exception</span>
  <span v-click>no stack trace</span>
  <span v-click>nothing in Sentry</span>
  <span v-click style="color: #22c55e">200 OK everywhere</span>
</div>

</div>

<!--
_[Let the title sit for a second.]_

[click] No exception.
[click] No stack trace.
[click] Nothing in Sentry.
[click] Every single log says two hundred, OK.

That's the kind of case I like.

Good afternoon, SymfonyCon.

Yes, that was a film noir. For the next thirty minutes, I'm taking you into a crime film: five acts, one body, one coroner.
At some point, you'll be called as witnesses.

The victim is real. The numbers are real. Only the rain was fake
-->

---
layout: blank
class: film
markers: false
transition: fade-black
---

<div class="h-full flex items-center">

<CoronerBadge name="Rémi JANOT">
<ul>
  <li><strong>Badge</strong> <span>#10100 <span class="flag-fr" role="img" aria-label="France" /> <span class="dim">— my zip code. It <em>is</em> binary.</span></span></li>
  <li><strong>Rank</strong> <span>Co-founder &amp; CTO @ Vasco</span></li>
  <li><strong>On the force</strong> <span>since PHP 3 · Symfony since 2011</span></li>
  <li><strong>Known as</strong> <span>the Eye of Sauron <span class="dim">— in code review</span></span></li>
  <li><strong>Criminal record</strong> <span aria-label="redacted"><span class="redacted" style="width: 12rem">youtu.be/dQw4w9WgXcQ</span></span></li>
  <li><strong>Known weakness</strong> <span>candies</span></li>
</ul>
</CoronerBadge>

</div>

<!--
_[🧤 put on the lab coat]_

Before we do the autopsy: my badge.

I am Rémi JANOT, Co-founder and CTO at [Vasco dot fund](https://www.vasco.fund), a french fintech.

On the force since PHP three, and the preview release of Symfony two

My Criminal record was redacted by the legal department I'am sorry.

[ ⏸️ ]
-->

---
layout: blank
class: film
protocol: 0
transition: cut
---

<span class="case-file__stamp">Case file — cold start</span>

<h2 class="case-file__title">The victim</h2>

<div class="case-file__card crime-scene mt-4">
  <div class="crime-scene__row"><h3>Stack</h3><p>Symfony 7.3 · PHP 8.4 <span class="dim">— at the time of death</span></p></div>
  <div class="crime-scene__row"><h3>API</h3><p>GraphQL, built with OverblogBundle / Webonyx library</p></div>
  <div class="crime-scene__row"><h3>Size</h3><p>~3,000 services<br>~930 generated GraphQL types<br>~290 Doctrine entities</p></div>
  <div class="crime-scene__row"><h3>Served by</h3><p>Apache + mod_php</p></div>
</div>

<!--
## Let me open the case file.

The victim: a Symfony 7.3 application, on PHP 8.4, versions in December twenty twenty-five

A GraphQL API, built with OverblogBundle / Webonyx library.

---

About three thousand services in the container

More than nine hundred generated GraphQL types

Nearly three hundred Doctrine entities.

---

Served by Apache, with mod_php. Nothing exotic. A fairly big, fairly ordinary Symfony application.
-->

---
layout: blank
class: film
protocol: 0
transition: cut
---

<span class="case-file__stamp">Case file — cold start</span>

<h2 class="case-file__title">The crime scene: why it dies every night</h2>

<div class="case-file__card crime-scene mt-4">
  <div class="crime-scene__row"><h3>GCP Cloud Run</h3><p>Almost no infrastructure to manage. No servers, no cluster.</p></div>
  <div class="crime-scene__row"><h3>Streamed image</h3><p>Each file of the image is fetched on its first read.</p></div>
  <div class="crime-scene__row"><h3>Scale to zero</h3><p>No request, (almost) no bill. Costs stay light.</p></div>
  <div class="crime-scene__row"><h3>Single tenant</h3><p>One isolated deployment per client. Every saving is multiplied.</p></div>
</div>

<p class="mt-3 text-[1.4rem]"><span class="case-file__price">The price:</span> every morning, the first request wakes up a cold instance.</p>

<!--
Now, the crime scene. And the first question you should ask: why does it die every night?

We run on Google Cloud Run. It is a Serverless  Container runtime. There is almost no infrastructure to manage. No servers, no cluster.
We give Google a container image, and Google runs it.

Each file is fetched from the image the first time someone reads it.
That is why a new instance starts in about a second. 

We scale to zero. When nobody calls the application, no instance runs, and we pay
almost nothing. More, I should say, we pay also Google NOT to run it !

And we are single tenant. Every client gets its own, isolated deployment.
Scale to zero is what makes that affordable.

The price of that are cold starts
-->

---
layout: blank
class: film
protocol: 0
transition: fade-black
---

<span class="case-file__stamp">Case file — cold start</span>

<h2 class="case-file__title">Not on Cloud Run? Same body.</h2>

<div class="case-file__card crime-scene crime-scene--wide-labels mt-4">
  <div class="crime-scene__row"><h3>Every deploy</h3><p>New release, new code: PHP meets it for the first time.</p></div>
  <div class="crime-scene__row"><h3>Every restart</h3><p>FPM or Apache reload, an OOM kill, a crash.</p></div>
  <div class="crime-scene__row"><h3>Every new instance</h3><p>Autoscaling, new Kubernetes pods, replaced spot VMs, Lambda.</p></div>
  <div class="crime-scene__row"><h3>Every CLI run</h3><p>Cron, <code>bin/console</code>, a restarted worker: every process starts from scratch.</p></div>
</div>

<p class="mt-3 text-[1.4rem]"><span class="case-file__price">The rule:</span> whenever PHP meets your code for the first time, the next request pays.</p>

<!--
A cold start is simply the first request after PHP starts from scratch. And it starts from scratch more often than you think.

- Every deploy
- Every restart of FPM or Apache reload
- Every new instance: autoscaling, new Kubernetes pods, a spot machine replaced, a Lambda.
- Or every C L I run

So the rule is simple: whenever PHP meets your code for the first time, the next request pays. Pays for what, exactly? That's the autopsy.
-->

---
layout: blank
markers: false
transition: fade-black
---

<ActCard act="I" title="Cause of death" />

<!--
# Act one. Cause of death.

_[🧤 put on the gloves — snap]_

Let's open it.
-->

---
layout: blank
class: film
act: I
scene: 1
slug: DEVELOPER LAPTOP
protocol: 0
transition: cut
---

<div class="h-full flex flex-col items-center justify-center gap-4 pb-12">

<div class="scene-line text-3xl" style="color: #fafaf9">Locally, the body is fine.</div>

<LocalProfilerMock />

</div>

<Slugline />

<!--
The first thing anyone does with a slow Symfony request is open the profiler.
So we did, on a laptop, in the dev environment.

Locally, the body is fine. Every panel is green. Nothing unusual.
-->

---
layout: blank
class: film
act: I
scene: 2
slug: PRODUCTION LOGS — 06:00
clicks: 3
markers: false
transition: cut
---

<Camera
  :set-width="3600"
  :set-height="1400"
  :shots="[
    { x: 1800, y: 760, zoom: 0.26, duration: 1.2 },
    { x: 1550, y: 900, zoom: 0.46, duration: 2.6 },
    { x: 1726, y: 1200, zoom: 0.95, rotate: -1, duration: 1.4 },
    { x: 1800, y: 760, zoom: 0.26, duration: 1.8 },
  ]"
>
  <template #default="{ clicks }">
    <RequestTimelineSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
So we went where the body actually died: the production logs of that first request,
from the moment it hit the front controller to the moment the response left.

Fourteen seconds in total. And one segment eats almost all of it.
It is not the database. It is not the controller. 

[click] It is the listener that matches the route.

[click] Ten point eight seconds. Before the controller even exists.

[click] Three quarters of the first request, spent deciding where to go.
-->

---
layout: blank
class: film
act: I
scene: 3
slug: VENDOR DIRECTORY
clicks: 4
markers: false
transition: cut
---

<Camera
  :set-width="5950"
  :set-height="1650"
  :shots="[
    { x: 2975, y: 1350, zoom: 0.165, duration: 1.2 },
    { x: 1025, y: 770, zoom: 0.55, rotate: 2, duration: 2 },
    { x: 2900, y: 780, zoom: 0.54, rotate: -1.5, duration: 2.2 },
    { x: 4850, y: 780, zoom: 0.51, rotate: 1, duration: 2.2 },
    { x: 2975, y: 1450, zoom: 0.165, duration: 1.8 },
  ]"
>
  <template #default="{ clicks }">
    <WarmupExhibitsSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
Building the router cache is the job of a cache warmer. So why wasn't it warm?
Three exhibits, all from Symfony 7.3.0 sources, the version we were running.

[click] Exhibit A: the cache:warmup command. It enables the optional warmers, good.
But look at the last line: it calls warmUp with the cache directory. Only the cache directory.

[click] Exhibit B: the router cache warmer. First thing it does: no build directory? Return. Nothing.
It is an optional warmer, and it was waiting for a directory it never received.

[click] Exhibit C: the kernel. The kernel does pass the build directory.
But it only enables the optional warmers when the build directory differs from the cache directory.
By default, they are the same directory.

[click] So the warmer was there. It just never got the directory it was waiting for.
Every container started without a router cache, and the first request paid for it.
-->

---
layout: blank
class: film
act: I
scene: 4
slug: DOCKERFILE
clicks: 3
transition: cut
---

<div class="h-full flex flex-col justify-center gap-5 px-14">

```dockerfile {all|3-4|6-8|all}{lines:false}
FROM ${PROD_BASE_IMAGE} AS backend_builder
# …
ENV APP_BUILD_DIR=$MOUNT_DIR/backend/var/build
RUN cd $MOUNT_DIR/backend && php bin/console cache:warmup --env=prod --no-debug

FROM ${PROD_BASE_IMAGE} AS prod
# APP_BUILD_DIR must match the build stage so Symfony finds the pre-compiled cache
ENV APP_BUILD_DIR=$MOUNT_DIR/backend/var/build
```

<div v-click="3" class="scene-line text-4xl">RouterListener · <span style="color: #fca5a5">10,791 ms</span> → <span style="color: #86efac">13 ms</span></div>

<div v-click="3">
  <div class="report-strip">
    <span class="report-strip__label">Cause of death</span>
    <span class="report-strip__value">router cache compiled on the first request</span>
  </div>
</div>

</div>

<Slugline />

<!--
So, give Symfony a build directory that is not the cache directory,
and the kernel switches the optional warmers on, the router warmer included.

[click] In the build stage, we set APP_BUILD_DIR and run cache:warmup. The router cache is now in the image.

[click] And in the final stage, the same variable, so that Symfony looks for the cache where we built it.

[click] The RouterListener went from more than ten seconds to thirteen **milli**seconds.
-->

---
layout: blank
class: film
act: I
scene: 5
transition: cut
markers: false
---

<WitnessStand>
  <template #exhibit>
    <div style="font-family: 'Fira Code', ui-monospace, monospace; font-size: 6.5rem; font-weight: 700; line-height: 1; color: #fafaf9"><VersionRoulette /></div>
  </template>
  <template #question>Which patch version of Symfony is running in production?</template>
  <template #oath>Raise your right hand. Without looking.</template>
</WitnessStand>

<!--
Quick question before we go on.

_[SHOW OF HANDS]_ Raise your right hand… Do you swear you know the exact patch version of Symfony running in production right now?

_[Let the room react]_
-->

---
layout: blank
class: film
act: I
scene: 6
slug:
  - GITHUB — 2025
  - GITHUB — FEBRUARY 2025
  - GITHUB — AUGUST 2025
  - GITHUB — AUGUST 2025
  - GITHUB — DECEMBER 2025
  - GITHUB — 2025
clicks: 5
markers: false
transition: cut
---

<Camera
  :set-width="4900"
  :set-height="1800"
  :shots="[
    { x: 2450, y: 780, zoom: 0.2, duration: 1.2 },
    { x: 593, y: 580, zoom: 0.62, duration: 1.8 },
    { x: 2761, y: 1150, zoom: 0.62, duration: 2.4 },
    { x: 2446, y: 505, zoom: 0.62, duration: 1.6 },
    { x: 4266, y: 1170, zoom: 0.62, duration: 2.4 },
    { x: 2450, y: 880, zoom: 0.2, duration: 1.8 },
  ]"
>
  <template #default="{ clicks }">
    <UpstreamFixTimelineSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
Then we did what we should have done first. We searched the issue tracker.

[click] February twenty twenty-five. Someone called kieljohn opens an issue on Symfony:
the router cache does not warm with cache:warmup, but it does with cache:clear. Our exact bug.

[click] August twenty twenty-five. MatTheCat merges the fix: cache:warmup now warms up the read-only caches,
the router included.

[click] Twelve days later, it ships in Symfony 7.3.3.

[click] December twenty twenty-five. Our investigation. In production, we are still on Symfony 7.3.0.

[click] The cure had been on the shelf for four months.

A minute ago, I asked who knew their exact patch version. Very few hands.
Ours would have stayed down too: we were four months behind a fix for the very bug we were hunting.
-->

---
layout: blank
class: film
act: I
scene: 7
slug: GITHUB
protocol: 1
protocolClick: 1
transition: cut
---

<div class="h-full flex flex-col items-center justify-center gap-10">

<div class="text-center">
  <div class="scene-line text-5xl" style="color: #fafaf9">Thank you, kieljohn and MatTheCat.</div>
  <div class="mt-4 text-lg" style="color: #a8a29e">symfony/symfony#59703 — reported · symfony/symfony#61115 — fixed</div>
</div>

<div v-click class="protocol-step">
  <EvidenceMarker class="protocol-step__marker" :number="1" size="7rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Read the case file before the body.</div>
    <div class="text-base" style="color: #d6d3d1">Installed version, changelog, issue tracker — then the source.</div>
  </div>
</div>

</div>

<Slugline />

<!--
So, first: thank you, kieljohn, for reporting it, and thank you, MatTheCat, for fixing it.

[click] [ 🎵 ]

By the end of this talk, I owe you an autopsy report. _[Point at the six markers, bottom right.]_
And down here, six evidence markers: each time the investigation teaches us a step of the method, one lights up.

And here is the first step of our protocol.
Before you read the framework source, check which version you are running,
read the changelog, search the issue tracker. Then, and only then, open the source.
We did it in the wrong order.
-->

---
layout: blank
class: film
act: I
scene: 8
slug: PRODUCTION — RELEASE DAY
clicks: 1
transition: cut
---

<div class="h-full flex flex-col justify-center gap-6 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">We shipped it.</div>

<div class="release-note">
  <div class="release-note__line"><span class="release-note__mark">✓</span> Router cache warmed at build time <span class="release-note__gain">−10.8 s</span></div>
  <div class="release-note__line release-note__line--quiet"><span class="release-note__mark">+</span> GraphQL Insights: usage logs</div>
</div>

<div v-click="1" class="flex flex-col gap-1">
  <div class="scene-line text-3xl" style="color: #fafaf9">First request in production: 14 s → <span style="color: #fca5a5">11.42 s</span>.</div>
  <div class="text-lg" style="color: #a8a29e">−10.8 s on the router. Only −2.6 s on the clock.</div>
</div>

</div>

<Slugline />

<!--
So, we shipped the fix.

And in production, it arrived together with an homemade observability tool
logging usage on Graphql request. More visibility. What could go wrong?

[click] The first request in production went from fourteen seconds… to eleven point four...

Wait...

We removed ten seconds, and the clock only lost two and a half. The arithmetic doesn't work.
-->

---
layout: blank
class: blackout
markers: false
transition: fade-black
---

<div class="h-full flex flex-col items-center justify-center gap-3">
  <div class="intertitle">Big gains don't need statistics.</div>
  <div class="intertitle" style="animation-delay: 1.2s">Small ones do.</div>
  <div class="intertitle" style="animation-delay: 2.4s">And at a few percent, the stopwatch lies.</div>
</div>

<!--
Ten seconds: you don't need statistics to see that.

But our patient was still cold. Some of what we found next was big again.

Most of it was a few percent at a time — and at a few percent, the stopwatch starts lying to you.
-->

---
layout: blank
class: film
act: I
scene: 9
slug: LAB — BUILDING THE INSTRUMENTS
clicks: 2
transition: cut
---

<div class="h-full flex flex-col justify-start gap-3 px-14 pt-12">

<div class="scene-line text-3xl" style="color: #fafaf9">If the profiler can't see it, build something that can.</div>

<TimelineRecord :focus="$clicks === 1 ? 'marks' : $clicks >= 2 ? 'counters' : 'none'" />

<div class="instrument-legend">
  <div v-click="1"><code>marks</code> — a timeline: where the time goes</div>
  <div v-click="2"><code>compiled</code> · <code>cacheGeneration</code> · <code>runtime</code> — counters: the work, not the time</div>
</div>

</div>

<Slugline />

<!--
So we built our own instrument. One structured log record per request, written to stdout,
so Cloud Logging indexes it like everything else.

[click] First, marks: an ordered timeline of the request. Front controller, first request listener,
last request listener, controller, and so on. Each one with the time since the previous mark.

[click] Then, counters. 
- how many files the request had to compile, per subsystem.
- the caches written during the request.
- runtime: the age of the process, OPcache hits,
the number of included files. 

Counters measure the work, not the time it took.
-->

---
layout: blank
markers: false
transition: fade-black
---

<ActCard act="II" title="The lying stopwatch" />

<!--
# Act two. The lying stopwatch.

The router was fixed, and yet, months later, the first request of the morning was still slow.
We had an instrument now. And our measurements still lied to us — in four different ways.
-->

---
layout: blank
class: film
act: II
scene: 1
slug: THREE CLOCKS — ONE COLD START
protocol: 2
protocolClick: 1
clicks: 1
transition: cut
---

<div class="h-full flex flex-col justify-center gap-6 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">One cold start. Three clocks.</div>

<div class="clock-bars">
  <div class="clock-bar"><div class="clock-bar__name">Client</div><div class="clock-bar__track"><div class="clock-bar__fill" style="width: 100%; background: #7f1d1d">11.42 s</div></div></div>
  <div class="clock-bar"><div class="clock-bar__name">Cloud Run request log</div><div class="clock-bar__track"><div class="clock-bar__fill" style="width: 42.1%">4.81 s</div></div></div>
  <div class="clock-bar"><div class="clock-bar__name">PHP, measured inside</div><div class="clock-bar__track"><div class="clock-bar__fill" style="width: 38.4%">4.38 s</div></div></div>
</div>

<div v-click="1" class="protocol-step">
  <EvidenceMarker class="protocol-step__marker" :number="2" size="7rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Establish the time of death — on three layers.</div>
    <div class="text-base" style="color: #d6d3d1">Client, platform, application. They never agree.</div>
  </div>
</div>

</div>

<Slugline />

<!--
## The first lie: which clock? 

Here is one cold start, measured with three clocks at once.
The client waited eleven point four seconds. Cloud Run's request log says four point eight.
PHP, measured inside, says four point four.

[click] [ 🎵 ]

Second step of the protocol. Establish the time of death on multiple layers, and the one you are not measuring is undoubtly the one that hurts the most
-->

---
layout: blank
class: film
act: II
scene: 2
slug: SAME INSTANCE — 11 SECONDS LATER
clicks: 3
protocol: 3
protocolClick: 3
transition: cut
---

<div class="h-full flex flex-col justify-center gap-4 px-16 pb-16">

<div class="scene-line text-2xl" style="color: #fafaf9">Same instance. Same request. Eleven seconds apart.</div>

<div class="flex items-center gap-8">
  <div class="ratio-bars flex-1">
    <div class="ratio-bar">
      <div class="ratio-bar__name">first request on the instance</div>
      <div class="ratio-bar__track"><div class="ratio-bar__fill ratio-bar__fill--cold" style="width: 100%" /></div>
    </div>
    <div v-click="1" class="ratio-bar">
      <div class="ratio-bar__name">the same request, 11 s later</div>
      <div class="ratio-bar__track"><div class="ratio-bar__fill ratio-bar__fill--warm" style="width: 3.99%" /></div>
    </div>
  </div>
  <div v-click="1" class="ratio-big">×25</div>
</div>

<div class="same-instance">
  <div class="same-instance__head" />
  <div class="same-instance__head">1st request</div>
  <div v-click="1" class="same-instance__head">11 s later</div>

  <div class="same-instance__label">instance alive for</div>
  <div class="same-instance__value">149 s</div>
  <div v-click="1" class="same-instance__value">160 s</div>

  <div class="same-instance__label">PHP files included</div>
  <div class="same-instance__value">2,676</div>
  <div v-click="1" class="same-instance__value">2,648</div>

  <div class="same-instance__label same-instance__label--key">compiled by OPcache</div>
  <div class="same-instance__value same-instance__value--key">nearly all</div>
  <div v-click="1" class="same-instance__value same-instance__value--key">65</div>
</div>

<div v-click="2" class="same-instance__phases">
  faster the second time: kernel boot <strong>×317</strong> · firewall <strong>×17</strong> · until the first SQL query <strong>×40</strong>
</div>

<div v-click="3" class="protocol-step protocol-step--compact">
  <EvidenceMarker class="protocol-step__marker" :number="3" size="5rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Take its temperature. Alive is not warm.</div>
    <div class="text-base" style="color: #d6d3d1">Check OPcache's hits and misses before you trust an instance.</div>
  </div>
</div>

</div>

<Slugline />

<!--
## The second lie: the instance.

Same instance. Same request. Eleven seconds apart.

The first request on this instance : it had been alive for a hundred and forty-nine seconds, but no calls until then. It included more than two thousand PHP files, and OPcache compiled nearly all of them.

[click] Eleven seconds later, the same request on the same instance: twenty-five times faster.
Same code, nearly the same count of PHP files. But OPcache compiled only sixty-five.

That is the whole cold start: not running PHP, but compiling it.

[click] And every phase pays: 
- the kernel boot is three hundred times faster the second time,
- the firewall seventeen times,
- the time until the first SQL query forty times.

[click] [ 🎵 ]

Third step of the protocol: Alive is not warm. The instance was alive for one hundred fifty second but it was still cold.

It is warm when opcache has the bytecode in memory
-->

---
layout: blank
class: film
act: II
scene: 3
slug: PRODUCTION LOGS — THE MARKER
protocol: 4
protocolClick: 2
clicks: 2
transition: cut
---

<div class="h-full flex flex-col justify-center gap-6 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">The lying marker</div>

<div class="marker-bars">
  <div class="marker-bar">
    <div class="marker-bar__name"><code>doctrine.connect</code></div>
    <div class="marker-bar__track">
      <div class="marker-bar__fill marker-bar__fill--suspect" style="width: 94.2%">
        {{ $clicks >= 1 ? '.start · +3,993 ms' : '+3,993 ms — “the database is slow”' }}
      </div>
      <div class="marker-bar__fill marker-bar__fill--db" :class="{ 'marker-bar__fill--hidden': $clicks < 1 }" style="width: 5.8%" />
      <div class="marker-bar__tick" style="left: 94.2%"><span>doctrine.connect fired here</span></div>
    </div>
  </div>
  <div class="marker-bar__legend" :class="{ 'marker-bar__legend--hidden': $clicks < 1 }">
    <div><span class="marker-bar__swatch marker-bar__swatch--start" /> <code>.start</code> +3,993 ms — before the database: compiling classes</div>
    <div><span class="marker-bar__swatch" /> <code>.end</code> +244 ms — the connection itself</div>
    <div>The marker was off by <strong>×16</strong>.</div>
  </div>
</div>

<div v-click="2" class="protocol-step">
  <EvidenceMarker class="protocol-step__marker" :number="4" size="7rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Dissect every marker.</div>
    <div class="text-base" style="color: #d6d3d1">A marker says where you stopped the clock, not what happened in between.</div>
  </div>
</div>

</div>

<Slugline />

<!--
## The third lie: the marker.

One marker, doctrine.connect,
and the biggest gap of the request lands right on it: four seconds.
Everybody in this room would say it: the database is slow.

[click] So we split that marker in two, start and end.
The marker fired when the connection started. Everything before it was compiling classes.
The connection itself came after: two hundred and fifty milliseconds.

[click] [ 🎵 ]

Fourth step of the protocol: dissect every marker. A marker tells you where you stopped the clock,
not what happened in between.
-->

---
layout: blank
class: film
act: II
scene: 4
slug: THE ENVIRONMENT — THREE NIGHTS
clicks: 2
transition: cut
---

<div class="h-full flex flex-col justify-center gap-3 px-14 pt-6">

<div class="scene-line text-2xl" style="color: #fafaf9">The environment: Same code. Different numbers.</div>

<div class="env-table" :class="{ 'env-table--corrected': $clicks >= 2 }">
  <div class="env-table__title">≈ 233 cold starts per version · 3 nights · means</div>
  <div class="env-table__grid">
    <div class="env-table__head" />
    <div class="env-table__head">files</div>
    <div class="env-table__head">kernel boot</div>
    <div class="env-table__head">request</div>
    <div class="env-table__head env-table__late">boot-corrected</div>
    <div class="env-table__step">before</div>
    <div class="env-table__cell">1,234</div>
    <div class="env-table__cell env-table__cell--dim">979 ms</div>
    <div class="env-table__cell">3,048 ms</div>
    <div class="env-table__cell env-table__cell--dim env-table__late">—</div>
    <div v-click="1" class="env-table__step">neutral change · 0 files</div>
    <div v-click="1" class="env-table__cell">1,234</div>
    <div v-click="1" class="env-table__cell env-table__cell--boot">893 ms · −9 %</div>
    <div v-click="1" class="env-table__cell env-table__cell--raw">2,715 ms · −11 %</div>
    <div class="env-table__cell env-table__cell--floor env-table__late">−5 %</div>
  </div>
</div>

<div v-click="2" class="text-base" style="color: #fde68a">Divide the rest of the request by the kernel boot: −5 % remains. That is the floor of the correction.</div>

<div v-click="2" class="font-mono text-sm" style="color: #d6d3d1">per cold start: (request − kernel boot) ÷ kernel boot<br>before 2.14 → neutral change 2.04: −5 %</div>

</div>

<Slugline />

<!--
## The fourth lie, and the biggest one: the environment.

Here is a neutral change that touched zero files.
We did the comparison properly: more than two hundred cold starts per version, over three nights. First, the version before.

[click] Then the neutral change. It came out eleven percent faster. "Statistically significant." But impossible for the code.
Look at the kernel boot: the change never touches it, and it is nine percent faster too.
Each version ran in its own environment, and each environment has its own speed.

[click] Our code doesn't change the kernel boot. So the boot tells us how fast the machine is.

We use it as a ruler: we compare each request to its own boot.

The neutral change is still five percent faster. Zero files changed, five percent: that's noise we can't remove.

So from now on, between two environments, anything under five percent means nothing.
-->

---
layout: blank
class: film
act: II
scene: 5
slug: LAB
clicks: 3
transition: cut
---

<div class="h-full flex flex-col justify-center gap-5 px-16">

<div class="scene-line text-2xl" style="color: #fafaf9">What the environment changes — and how we corrected for it</div>

<div class="grid grid-cols-2 gap-6">
  <div class="depends-card depends-card--yes">
    <div class="depends-card__title">Depends on the environment</div>
    <div>time compared across two environments:</div>
    <div class="depends-card__item">totals</div>
    <div class="depends-card__item">means and medians</div>
  </div>
  <div class="depends-card depends-card--no">
    <div class="depends-card__title">Does not</div>
    <div class="depends-card__item">file counts</div>
    <div class="depends-card__item">two requests on the same instance</div>
  </div>
</div>

<div class="correct-list">
  <div v-click="1"><span class="correct-list__n">1</span> Interleave both versions in one environment, many times: the machines still vary, but equally for both.</div>
  <div v-click="2"><span class="correct-list__n">2</span> Divide by the kernel boot: it only measures the environment.</div>
  <div v-click="3"><span class="correct-list__n">3</span> When you can't: count files. Fewer files compiled is time gained, on any machine.</div>
</div>

</div>

<Slugline />

<!--
So, what depends on the environment? 
- Time, as soon as you compare two versions that ran in two environments:
totals, means and medians.

What does not:
- file counts, and two requests on the same instance.

Three ways to correct, in order of preference :

[click] 
interleave both versions in one environment, many times.
Each sample still lands on whatever machine Cloud Run picks. But both versions get the same lottery,
so over enough samples, the machines weigh the same on both sides.

[click] divide the duration by the kernel boot duration

[click] when you can't do either, count files. Fewer files compiled is time gained, on any machine.
-->

---
layout: blank
class: film
act: II
scene: 6
slug: LAB
transition: cut
---

<div class="h-full flex flex-col justify-center gap-3 px-14">

<div class="scene-line text-3xl" style="color: #fafaf9">The instrument, one more time</div>

<TimelineRecord focus="cacheGeneration" />

</div>

<Slugline />

<!--
And then, the instrument finally told us the truth. Back to our record.

The field that taught us the most was an empty one. cacheGeneration: the caches written during the request.

Nothing was generated at runtime: the build had done its job.

So the cost was not generating caches. It was OPcache compiling files that were already on disk.
-->

---
layout: blank
class: film
act: II
scene: 7
markers: false
clicks: 1
transition: cut
---

<LineupVote :revealed="$clicks >= 1" />

<!--
Already on disk? On Cloud Run, not quite. Line-up time.

A fresh Cloud Run instance reads one PHP file for the first time. How long?
One hand per person.

- Suspect A: under a tenth of a millisecond. Hands up.
- Suspect B: between a tenth and one millisecond. Hands up.
- Suspect C: over one millisecond. Hands up.

_[Comment on the room in one sentence.]_

The whale, step forward.

[click] About one point seven milliseconds: on its first read, the file is fetched from the image.
On your laptop, you never think about it. A cold request reads about two thousand of them, one by one.
And that's only the fetch.
-->

---
layout: blank
class: film
act: II
scene: 8
slug: CLOUD RUN
protocol: 5
protocolClick: 1
clicks: 1
transition: cut
---

<div class="h-full flex flex-col justify-center gap-4 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">The bill for one file</div>

<div class="file-bill">
  <div class="file-bill__part">
    <div class="file-bill__value">~1.7 ms</div>
    <div class="file-bill__label">fetch: the file comes from the image on its first read</div>
  </div>
  <div class="file-bill__op">+</div>
  <div class="file-bill__part">
    <div class="file-bill__value">compile</div>
    <div class="file-bill__label">OPcache turns it into bytecode</div>
  </div>
  <div class="file-bill__op">=</div>
  <div class="file-bill__part file-bill__part--total">
    <div class="file-bill__value">~2.5–4 ms</div>
    <div class="file-bill__label">per file, on a fresh Cloud Run instance · <span class="estimate">estimate</span></div>
  </div>
</div>

<div class="text-lg" style="color: #e7e5e4">A file never included is never fetched, never compiled: <strong style="color: #86efac">a guaranteed gain</strong>. Its size is an estimate.</div>

<div v-click="1" class="protocol-step">
  <EvidenceMarker class="protocol-step__marker" :number="5" size="7rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Examine the body, not only the clock.</div>
    <div class="text-base" style="color: #d6d3d1">Count the files compiled and the services built. On a cold start, milliseconds are an instance lottery.</div>
  </div>
</div>

</div>

<Slugline />

<!--
So here is the bill for one file. First, fetch it from the image: the one point seven milliseconds you just voted on.
Then compile it. 

Altogether, on a fresh Cloud Run instance, about two and a half to four milliseconds per file.

That's our model. Everything that follows comes from it.

And it gives us something no environment can take away: a file that is never included is never fetched, and never compiled.

That gain is guaranteed. Only its size is an estimate.

[click] [ 🎵 ]

Fifth step: examine the body, not only the clock. Count the files compiled and the services built.
-->

---
layout: blank
markers: false
transition: fade-black
---

<ActCard act="III" title="Failed treatments" />

<!--
# Act three. Failed treatments.

We had the diagnosis: a cold instance spends its time compiling PHP files.
So the obvious cure: compile before the first request. We tried it twice — at startup, then at build time.
And this time, we knew how not to be fooled by the stopwatch.
-->

---
layout: blank
class: film
act: III
scene: 1
slug: OPERATING ROOM — PHP 8.4
transition: cut
clicks: 1
---

<div class="h-full flex flex-col gap-6">

<div class="flex flex-col items-start gap-4">
  <div class="case-file__stamp dose-tag">first dose · PHP 8.4</div>
  <div class="scene-line text-3xl" style="color: #fafaf9">Treatment #1: <code>opcache.preload</code></div>
</div>

<div class="flex-1 flex flex-col justify-center">
<v-switch>
  <template #0>
    <div class="flex gap-6">
      <div class="split-panel">
        <div class="split-panel__label">Inside · the app's stopwatch</div>
        <div class="split-panel__value" style="color: #86efac">497 ms</div>
        <div class="split-panel__note">PHP 8.4, preload on, measured by the application</div>
      </div>
      <div class="split-panel split-panel--hidden">
        <div class="split-panel__label">Outside · the HTTP response</div>
        <div class="split-panel__value">14,060 ms</div>
        <div class="split-panel__note">what the client actually waited</div>
      </div>
    </div>
  </template>
  <template #1>
    <div class="flex gap-6">
      <div class="split-panel">
        <div class="split-panel__label">Inside · the app's stopwatch</div>
        <div class="split-panel__value" style="color: #86efac">497 ms</div>
        <div class="split-panel__note">PHP 8.4, preload on, measured by the application</div>
      </div>
      <div class="split-panel">
        <div class="split-panel__label">Outside · the HTTP response</div>
        <div class="split-panel__value" style="color: #f87171">14,060 ms</div>
        <div class="split-panel__note">what the client actually waited</div>
      </div>
    </div>
  </template>
</v-switch>
</div>

</div>

<Slugline />

<!--
Treatment number one is the one everybody recommends: OPcache preload.
Compile the whole application once, when PHP starts, and every request finds it already in memory.

So we turned it on, on PHP 8.4, and looked at our own metric. Four hundred and ninety-seven milliseconds.
The patient looked great. From the inside.

[click] Then we looked from the outside — remember the three clocks. The real HTTP response: fourteen seconds.
Preload had not removed the cost. It had moved it before the first request, where the application measures nothing.
First dose.
-->

---
layout: blank
class: film
act: III
scene: 2
slug: OPERATING ROOM — PHP 8.5
clicks: 4
markers: false
transition: cut
---

<Camera
  :set-width="3600"
  :set-height="1700"
  :shots="[
    { x: 1800, y: 780, zoom: 0.24, duration: 1.2 },
    { x: 1180, y: 730, zoom: 0.48, duration: 2.4 },
    { x: 1380, y: 900, zoom: 0.35, duration: 2 },
    { x: 3070, y: 660, zoom: 0.56, duration: 2 },
    { x: 1800, y: 780, zoom: 0.24, duration: 1.8 },
  ]"
>
  <template #default="{ clicks }">
    <PreloadLogSet :clicks="clicks" />
  </template>
</Camera>

<div class="dose-banner" :class="{ 'dose-banner--hidden': $clicks > 0 && $clicks < 4 }">
  <span class="case-file__stamp dose-tag">second dose · PHP 8.5</span>
  <span class="scene-line">Treatment #1, again: <code>opcache.preload</code></span>
</div>

<Slugline />

<!--
PHP 8.5, months later. This time, the preload script measures itself.

[click] Last line: over seven thousand files, a hundred and fifty-one seconds. That is how long Apache compiled before it could answer anything.

[click] What does the user see? Another true cold start, with preload.
After one second, the startup probe is green — it only checks the port. So Cloud Run sends the request in.
But Apache is still compiling: the request waits in the queue, about forty-three seconds.
Then PHP handles it in one point three seconds.

[click] Forty-four and a half seconds for that user. Without preload: two point eight. In a proper A/B test.

[click] Second dose. Same drug. Same result.
-->

---
layout: blank
class: film
act: III
scene: 3
slug: OPERATING ROOM — LATER
transition: cut
---

<div class="h-full flex flex-col justify-center gap-5 px-14">

<div class="scene-line text-3xl" style="color: #fafaf9">An application that compiles too long doesn't get slow…</div>

<div v-click="1" class="terminal" style="white-space: normal; font-size: 0.82rem">
<div class="terminal__line--fatal">PHP Fatal error: Maximum execution time of 60 seconds exceeded<br>&nbsp;&nbsp;&nbsp;&nbsp;in var/build/prod/ContainerXa87Jmm/getDistributionPeriodicityDetailedTypeService.php</div>
<div v-click="2" class="terminal__line--fatal">[:emerg] AH00020: Configuration Failed, exiting</div>
<div v-click="3" class="terminal__line--fatal">Container called exit(1).</div>
</div>

<div v-click="4" class="text-lg" style="color: #d6d3d1">
  <span class="terminal__line--probe" style="font-family: 'Fira Code', ui-monospace, monospace">● TCP startup probe: green after 0.5–1.2 s</span> — traffic was already routed to it.
</div>

<div v-click="5" class="scene-line text-3xl" style="color: #fafaf9">… it gets unavailable.</div>

</div>

<Slugline />

<!--
And then it got worse. Three containers died during the measurement campaign.

[click] Preload runs while Apache is still configuring itself. It hit a sixty-second limit, in the middle of compiling the container.

[click] A fatal error at that moment fails Apache's configuration. Apache refuses to start.

[click] And the container exits.

[click] Meanwhile, our startup probe only checked the TCP port. It turned green after half a second to one second,
as soon as Apache bound the socket. So Cloud Run happily sent traffic to an instance that could not answer anything.

[click] An application that compiles too long doesn't get slow. It gets unavailable.
-->

---
layout: blank
class: film
act: III
scene: 4
slug: TOXICOLOGY LAB — DECEMBER 2025
clicks: 1
transition: cut
---

<div class="h-full flex flex-col items-center justify-center">

<div class="tox-report">
  <div class="tox-report__header"><span>Toxicology report</span><span>December 2025</span></div>
  <div class="tox-report__field"><strong>Sample:</strong> opcodes compiled at build time, shipped inside the image (PHP 8.4)</div>
  <div class="tox-report__field"><strong>Finding:</strong></div>
  <div v-click="1" class="tox-report__finding">PHP Fatal error: Dunglas\DoctrineJsonOdm\Serializer cannot use Sentry\Dsn - it is not a trait</div>
</div>

</div>

<Slugline />

<!--
Treatment number two: if compiling is the problem, compile at build time and ship the opcodes inside the image.

We tried it a first time in December twenty twenty-five. Here is what came back from the lab.

[click] [Let the room read it.]

A serializer, trying to use the Sentry DSN class as a trait. Two classes that have nothing to do with each other.

We shipped compiled opcodes. They came back… creative.

We abandoned it. Corrupted bytecode is not something you want to debug.
-->

---
layout: blank
class: film
act: III
scene: 5
slug: TOXICOLOGY LAB — PHP 8.5
clicks: 2
transition: cut
---

<div class="h-full flex flex-col justify-center gap-5 px-14">

<PhpIniFileCacheExcerpt :highlight="$clicks === 1 ? [1785, 1786] : []" />

<div v-click="2" class="scene-line text-3xl" style="color: #fafaf9">310 MB of opcodes for ~95 MB of sources.<br><span style="color: #a8a29e">More than three times the bytes.</span></div>

</div>

<Slugline />

<!--
Then PHP 8.5 shipped, with a new setting that reads like it was written for us.

[click] "It should improve performance for read-only containers, when the cache is pre-warmed and packaged alongside the application."

[click] So we compiled every file the application can include, at build time.
Twenty-one thousand files. Three hundred and ten megabytes of opcodes, for about ninety-five megabytes of sources.
More than three times the bytes
-->

---
layout: blank
class: film
act: III
scene: 6
slug: OPCACHE SOURCE CODE — NIGHT
clicks: 5
markers: false
transition: cut
---

<Camera
  :set-width="6150"
  :set-height="4000"
  :shots="[
    { x: 3075, y: 2040, zoom: 0.15, duration: 1.2 },
    { x: 1567, y: 830, zoom: 0.46, rotate: 1.5, duration: 2 },
    { x: 4582, y: 835, zoom: 0.55, rotate: -1.5, duration: 2.2 },
    { x: 1567, y: 1980, zoom: 0.42, rotate: 1, duration: 2.2 },
    { x: 4525, y: 2030, zoom: 0.4, rotate: -1, duration: 2.2 },
    { x: 4525, y: 2030, zoom: 0.4, rotate: -1, duration: 0.6 },
  ]"
>
  <template #default="{ clicks }">
    <FileCacheBugsSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
Before we could even measure it, the cache did nothing. Twice. And nothing told us.

[click] Bug one. OPcache refuses to cache a file modified less than two seconds ago: it is called file update protection.
The last files written by cache:warmup were the GraphQL types and the Doctrine proxies. Compiled, never stored.
And the build said: zero failed.

[click] Bug two. OPcache wrote its entries readable only by their owner. The owner was root, at build time.
Apache reads them as www-data. So opening every single entry failed.

[click] And this is what OPcache does when it cannot open an entry. Return null. Nothing else.
A failed read, a few lines below, logs a warning. A failed open does not.

[click] On a brand-new instance, memory is empty, so every file is either served by the file cache, or compiled.

This request includes about one thousand three hundred files.
First deploy: every single file was compiled. The cache was never read.

[click] After the two fixes: sixteen files compiled. Now the cache works, but is it faster?
-->

---
layout: blank
class: film
act: III
scene: 7
slug: LAB — ONE NIGHT OF MEASUREMENTS
transition: cut
clicks: 1
---

<div class="h-full flex flex-col justify-center gap-2 px-12 pb-12">

<div class="scene-line text-3xl" style="color: #fafaf9">Result: not faster. Probably slower.</div>
<RevisionDumbbell class="flex-none" />
<div v-click="1" class="hypothesis mt-2"><span class="hypothesis__tag">Hypothesis:</span>the image is streamed: fetching 310 MB of opcodes on first read costs more than fetching 95 MB of sources and compiling them. Not proven.</div>

<div v-click="1">
  <div class="report-strip">
    <span class="report-strip__label">Failed treatments</span>
    <span class="report-strip__value">preload, shipped opcodes</span>
  </div>
</div>

</div>

<Slugline />

<!--
So, with the cache working, a whole night of measurements. Same code, same configuration, with and without the file cache.
But each side ran in its own environment.

Seven tenths of a second to more than a second slower, in every case.
Not faster. Probably slower — but measured in two different environments, so I can't prove it.

[click] Our best guess: the streamed image. Three hundred and ten megabytes of opcodes to fetch on first read,
instead of ninety-five megabytes of sources.
-->

---
layout: blank
class: blackout
markers: false
transition: fade-black
---

<div class="h-full flex flex-col items-center justify-center gap-3">
  <div class="intertitle">The only file that costs nothing</div>
  <div class="intertitle" style="animation-delay: 1.2s">is the one you never include.</div>
</div>

<!--
Moving the compilation didn't help. The only file that costs nothing is the one you never include.
-->

---
layout: blank
markers: false
transition: fade-black
---

<ActCard act="IV" title="Under the microscope" />

<!--
# Act four. Under the microscope.
-->

---
layout: blank
class: film
act: IV
scene: 1
slug: OUR OWN CODE — 100 % OF REQUESTS
clicks: 3
markers: false
transition: cut
---

<Camera
  :set-width="4100"
  :set-height="1850"
  :shots="[
    { x: 2050, y: 1330, zoom: 0.17, duration: 1.2 },
    { x: 1185, y: 690, zoom: 0.42, duration: 2.2 },
    { x: 3170, y: 470, zoom: 0.52, duration: 1.8 },
    { x: 3170, y: 1080, zoom: 0.5, duration: 1.6 },
  ]"
>
  <template #default="{ clicks }">
    <TypeMapSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
Now the organs, one by one. Each one with the files it removed, and an estimation of the time that buys, from our model.
And the first one was ours. Remember the observability tool that reached production with the router fix?

[click] Our own GraphQL insights decorator. To time every resolver, it walked the whole schema. That single call makes webonyx build every type of the schema. Overblog had been careful
to load types lazily. We undid it.

[click] Exhibit E: and it was not sampled. A hundred percent, in production.

[click] We changed it to start from the query instead of the schema. Three hundred and twenty-four GraphQL type classes
compiled by that request became thirteen. Seven hundred and ten fewer files: about two to three seconds.
-->

---
layout: blank
class: film
act: IV
scene: 2
slug: VENDOR DIRECTORY — DEV DEPENDENCIES
clicks: 1
transition: cut
---

<div class="h-full flex items-center gap-12 px-16">

<div class="file-pile" aria-hidden="true">
  <div v-for="sheet in 14" :key="sheet" class="file-pile__sheet" :style="{ transform: `translate(${(sheet % 3) * 6 - 6}px, ${-sheet * 9}px) rotate(${((sheet * 37) % 9) - 4}deg)` }" />
</div>

<div class="flex flex-col gap-4 text-left">
  <div class="dev-dep__name">azjezz/psl</div>
  <div class="text-xl" style="color: #d6d3d1">A dev dependency, shipped to production.<br>Its <code>files</code> autoload is <strong style="color: #fafaf9">compiled on every boot</strong>.</div>
  <div v-click="1" class="model-card">
    <div class="model-card__value">−570</div>
    <div class="model-card__label">dev-only files, gone with <code>--no-dev</code><br><span class="estimate">≈ 1.4–2.3 s (estimate)</span></div>
  </div>
</div>

</div>

<Slugline />

<!--
The second organ: autoloading. azjezz/psl, a dev dependency, shipped to production: the no-dev flag had been commented out in the Dockerfile.
It declares a files autoload: five hundred and forty-seven files, compiled on every boot. Nobody called a single one.

[click] One flag in the Dockerfile, no-dev, and every dev package leaves the image: psl, plus a few others.
Five hundred and seventy fewer files. Roughly one and a half to two seconds, estimated.
-->

---
layout: blank
class: film
act: IV
scene: 3
slug: THE CONTAINER — TWO PATHS
clicks: 3
markers: false
transition: cut
---

<Camera
  :set-width="5200"
  :set-height="3250"
  :shots="[
    { x: 2600, y: 1050, zoom: 0.185, duration: 1.2 },
    { x: 4050, y: 640, zoom: 0.42, duration: 2.2 },
    { x: 1950, y: 1250, zoom: 0.27, duration: 2.2 },
    { x: 4050, y: 700, zoom: 0.42, duration: 2 },
  ]"
>
  <template #default="{ clicks }">
    <TwoDoorsSet :clicks="clicks" />
  </template>
</Camera>

<Slugline />

<!--
The third organ: the compiled container. Every request was building UserService, and its sixteen dependencies.
Two paths lead to it. Path one, in the firewall, on every request. Path two, after the response, in our terminate listener.

[click] At first, we only saw path two. We cut it, expecting eighty-one fewer files.
Result: zero. Nothing changed.

[click] Because path one runs first, on every request. To know whether it supports the request,
the AuthenticatorManager loops over every authenticator of the firewall — so it builds every one of them.
One of them needs indirectly UserService. By the time the terminate listener runs, UserService is already built.

[click] We made that handler lazy. Eighty-one fewer files: Two to three hundred milliseconds.
Cutting one path out of two does not get you halfway. It gets you nothing.
-->

---
layout: blank
class: film
act: IV
scene: 4
slug: VENDOR DIRECTORY — AUTOLOADED FILES
transition: cut
---

<div class="h-full flex flex-col justify-center gap-6 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">Smaller organs, same disease</div>

<div class="flex gap-6">
  <div class="counter-card">
    <div class="counter-card__title">google/apiclient · aliases.php</div>
    <div class="counter-card__ratio" style="color: #fafaf9; font-size: 1.9rem">19 aliases → 21 files</div>
    <div class="counter-card__verdict"><code>class_alias()</code> autoloads its first argument. Nobody used the <code>Google_*</code> names.</div>
    <div class="estimate">−21 files ≈ 50–85 ms (estimate)</div>
  </div>
  <div class="counter-card">
    <div class="counter-card__title">symfony/polyfill-*</div>
    <div class="counter-card__ratio" style="color: #fafaf9; font-size: 1.9rem">13 → 0 bootstrap files</div>
    <div class="counter-card__verdict">Run on every request, doing nothing on PHP 8.5. One was alive: <code>ext-uuid</code> had to be installed first.</div>
    <div class="estimate">−13 files ≈ 30–50 ms (estimate)</div>
  </div>
</div>

<div>
  <div class="report-strip">
    <span class="report-strip__label">Contributing factors</span>
    <span class="report-strip__value" style="font-size: 0.95rem">our own observability · dev dependencies · eager services</span>
  </div>
</div>

</div>

<Slugline />

<!--
Two smaller ones. 

Nineteen Google class aliases: The function class_alias autoloads its first argument,
so twenty-one files were compiled on every boot, for names nobody used.

And thirteen polyfill bootstrap files, run on every request, doing nothing on PHP 8.5.
-->

---
layout: blank
class: film
act: IV
scene: 5
slug: LAB
protocol: 6
protocolClick: 2
clicks: 2
transition: cut
---

<div class="h-full flex flex-col justify-center gap-3 px-16">

<div class="scene-line text-2xl" style="color: #fafaf9">Announce the number. Then deploy.</div>

<div class="prediction-table">
  <div class="prediction-row prediction-row--head"><span>Fix</span><span>Predicted</span><span>Measured</span></div>
  <div class="prediction-row"><span>drop the <code>Google_*</code> aliases</span><span>958 → 937 files</span><span class="prediction-row__ok">937 ✓</span></div>
  <div class="prediction-row"><span>drop every polyfill</span><span>933 → 920 files</span><span class="prediction-row__ok">920 ✓</span></div>
  <div v-click="1" class="prediction-row"><span>cut path 2 first</span><span>1,041 → 960 files</span><span class="prediction-row__miss">1,041 · 0 files ✗ <small>the fix did nothing</small></span></div>
  <div v-click="1" class="prediction-row"><span>then cut path 1</span><span class="prediction-row__none">—</span><span class="prediction-row__ok">960 · −81</span></div>
</div>

<div v-if="$clicks >= 2" class="protocol-step">
  <EvidenceMarker class="protocol-step__marker" :number="6" size="7rem" ruler />
  <div>
    <div class="scene-line text-2xl" style="color: #fde68a">Predict before you cut.</div>
    <div class="text-base" style="color: #d6d3d1">Write the expected count down before deploying. Then check it.</div>
  </div>
</div>

</div>

<Slugline />

<!--
Working with AI agents change everything. An agent always explains its fix convincingly — and mine was confidently wrong,
more than once. So before letting it deploy anything, I started asking for one thing: How many files will this remove? An explanation can't be checked. A number can.

Dropping the Google aliases: we predicted nine hundred and thirty-seven files. We measured nine hundred and thirty-seven.
Dropping every polyfill: we predicted nine hundred and twenty. Nine hundred and twenty.

[click] And the two paths. We got no change. That's a fail. We should look deeper
Then path one: eighty-one files fewer.

[click] [ 🎵 ]

Sixth and last step: predict before you cut. Then check it after deploying. Why ? Because we had some good surprises : I removed 1 file, 4 were gone in production because it was the last use of a parent class and 2 interfaces
-->

---
layout: blank
class: film
act: IV
scene: 6
slug: LAB — A FEW DAYS AGO
transition: fade-black
---

<div class="h-full flex flex-col justify-center gap-6 px-16">

<div class="scene-line text-3xl" style="color: #fafaf9">Found while preparing this talk</div>

<PrLedger />

</div>

<Slugline />

<!--
The search never stops. While preparing this talk, we found three more.

- One: a lookup for a built-in scalar resolved our whole configured types list: forty-eight types, down to eleven, with a small listener. Seventy-six files less.
- Two: a permission service built every rule to use one. Now it builds only the one it needs. Sixteen files.
- Three: Gedmo re-read entity attributes on every request. We gave it a cache. Twenty-four files.
- Together: a hundred and sixteen files. About four hundred milliseconds.
-->

---
layout: blank
class: film
act: IV
scene: 7
slug: CLOUD RUN — THE FIRST READ
clicks: 3
transition: cut
---

<div class="h-full flex flex-col justify-center gap-3 px-16 pt-10">

<div class="scene-line text-3xl" style="color: #fafaf9">It wasn't working. It was waiting.</div>

<div v-click="1" class="flex flex-col gap-2">
  <div class="flex gap-5 first-read__counters">
    <div class="counter-card">
      <div class="counter-card__title">Waiting for the disk</div>
      <div class="counter-card__ratio" style="color: #fca5a5">75 % <span class="first-read__of">of the request</span></div>
      <div class="first-read__gauge" role="img" aria-label="75 percent of the request spent waiting for the disk"><div style="width: 75%" /></div>
    </div>
    <div class="counter-card">
      <div class="counter-card__title">Blocks read</div>
      <div class="counter-card__ratio" style="color: #fafaf9">43,800</div>
      <div class="counter-card__verdict">≈ 22 MB from the image</div>
    </div>
    <div class="counter-card">
      <div class="counter-card__title">Voluntary waits / preemptions</div>
      <div class="counter-card__ratio" style="color: #fafaf9">3,116 / 2</div>
    </div>
  </div>
</div>

<div v-click="2" class="text-base" style="color: #d6d3d1">Fix: read the ~2,000 hot files in parallel before Apache starts (7 % of ~26,000).</div>

<div v-click="3" class="flex flex-col gap-2">
  <div class="first-read__results">
    <div class="pr-split__head" />
    <div class="pr-split__head">without</div>
    <div class="pr-split__head">with</div>
    <div class="first-read__label">Request</div>
    <div class="first-read__value">7.4 s</div>
    <div class="first-read__value first-read__value--win">1.7 s</div>
    <div class="first-read__label">full cold start (container + request)</div>
    <div class="first-read__value">9.3 s</div>
    <div class="first-read__value first-read__value--win">4.3 s</div>
    <div class="first-read__label">blocks read by PHP</div>
    <div class="first-read__value">43,800</div>
    <div class="first-read__value first-read__value--win">3,248</div>
  </div>
</div>

</div>

<Slugline />

<!--
One last body to open. Remember the vote? One point seven milliseconds to fetch each file from the image.

[click] We asked the PHP process itself, on one cold request.
Three quarters of the request: waiting for the disk.
Three thousand times it went to sleep waiting for a read. Only twice did it lack CPU.
It wasn't working. It was waiting.

[click] The fix is almost boring: before Apache starts, read the two thousand files we need, in parallel.
We didn't guess the list: we replayed our own cold requests and kept what PHP actually opened. Seven percent of the files on disk.

[click] The request: seven point four seconds, down to one point seven.
The full cold start: nine point three, down to four point three.
The prefetch itself takes four tenths of a second; everything included, the full cold start still drops by five seconds.
-->

---
layout: blank
markers: false
transition: fade-black
---

<ActCard act="V" title="The autopsy report" />

<!--
# Act five. The autopsy report. Time to sign it.
-->

---
layout: blank
class: film
act: V
scene: 1
slug: MORGUE — THE WHOLE STORY
clicks: 1
transition: cut
---

<div class="h-full flex flex-col justify-center gap-2 px-14">

<FilesVsMsChart :show-files="$clicks >= 1" />

</div>

<Slugline />

<!--
On the left, production: fourteen seconds, then eleven point four after the router fix. Another instrument, so its own box.

Then the same request

Top line: the cold start time. Two big drops :
- our observability tool
- then the dev dependencies.

Then the small fixes

[click] Bottom line: the files compiled. The same two big drops. Then small steps, always down.
The exception fix: two files fewer. So the slower run was the environment, not the code.

Not on this chart, because they were measured on our heaviest query: the hot files read in parallel, five point seven seconds,
and the three changes we found preparing this talk.
-->

---
layout: blank
class: film
act: V
scene: 2
slug: MORGUE — THE TITLE ON TRIAL
clicks: 1
transition: cut
---

<div class="h-full flex flex-col items-center justify-center gap-8">

<div class="scene-line text-3xl" style="color: #fafaf9">The title, on trial</div>

<div v-click="1" class="flex gap-20">
  <div class="text-center">
    <div class="title-trial__number">1.73 s</div>
    <div class="title-trial__caption">night 1</div>
  </div>
  <div class="text-center">
    <div class="title-trial__number">1.69 s</div>
    <div class="title-trial__caption">night 2</div>
  </div>
</div>


</div>

<Slugline />

<!--
Remember the case title ? Fourteen seconds to one point eight. Let's put it on trial.

Real cold starts: a brand-new instance, the first request it ever serves.

[click] Two nights in a row. Median: 
- one point seven three seconds
- then one point six nine.
-->

---
layout: blank
class: film
act: V
scene: 3
slug: MORGUE — CASE CLOSED
transition: fade-black
markers: false
clicks: 1
---

<div class="h-full flex items-center">
<AutopsyReport
  cause-of-death="router cache compiled on the first request"
  failed-treatments="preload, shipped opcodes"
  contributing-factors="our own observability · dev dependencies · eager services · the streamed image"
  :protocol="6"
  :signed="$clicks >= 1"
/>
</div>

<Slugline />

<!--
The autopsy report, as promised.

- **Cause of death**: a router cache compiled on the first request. 
- **Failed treatments**: preload, and shipped opcodes.
- **Contributing factors**: our own observability, dev dependencies, eager services — and the streamed image, every file fetched on its first read. Reading the hot files in parallel saved five point seven seconds.

[click] Case closed. _[ 🧤 Remove gloves]_
-->

---
layout: blank
class: film
markers: false
transition: fade-black
---

<div class="finale h-full flex flex-col justify-center gap-3 px-12">

<div class="flex items-center gap-10">

<div class="finale__main flex-1 flex flex-col gap-4">

<div class="scene-line text-3xl" style="color: #fafaf9">The protocol. Take it home.</div>

<div class="protocol-recap protocol-recap--compact">
  <EvidenceMarker :number="1" size="2.5rem" />
  <div><div class="protocol-recap__step">Read the case file before the body.</div><div class="protocol-recap__how">Installed version, changelog, issue tracker — then the source.</div></div>
  <EvidenceMarker :number="2" size="2.5rem" />
  <div><div class="protocol-recap__step">Establish the time of death — on three layers.</div><div class="protocol-recap__how">Client, platform, application. They never agree.</div></div>
  <EvidenceMarker :number="3" size="2.5rem" />
  <div><div class="protocol-recap__step">Take its temperature. Alive is not warm.</div><div class="protocol-recap__how">Check OPcache's hits and misses before you trust an instance.</div></div>
  <EvidenceMarker :number="4" size="2.5rem" />
  <div><div class="protocol-recap__step">Dissect every marker.</div><div class="protocol-recap__how">A marker says where you stopped the clock, not what happened in between.</div></div>
  <EvidenceMarker :number="5" size="2.5rem" />
  <div><div class="protocol-recap__step">Examine the body, not only the clock.</div><div class="protocol-recap__how">Count the files compiled and the services built.</div></div>
  <EvidenceMarker :number="6" size="2.5rem" />
  <div><div class="protocol-recap__step">Predict before you cut.</div><div class="protocol-recap__how">Write the expected count down before deploying. Then check it.</div></div>
</div>

<div class="finale-credits">
  <div>Special thanks to:</div>
  <div><strong>Nicolas Demay</strong>, first on the scene</div>
  <div><strong>kieljohn</strong> &amp; <strong>MatTheCat</strong>, symfony#59703 · #61115</div>
</div>

</div>

<div class="finale-qrs">
  <div class="finale-qr">
    <img src="/talk-repo-qr.svg" alt="QR code to the talk repository on GitHub">
    <div class="finale-qr__note finale-qr__note--top">Slides &amp;<br>more stuff<svg class="finale-qr__arrow" viewBox="0 0 120 70" aria-hidden="true"><path d="M8 6 C 6 48, 46 68, 110 44" /><path d="M94 41 L110 44 L100 57" /></svg></div>
  </div>
  <div class="finale-qr">
    <img src="/vasco-hiring-qr.svg" alt="QR code to my LinkedIn profile">
    <div class="finale-qr__note finale-qr__note--bottom">My LinkedIn<br>Vasco is hiring!<svg class="finale-qr__arrow" viewBox="0 0 120 70" aria-hidden="true"><path d="M8 6 C 6 48, 46 68, 110 44" /><path d="M94 41 L110 44 L100 57" /></svg></div>
  </div>
</div>

</div>

</div>

<!--
Here is a quick summary of what we have seen earlier.

Special thanks to Nicolas Demay, first on the scene; to kieljohn and MatTheCat, who reported and fixed the router bug, and of course all Symfony contributors.

The slides and more stuff are on GitHub: first QR code.

The second QR code is my LinkedIn if you want us to exchange. And even in the AI era, we are still hiring at Vasco: reach out.

Thank you.
-->
