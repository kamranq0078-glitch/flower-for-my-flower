(() => {
  const BLOOM = {
    bouquetCount: 100,
    petals: 9,
    staggerMs: 58,
    colors: ['#ed4966','#f65c73','#dc3158','#ff7883','#c92750','#f04d68'],
    edge: '#7e1938'
  };
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  const box = document.querySelector('#box');
  const garden = document.querySelector('#garden');
  const floaters = document.querySelector('#floaters');
  const line = document.querySelector('#line');
  const eyebrow = document.querySelector('#eyebrow');
  const next = document.querySelector('#continue');
  const progress = document.querySelector('#progress');
  let step = 0;
  const points = Array.from({length:BLOOM.bouquetCount}, (_,i) => {
    if (i === 0) return {x:50,y:8,size:104,height:187,tilt:0};
    const t = (i-1)/(BLOOM.bouquetCount-2);
    const row = Math.floor(t*9), col = i%11;
    const x = 10+col*8+(Math.random()-.5)*4;
    const y = 5+row*2.5+(Math.random()-.5)*3;
    const size = 36+Math.random()*25;
    return {x:Math.max(7,Math.min(93,x)),y:y,size:size,height:size*1.8,tilt:(Math.random()-.5)*12};
  });

  function svgNode(name, attrs) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(key => n.setAttribute(key, attrs[key]));
    return n;
  }
  function addGradient(defs, id, stops, radial) {
    const g = svgNode(radial ? 'radialGradient' : 'linearGradient', {id:id});
    if (radial) { g.setAttribute('cx','32%'); g.setAttribute('cy','22%'); g.setAttribute('r','78%'); }
    else { g.setAttribute('x1','0'); g.setAttribute('y1','0'); g.setAttribute('x2','0.85'); g.setAttribute('y2','1'); }
    stops.forEach(pair => {
      const s = svgNode('stop', {'offset':pair[0],'stop-color':pair[1]});
      g.append(s);
    });
    defs.append(g);
  }
  function makeRose(i) {
    const p = points[i], tone = BLOOM.colors[i % BLOOM.colors.length];
    const el = document.createElement('div');
    el.className = 'rose';
    [['--x',p.x+'%'],['--y',p.y+'%'],['--size',p.size+'px'],['--height',p.height+'px'],['--tilt',p.tilt+'deg'],['--tone',tone],['--edge',BLOOM.edge]].forEach(v => el.style.setProperty(v[0],v[1]));
    const svg = svgNode('svg', {viewBox:'0 0 100 180','aria-hidden':'true'});
    svg.append(svgNode('path',{d:'M50 63 C48 92 58 124 50 173',class:'stem'}));
    [['M51 116 Q22 93 17 107 Q27 127 51 122','leaf'],['M51 143 Q76 116 84 130 Q79 148 51 148','leaf']].forEach(v => svg.append(svgNode('path',{d:v[0],class:v[1]})));
    const defs = svgNode('defs');
    const gradId = 'rose-'+i+'-petal', sheenId = 'rose-'+i+'-sheen';
    addGradient(defs,gradId,[['0%','#ff9aa0'],['34%',tone],['100%','#9a173b']],false);
    addGradient(defs,sheenId,[['0%','#ffd0bd'],['42%',tone],['100%','#a4193d']],true);
    svg.append(defs);
    svg.append(svgNode('path',{d:'M50 59 C39 53 31 59 30 68 Q41 66 50 75 Q59 66 70 68 C69 59 61 53 50 59Z',fill:'#638551',class:'calyx'}));
    const rings = [
      {count:BLOOM.petals,scale:1,offset:0,d:'M50 65 C30 60 14 43 20 26 C25 11 43 16 50 65 Z',fill:'url(#'+gradId+')',delay:0},
      {count:Math.max(5,Math.round(BLOOM.petals*.78)),scale:.77,offset:18,d:'M50 65 C35 59 24 44 29 29 C34 17 47 25 50 65 Z',fill:'url(#'+sheenId+')',delay:110},
      {count:Math.max(3,Math.round(BLOOM.petals*.55)),scale:.53,offset:36,d:'M50 65 C41 59 35 47 39 35 C43 26 49 36 50 65 Z',fill:'url(#'+gradId+')',delay:220}
    ];
    rings.forEach((ring,layer) => {
      for (let j=0;j<ring.count;j++) {
        const petal = svgNode('path',{d:ring.d,class:'petal petal-layer-'+layer,fill:ring.fill});
        const angle = 360*j/ring.count+ring.offset+(Math.random()-.5)*5;
        petal.style.setProperty('--fan',angle+'deg');
        petal.style.setProperty('--scale',ring.scale);
        petal.style.setProperty('--petal-fill',ring.fill);
        petal.style.setProperty('--delay',(ring.delay+j*BLOOM.staggerMs/3)+'ms');
        petal.style.setProperty('--dur',(REDUCED.matches?.18:1.05+Math.random()*.45)+'s');
        svg.append(petal);
      }
    });
    svg.append(svgNode('path',{d:'M50 63 C43 57 46 48 52 49 C59 50 59 58 50 63Z',fill:'#ffb2a7',class:'rose-heart'}));
    el.append(svg);
    garden.append(el);
    return el;
  }
  function openRose(el) {
    el.classList.add('visible');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  }
  function burst(x,y,count) {
    for (let i=0;i<(count || 9);i++) {
      const s=document.createElement('i'); s.className='spark';
      s.style.left=(x+(Math.random()-.5)*60)+'px'; s.style.top=(y+(Math.random()-.5)*40)+'px';
      s.style.setProperty('--dx',((Math.random()-.5)*100)+'px'); s.style.setProperty('--dy',(-20-Math.random()*75)+'px');
      floaters.append(s); setTimeout(() => s.remove(),1000);
    }
  }
  function petals(count) {
    for (let i=0;i<(count || 4);i++) {
      const p=document.createElement('i'); p.className='drift';
      p.style.left=(20+Math.random()*60)+'%'; p.style.top=(45+Math.random()*30)+'%';
      p.style.setProperty('--dx',((Math.random()-.5)*150)+'px'); p.style.setProperty('--turn',((Math.random()-.5)*260)+'deg');
      p.style.setProperty('--life',(5+Math.random()*5)+'s');
      floaters.append(p); setTimeout(() => p.remove(),10500);
    }
  }
  function show(n) { progress.style.width=Math.min(100,n*20)+'%'; next.classList.remove('ready'); }
  function prepareNext() { next.classList.add('ready'); }

  document.querySelector('#unwrap').addEventListener('click', () => {
    if (step!==0) return;
    step=1; show(step); box.classList.add('unwrapped');
    line.textContent='I couldn’t bring you an entire bouquet today.';
    eyebrow.textContent='Just one, to begin with';
    setTimeout(() => { box.classList.add('done'); openRose(makeRose(0)); prepareNext(); }, REDUCED.matches?160:900);
  });
  next.addEventListener('click', () => {
    if (step===1) {
      step=2; show(step); line.textContent='So I made you a hundred instead.';
      eyebrow.textContent='A little more, with every heartbeat';
      for (let i=1;i<BLOOM.bouquetCount;i++) {
        const delay=REDUCED.matches?Math.floor(i/15)*40:i*BLOOM.staggerMs/4+Math.random()*250;
        setTimeout(() => { openRose(makeRose(i)); if(i%14===0) burst(window.innerWidth/2,window.innerHeight*.46,3); },delay);
      }
      const wait=REDUCED.matches?900:(BLOOM.bouquetCount-1)*BLOOM.staggerMs/4+2300;
      setTimeout(() => {
        step=3; show(step);
        line.innerHTML='<span class="final-copy">It’s not real. It won’t wilt, and it didn’t cost a thing — except the hours I spent trying to make something out of nothing because you deserve flowers even when I can’t buy them.</span><span class="signature">I love you. This is what that looks like when I build it instead of buy it.<br>— Kamran</span>';
        eyebrow.textContent='Made slowly, just for you'; prepareNext(); petals(12);
      },wait);
    } else if (step===3) { petals(12); burst(window.innerWidth/2,window.innerHeight*.6,12); }
  });
  document.querySelector('#stage').addEventListener('click', e => {
    if(step>=2){burst(e.clientX,e.clientY,8);petals(3);}
  });
})();
