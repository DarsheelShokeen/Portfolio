(function(){
const canvas=document.getElementById('particle-canvas');
if(!canvas)return;
const ctx=canvas.getContext('2d');
let w,h,particles=[],mouse={x:-1e3,y:-1e3};
const C={count:80,minS:.5,maxS:1.5,spd:.15,connDist:120,mouseR:150,baseOp:.25,lineOp:.06};
function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
function mkP(){return{x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*C.spd,vy:(Math.random()-.5)*C.spd,sz:C.minS+Math.random()*(C.maxS-C.minS),op:C.baseOp*(.3+Math.random()*.7),ps:.005+Math.random()*.01,pp:Math.random()*Math.PI*2};}
function init(){resize();particles=[];const n=Math.min(C.count,Math.floor(w*h/12000));for(let i=0;i<n;i++)particles.push(mkP());}
function animate(t){
ctx.clearRect(0,0,w,h);
for(const p of particles){
p.x+=p.vx;p.y+=p.vy;
const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
if(d<C.mouseR&&d>0){const f=(C.mouseR-d)/C.mouseR*.02;p.vx+=dx/d*f;p.vy+=dy/d*f;}
p.vx*=.999;p.vy*=.999;
if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;
if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10;
const pulse=Math.sin(t*p.ps+p.pp)*.3+.7;
    const isLight = document.documentElement.classList.contains('light-mode');
    const rgb = isLight ? '0,0,0' : '255,255,255';
    ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);
    ctx.fillStyle=`rgba(${rgb},${p.op*pulse})`;ctx.fill();
}
for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
    const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<C.connDist){
        const a=(1-d/C.connDist)*C.lineOp;
        const isLight = document.documentElement.classList.contains('light-mode');
        const rgb = isLight ? '0,0,0' : '255,255,255';
        ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(${rgb},${a})`;ctx.lineWidth=.5;ctx.stroke();
    }
}
requestAnimationFrame(animate);
}
addEventListener('resize',()=>{resize();if(Math.abs(particles.length-Math.floor(w*h/12000))>10)init();});
document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
document.addEventListener('mouseleave',()=>{mouse.x=-1e3;mouse.y=-1e3;});
init();animate(0);
})();
