// Builds the card videos in public/showcase/ from the Claude showcase artifacts.
// Each artifact is a 1920 x 1080 animated React stage with its own player UI. This swaps the
// player for a chromeless embed loop: the stage scaled to fill the frame, looping, and playing
// only while the page says it's on screen (postMessage 'play' / 'pause').
//
// Usage: node scripts/build-showcases.mjs <slug>=<artifact.html> [...]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/showcase')
mkdirSync(outDir, { recursive: true })

const RENDER_CALL = /ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\(React\.createElement\((?:Player|App),\s*null\)\)/

const embed = (background) => `(function(){
const LEN=typeof DURATION!=="undefined"?DURATION:DUR;
// Players built on DURATION hand Stage base time (t / PACE); the Zync player hands it real time.
const STAGE_T=typeof DURATION!=="undefined"?1/PACE:1;
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
const root=ReactDOM.createRoot(document.getElementById("root"));
// Start a little in, so a card that hasn't played yet already shows its opening, not an empty stage.
let t=still?LEN*0.3:LEN*0.05,last=0,frame=0,playing=false;
const draw=()=>{const s=Math.max(innerWidth/1920,innerHeight/1080);
root.render(React.createElement("div",{style:{position:"fixed",inset:0,overflow:"hidden",background:"${background}"}},
React.createElement("div",{style:{position:"absolute",left:(innerWidth-1920*s)/2,top:(innerHeight-1080*s)/2,width:1920,height:1080,transformOrigin:"0 0",transform:"scale("+s+")"}},
React.createElement(Stage,{t:t*STAGE_T}))))};
const tick=now=>{if(last)t=(t+Math.min(0.1,(now-last)/1000))%LEN;last=now;draw();frame=playing?requestAnimationFrame(tick):0};
const play=()=>{if(playing||still)return;playing=true;last=0;frame=requestAnimationFrame(tick)};
const pause=()=>{playing=false;cancelAnimationFrame(frame);frame=0};
addEventListener("message",e=>{if(e.data==="showcase:play")play();else if(e.data==="showcase:pause")pause()});
addEventListener("resize",draw);
(document.fonts?document.fonts.ready:Promise.resolve()).then(draw);
draw();
})()`

// Players without a separate Stage (they draw the stage inside their own full-window player)
// expose window.__zync = { seek, play, pause, duration }. For those the player stays and this
// drives it: controls hidden (their H key), paused until 'showcase:play', looped at the end.
const driver = `<script>(function(){
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
let ready=false,want=false,pos=0,since=0,timer=0;
const z=()=>window.__zync;
const play=()=>{want=true;if(!ready||still)return;clearTimeout(timer);z().seek(pos);z().play();since=performance.now();timer=setTimeout(()=>{pos=0;play()},(z().duration-pos)*1000)};
const pause=()=>{if(ready&&want){pos=(pos+(performance.now()-since)/1000)%z().duration;z().pause();clearTimeout(timer)}want=false};
const init=()=>{if(!z())return setTimeout(init,50);
dispatchEvent(new KeyboardEvent("keydown",{key:"h",code:"KeyH"}));
pos=z().duration*(still?0.3:0.05);z().pause();z().seek(pos);ready=true;if(want){want=false;play()}};
addEventListener("message",e=>{if(e.data==="showcase:play")play();else if(e.data==="showcase:pause")pause()});
init();
})()</script>`

for (const arg of process.argv.slice(2)) {
  const [slug, file] = arg.split('=')
  const html = readFileSync(file, 'utf8')
  const hasStage = /function Stage\(/.test(html) && RENDER_CALL.test(html)
  if (!hasStage && !html.includes('window.__zync')) throw new Error(`${slug}: no Stage or player API found`)
  const background = slug === 'gym-crm' ? '#F5F6FA' : '#000'
  const out = (hasStage ? html.replace(RENDER_CALL, embed(background)) : html.replace(/<\/body>(?![\s\S]*<\/body>)/, `${driver}</body>`))
    .replace(/<title>[^<]*<\/title>/, '<title>Showcase</title>')
  writeFileSync(resolve(outDir, `${slug}.html`), out)
  console.log(`${slug}.html  ${(out.length / 1024).toFixed(0)} KB`)
}
